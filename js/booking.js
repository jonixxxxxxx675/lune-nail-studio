(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var modal = $('#bookingModal');
  var form = $('#bookingForm');

  if (!modal || !form) return;

  /* ---------- Налаштування ---------- */
  var WORK_START = 9 * 60;
  var WORK_END = 20 * 60;
  var SLOT_STEP = 30;
  var HORIZON_DAYS = 60;
  var LAST_STEP = 6;
  var STORAGE_KEY = 'lune_bookings_demo';

  var MONTHS = [
    'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень',
    'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'
  ];

  var WEEKDAYS_SHORT = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

  /* ---------- DOM ---------- */
  var dialog = $('#bk');
  var stepper = $('#stepper');
  var steps = $$('.bk__step', form);

  var btnNext = $('#bkNext');
  var btnNextLabel = $('#bkNextLabel');
  var btnBack = $('#bkBack');
  var btnReset = $('#bkReset');
  var actions = $('#bkActions');
  var success = $('#bkSuccess');
  var successText = $('#bkSuccessText');
  var statusEl = $('#bkStatus');

  var calTitle = $('#calTitle');
  var calGrid = $('#calGrid');
  var calPrev = $('#calPrev');
  var calNext = $('#calNext');
  var quickDays = $('#quickDays');
  var dateInput = $('#bkDate');
  var dateLabel = $('#bkDateLabel');
  var timeInput = $('#bkTime');
  var slotsEl = $('#timeSlots');
  var nameInput = $('#bk-name');
  var phoneInput = $('#bk-phone');
  var consentInput = form.elements.consent;
  var honeypot = $('#bk-website');

  /* ---------- State ---------- */
  var state = {
    step: 1,
    done: false,
    pendingService: null
  };

  var today = startOfDay(new Date());
  var maxDate = addDays(today, HORIZON_DAYS);
  var view = {
    y: today.getFullYear(),
    m: today.getMonth()
  };

  /* ---------- Utilities ---------- */
  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function addDays(d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function toISO(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function fromISO(value) {
    var parts = value.split('-');
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  function fmtTime(minutes) {
    return pad(Math.floor(minutes / 60)) + ':' + pad(minutes % 60);
  }

  function fmtDateLong(d) {
    return d.toLocaleDateString('uk-UA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  function checked(name) {
    return form.querySelector('input[name="' + name + '"]:checked');
  }

  function getService() {
    var el = checked('service');

    if (!el) return null;

    return {
      value: el.value,
      name: el.dataset.name,
      duration: Number(el.dataset.duration) || 0,
      price: Number(el.dataset.price) || 0
    };
  }

  function getMaster() {
    var el = checked('master');

    if (!el) return null;

    return {
      value: el.value,
      name: el.dataset.name,
      rating: el.dataset.rating || ''
    };
  }

  function setStatus(message, type) {
    statusEl.textContent = message || '';
    statusEl.className = 'bk__status' + (type ? ' is-' + type : '');
  }

  function clearStatus() {
    setStatus('');
  }

  /* ---------- Local demo storage ---------- */
  function readLocal() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (err) {
      return [];
    }
  }

  function writeLocal(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (err) {
      return false;
    }
  }

  function isBooked(dateISO, time) {
    var master = getMaster();
    var service = getService();

    return readLocal().some(function (item) {
      return item.date === dateISO &&
             item.time === time &&
             (!master || item.master === master.value) &&
             (!service || item.service === service.value);
    });
  }

  /* ---------- Stepper ---------- */
  function ensureStepper() {
    if (!stepper) return;

    var labels = {
      1: 'Послуга',
      2: 'Майстер',
      3: 'Дата',
      4: 'Час',
      5: 'Дані',
      6: 'Підтвердження'
    };

    [5, 6].forEach(function (stepNumber) {
      if ($('[data-step-ind="' + stepNumber + '"]', stepper)) return;

      var li = document.createElement('li');
      li.className = 'stepper__item';
      li.setAttribute('data-step-ind', String(stepNumber));
      li.innerHTML =
        '<span class="stepper__dot">' + stepNumber + '</span>' +
        '<span class="stepper__label">' + labels[stepNumber] + '</span>';

      stepper.appendChild(li);
    });
  }

  function renderStepper() {
    $$('.stepper__item', stepper).forEach(function (item) {
      var n = Number(item.getAttribute('data-step-ind'));

      item.classList.toggle('is-active', n === state.step);
      item.classList.toggle('is-done', n < state.step);
    });
  }

  /* ---------- Step visibility ---------- */
  function showStep(stepNumber) {
    state.step = stepNumber;
    state.done = false;

    steps.forEach(function (step) {
      step.classList.toggle('is-active', Number(step.dataset.step) === stepNumber);
    });

    renderStepper();
    updateActions();
    clearStatus();

    if (stepNumber === 3) {
      renderCalendar();
      renderQuickDays();
    }

    if (stepNumber === 4) {
      renderSlots();
    }

    if (stepNumber === 6) {
      renderSummary();
    }
  }

  /* ---------- Service / master events ---------- */
  function setPendingService(value) {
    state.pendingService = value || null;
  }

  function applyPendingService() {
    if (!state.pendingService) return;

    var input = form.querySelector(
      'input[name="service"][value="' +
      state.pendingService.replace(/"/g, '\\"') +
      '"]'
    );

    if (input) {
      input.checked = true;
    }

    state.pendingService = null;
  }

  function currentStepIsValid() {
    if (state.step === 1) return !!getService();
    if (state.step === 2) return !!getMaster();
    if (state.step === 3) return !!dateInput.value;
    if (state.step === 4) return !!timeInput.value;
    if (state.step === 5) return validateClientData();
    if (state.step === 6) return true;

    return false;
  }

  function updateNext() {
    var valid = currentStepIsValid();

    if (state.step === LAST_STEP) {
      btnNext.disabled = false;
      btnNextLabel.textContent = 'Підтвердити запис';
      return;
    }

    btnNext.disabled = !valid;
    btnNextLabel.textContent = state.step === 5 ? 'Перевірити запис' : 'Далі';
  }

  function updateActions() {
    btnBack.hidden = state.step <= 1;

    if (state.done) {
      actions.hidden = true;
      return;
    }

    actions.hidden = false;
    updateNext();
  }

  /* ---------- Calendar ---------- */
  function isClosedDay(d) {
    return d.getDay() === 0;
  }

  function isDateAllowed(d) {
    return !isClosedDay(d) && d >= today && d <= maxDate;
  }

  function renderCalendar() {
    if (!calTitle || !calGrid) return;

    calTitle.textContent = MONTHS[view.m] + ' ' + view.y;
    calGrid.innerHTML = '';

    var first = new Date(view.y, view.m, 1);
    var offset = (first.getDay() + 6) % 7;
    var days = new Date(view.y, view.m + 1, 0).getDate();

    for (var i = 0; i < offset; i++) {
      var empty = document.createElement('span');
      empty.className = 'calendar__empty';
      calGrid.appendChild(empty);
    }

    for (var day = 1; day <= days; day++) {
      var d = new Date(view.y, view.m, day);
      var iso = toISO(d);
      var button = document.createElement('button');

      button.type = 'button';
      button.className = 'calendar__day';
      button.dataset.date = iso;
      button.textContent = String(day);
      button.disabled = !isDateAllowed(d);

      if (iso === toISO(today)) button.classList.add('is-today');
      if (iso === dateInput.value) button.classList.add('is-selected');

      if (!button.disabled) {
        button.addEventListener('click', function () {
          dateInput.value = this.dataset.date;
          timeInput.value = '';
          renderCalendar();
          renderQuickDays();
          updateNext();
        });
      }

      calGrid.appendChild(button);
    }

    calPrev.disabled =
      view.y === today.getFullYear() &&
      view.m === today.getMonth();

    calNext.disabled =
      view.y === maxDate.getFullYear() &&
      view.m === maxDate.getMonth();
  }

  function renderQuickDays() {
    if (!quickDays) return;

    quickDays.innerHTML = '';

    var daysToShow = 7;

    for (var i = 0; i < daysToShow; i++) {
      var d = addDays(today, i);
      var iso = toISO(d);

      if (d > maxDate || isClosedDay(d)) continue;

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'quickday' + (iso === dateInput.value ? ' is-selected' : '');
      button.dataset.date = iso;

      button.innerHTML =
        '<span class="quickday__day">' + WEEKDAYS_SHORT[d.getDay()] + '</span>' +
        '<span class="quickday__num">' + d.getDate() + '</span>';

      button.addEventListener('click', function () {
        dateInput.value = this.dataset.date;
        timeInput.value = '';
        renderCalendar();
        renderQuickDays();
        updateNext();
      });

      quickDays.appendChild(button);
    }
  }

  if (calPrev) {
    calPrev.addEventListener('click', function () {
      if (view.m === 0) {
        view.m = 11;
        view.y -= 1;
      } else {
        view.m -= 1;
      }

      renderCalendar();
    });
  }

  if (calNext) {
    calNext.addEventListener('click', function () {
      if (view.m === 11) {
        view.m = 0;
        view.y += 1;
      } else {
        view.m += 1;
      }

      renderCalendar();
    });
  }

  /* ---------- Time slots ---------- */
  function getSlots(dateISO, duration) {
    var list = [];
    var now = new Date();
    var isToday = dateISO === toISO(now);
    var nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (var t = WORK_START; t + duration <= WORK_END; t += SLOT_STEP) {
      if (isToday && t <= nowMinutes) continue;

      var time = fmtTime(t);

      if (!isBooked(dateISO, time)) {
        list.push(t);
      }
    }

    return list;
  }

  function renderSlots() {
    if (!slotsEl) return;

    var service = getService();

    slotsEl.innerHTML = '';

    if (!service || !dateInput.value) return;

    dateLabel.textContent = fmtDateLong(fromISO(dateInput.value));

    var list = getSlots(dateInput.value, service.duration);

    if (!list.length) {
      var empty = document.createElement('p');
      empty.className = 'slots__empty';
      empty.textContent = 'На цю дату вільних годин немає. Оберіть іншу дату.';
      slotsEl.appendChild(empty);
      timeInput.value = '';
      updateNext();
      return;
    }

    list.forEach(function (minutes) {
      var label = fmtTime(minutes);
      var button = document.createElement('button');

      button.type = 'button';
      button.className = 'slot';
      button.setAttribute('role', 'radio');
      button.dataset.time = label;
      button.textContent = label;

      var selected = timeInput.value === label;

      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-checked', selected ? 'true' : 'false');

      button.addEventListener('click', function () {
        timeInput.value = this.dataset.time;

        $$('.slot', slotsEl).forEach(function (slot) {
          var on = slot === button;

          slot.classList.toggle('is-selected', on);
          slot.setAttribute('aria-checked', on ? 'true' : 'false');
        });

        updateNext();
      });

      slotsEl.appendChild(button);
    });

    updateNext();
  }

  /* ---------- Client validation ---------- */
  function clearFieldErrors() {
    $$('.field__error', form).forEach(function (el) {
      el.textContent = '';
    });

    $$('.field', form).forEach(function (field) {
      field.classList.remove('has-error');
    });
  }

  function setFieldError(name, message) {
    var field = form.querySelector('[name="' + name + '"]');
    var box = form.querySelector('[data-error="' + name + '"]');

    if (box) box.textContent = message || '';

    if (field) {
      var parent = field.closest('.field');
      if (parent) parent.classList.toggle('has-error', !!message);
    }
  }

  function validateClientData() {
    clearFieldErrors();

    var valid = true;
    var name = nameInput ? nameInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';

    if (name.length < 2) {
      setFieldError('name', "Введіть ім'я");
      valid = false;
    }

    if (!/^\+?[\d\s()\-]+$/.test(phone) ||
        phone.replace(/\D/g, '').length < 10 ||
        phone.replace(/\D/g, '').length > 13) {
      setFieldError('phone', 'Введіть коректний номер телефону');
      valid = false;
    }

    if (!consentInput || !consentInput.checked) {
      var consentError = form.querySelector('[data-error="consent"]');
      if (consentError) consentError.textContent = 'Потрібна згода на обробку даних';
      valid = false;
    }

    return valid;
  }

  /* ---------- Summary ---------- */
  function renderSummary() {
    var service = getService();
    var master = getMaster();

    var selected = {
      service: service ? service.name : '',
      master: master ? master.name : '',
      date: dateInput.value ? fmtDateLong(fromISO(dateInput.value)) : '',
      time: timeInput.value || '',
      name: nameInput ? nameInput.value.trim() : '',
      phone: phoneInput ? phoneInput.value.trim() : '',
      price: service ? service.price + ' грн' : ''
    };

    Object.keys(selected).forEach(function (key) {
      var target = form.querySelector('[data-sum="' + key + '"]');
      if (target) target.textContent = selected[key];
    });
  }

  /* ---------- Submit ---------- */
  function submitBooking() {
    var service = getService();
    var master = getMaster();

    if (!service || !master || !dateInput.value || !timeInput.value || !validateClientData()) {
      return false;
    }

    if (honeypot && honeypot.value) return false;

    var payload = {
      service: service.value,
      serviceName: service.name,
      master: master.value,
      masterName: master.name,
      date: dateInput.value,
      time: timeInput.value,
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      consent: true,
      createdAt: new Date().toISOString()
    };

    var all = readLocal();

    if (isBooked(payload.date, payload.time)) {
      setStatus('Цей час уже зайнятий. Оберіть інший.', 'error');
      showStep(4);
      return false;
    }

    all.push(payload);

    if (!writeLocal(all)) {
      setStatus('Не вдалося зберегти заявку. Спробуйте ще раз.', 'error');
      return false;
    }

    successText.textContent =
      payload.serviceName + ', ' +
      fmtDateLong(fromISO(payload.date)) + ', ' +
      payload.time + '. Ми зв’яжемося з вами для підтвердження.';

    success.hidden = false;
    success.classList.add('is-active');
    state.done = true;

    steps.forEach(function (step) {
      step.classList.remove('is-active');
    });

    if (stepper) stepper.classList.add('is-hidden');
    actions.hidden = true;
    setStatus('');
    return true;
  }

  /* ---------- Reset ---------- */
  function resetBooking() {
    state.step = 1;
    state.done = false;
    state.pendingService = null;

    form.reset();
    dateInput.value = '';
    timeInput.value = '';

    success.hidden = true;
    success.classList.remove('is-active');
    actions.hidden = false;

    if (stepper) stepper.classList.remove('is-hidden');

    clearFieldErrors();
    clearStatus();

    today = startOfDay(new Date());
    maxDate = addDays(today, HORIZON_DAYS);
    view = { y: today.getFullYear(), m: today.getMonth() };

    showStep(1);
  }

  /* ---------- Navigation ---------- */
  if (btnNext) {
    btnNext.addEventListener('click', function () {
      clearStatus();

      if (state.step < LAST_STEP) {
        if (!currentStepIsValid()) {
          if (state.step === 5) {
            setStatus('Перевірте, будь ласка, дані.', 'error');
          } else {
            setStatus('Оберіть потрібний варіант.', 'error');
          }
          return;
        }

        if (state.step === 5) {
          renderSummary();
        }

        showStep(state.step + 1);
        return;
      }

      submitBooking();
    });
  }

  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (state.step > 1) {
        showStep(state.step - 1);
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetBooking);
  }

  /* ---------- Input listeners ---------- */
  $$('input[name="service"]', form).forEach(function (input) {
    input.addEventListener('change', function () {
      timeInput.value = '';
      clearStatus();
      updateNext();

      if (state.step === 1) {
        window.setTimeout(updateNext, 0);
      }
    });
  });

  $$('input[name="master"]', form).forEach(function (input) {
    input.addEventListener('change', function () {
      timeInput.value = '';
      clearStatus();
      updateNext();
    });
  });

  if (nameInput) {
    nameInput.addEventListener('input', updateNext);
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', updateNext);
  }

  if (consentInput) {
    consentInput.addEventListener('change', updateNext);
  }

  /* ---------- Modal open hook ---------- */
  modal.addEventListener('modal:open', function (e) {
    var detail = e.detail || {};
    var requestedService = detail.service || null;

    if (requestedService) {
      setPendingService(requestedService);
      applyPendingService();
    }

    if (stepper) stepper.classList.remove('is-hidden');
    success.hidden = true;
    actions.hidden = false;

    showStep(1);
    renderCalendar();
    renderQuickDays();
  });

  modal.addEventListener('modal:close', function () {
    if (state.done) resetBooking();
  });

  /* ---------- Init ---------- */
  ensureStepper();
  showStep(1);
  renderCalendar();
  renderQuickDays();
})();
