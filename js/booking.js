(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var modal = $('#bookingModal');
  var form = $('#bookingForm');
  if (!modal || !form) return;

  /* ---------- Налаштування ---------- */
  var WORK_START = 9 * 60;   // 09:00
  var WORK_END = 20 * 60;    // 20:00
  var SLOT_STEP = 30;        // хвилин
  var HORIZON_DAYS = 60;     // на скільки днів наперед можна записатись
  var LAST_STEP = 6;

  var MONTHS = ['січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'];
  var MONTHS_SHORT = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];
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

  /* ---------- Stepper: в HTML 4 пункти, додаємо кроки 5 і 6 ---------- */
  if (stepper) {
    [[5, 'Дані'], [6, 'Підтвердження']].forEach(function (s) {
      if ($('[data-step-ind="' + s[0] + '"]', stepper)) return;
      var li = document.createElement('li');
      li.className = 'stepper__item';
      li.setAttribute('data-step-ind', s[0]);
      li.innerHTML = '<span class="stepper__dot">' + s[0] + '</span><span class="stepper__label">' + s[1] + '</span>';
      stepper.appendChild(li);
    });
  }

  /* ---------- Утиліти ---------- */
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromISO(s) {
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function fmtTime(min) { return pad(Math.floor(min / 60)) + ':' + pad(min % 60); }
  function fmtDateLong(d) {
    return d.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  /* ---------- Стан ---------- */
  var state = { step: 1, done: false };
  var today = startOfDay(new Date());
  var maxDate = addDays(today, HORIZON_DAYS);
  var view = { y: today.getFullYear(), m: today.getMonth() };

  function checked(name) { return form.querySelector('input[name="' + name + '"]:checked'); }
  function getService() {
    var el = checked('service');
    return el ? { value: el.value, name: el.getAttribute('data-name'), duration: +el.getAttribute('data-duration'), price: +el.getAttribute('data-price') } : null;
  }
  function getMaster() {
    var el = checked('master');
    return el ? { value: el.value, name: el.getAttribute('data-name') } : null;
  }

  /* ---------- Слоти: кожні 30 хв, 09:00–20:00, без вигаданих зайнятих ---------- */
  function getSlots(dateISO, duration) {
    var list = [];
    var now = new Date();
    var isToday = dateISO === toISO(now);
    var nowMin = now.getHours() * 60 + now.getMinutes();
    for (var t = WORK_START; t + duration <= WORK_END; t += SLOT_STEP) {
      if (isToday && t <= nowMin) continue;
      list.push(t);
    }
    return list;
  }

  function renderSlots() {
    var svc = getService();
    slotsEl.innerHTML = '';
    if (!svc || !dateInput.value) return;
    dateLabel.textContent = fmtDateLong(fromISO(dateInput.value));
    var list = getSlots(dateInput.value, svc.duration);
    if (!list.length) {
      var p = document.createElement('p');
      p.className = 'slots__empty';
      p.textContent = 'На цю дату вільних годин немає. Оберіть іншу дату.';
      slotsEl.appendChild(p);
      timeInput.value = '';
      return;
    }
    var valid = false;
    list.forEach(function (t) {
      var label = fmtTime(t);
      var b = document.createElement('button');
      var sel = timeInput.value === label;
      b.type = 'button';
      b.className = 'slot' + (sel ? ' is-selected' : '');
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', sel ? 'true' : 'false');
      b.setAttribute('data-time', label);
      b.textContent = label;
      if (sel) valid = true;
      slotsEl.appendChild(b);
    });
    if (!valid) timeInput.value = '';
  }

  slotsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.slot');
    if (!b) return;
    timeInput.value = b.getAttribute('data-time');
    $$('.slot', slotsEl).forEach(function (s) {
      var on = s === b;
      s.classList.toggle('is-selected', on);
      s.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    updateNext();
  });

  /* ---------- Календар ---------- */
  function renderCalendar() {
    calTitle.textContent = MONTHS[view.m] + ' ' + view.y;
    calGrid.innerHTML = '';
    var first = new Date(view.y, view.m, 1);
    var offset = (first.getDay() + 6) % 7; // понеділок = 0
    var days = new Date(view.y, view.m + 1, 0).getDate();
    var i;
    for (i = 0; i < offset; i++) {
      var e = document.createElement('span');
      e.className = 'calendar__empty';
      calGrid.appendChild(e);
    }
    for (i = 1; i <= days; i++) {
      var d = new Date(view.y, view.m, i);
      var iso = toISO(d);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'calendar__day';
      b.setAttribute('data-date', iso);
      b.textContent = i;
      b.disabled = d < today || d > maxDate;
      if (iso === toISO(today)) b.classList.add('is-today');
      if (iso === dateInput.value) b.classList.add('is-selected');
      calGrid.appendChild(b);
    }
    calPrev.disabled = view.y === today.getFullYear() && view.m === today.getMonth();
    calNext.disabled = view.y === maxDate.getFullYear() && view.m === maxDate.getMonth();
  }

  function renderQuickDays() {
    quickDays.innerHTML = '';
    for (var i = 0; i < 7; i++) {
      var d = addDays(today, i);
      var iso = toISO(d);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'quickday' + (iso === dateInput.value ? ' is-selected' : '');
      b.setAttribute('data-date', iso);
      b.innerHTML = '<span>' + WEEKDAYS_SHORT[d.getDay()] + '</span><strong>' + d.getDate() + '</strong><span>' + MONTHS_SHORT[d.getMonth()] + '</span>';
      quickDays.appendChild(b);
    }
  }

  function selectDate(iso) {
    if (dateInput.value !== iso) timeInput.value = '';
    dateInput.value = iso;
    var d = fromISO(iso);
    view.y = d.getFullYear();
    view.m = d.getMonth();
    renderCalendar();
    renderQuickDays();
    updateNext();
  }

  calGrid.addEventListener('click', function (e) {
    var b = e.target.closest('.calendar__day');
    if (b && !b.disabled) selectDate(b.getAttribute('data-date'));
  });
  quickDays.addEventListener('click', function (e) {
    var b = e.target.closest('.quickday');
    if (b) selectDate(b.getAttribute('data-date'));
  });
  calPrev.addEventListener('click', function () {
    view.m--;
    if (view.m < 0) { view.m = 11; view.y--; }
    renderCalendar();
  });
  calNext.addEventListener('click', function () {
    view.m++;
    if (view.m > 11) { view.m = 0; view.y++; }
    renderCalendar();
  });

  /* ---------- Телефон ---------- */
  function formatPhone(raw) {
    var d = raw.replace(/\D/g, '');
    if (!d) return '';
    if ('380'.indexOf(d) !== 0 && d.indexOf('380') !== 0) {
      if (d.indexOf('80') === 0) d = '3' + d;
      else if (d.indexOf('0') === 0) d = '38' + d;
      else d = '380' + d;
    }
    d = d.slice(0, 12);
    var out = '+' + d.slice(0, 3);
    if (d.length > 3) out += ' ' + d.slice(3, 5);
    if (d.length > 5) out += ' ' + d.slice(5, 8);
    if (d.length > 8) out += ' ' + d.slice(8, 10);
    if (d.length > 10) out += ' ' + d.slice(10, 12);
    return out;
  }
  phoneInput.addEventListener('input', function (e) {
    var deleting = !!(e.inputType && e.inputType.indexOf('delete') === 0);
    phoneInput.value = deleting ? phoneInput.value.replace(/\s+$/, '') : formatPhone(phoneInput.value);
  });

  /* ---------- Валідація кроку 5 ---------- */
  function setError(key, msg) {
    var el = form.querySelector('[data-error="' + key + '"]');
    if (el) el.textContent = msg || '';
    var input = key === 'name' ? nameInput : key === 'phone' ? phoneInput : null;
    if (input && input.closest('.field')) input.closest('.field').classList.toggle('has-error', !!msg);
  }

  function validateContacts() {
    var ok = true;
    var name = nameInput.value.trim();
    var digits = phoneInput.value.replace(/\D/g, '');
    setError('name', '');
    setError('phone', '');
    setError('consent', '');
    if (name.length < 2) {
      setError('name', 'Вкажіть ім\'я (мінімум 2 символи)');
      ok = false;
    }
    if (digits.length !== 12 || digits.indexOf('380') !== 0) {
      setError('phone', 'Вкажіть коректний номер телефону');
      ok = false;
    }
    if (!consentInput.checked) {
      setError('consent', 'Потрібна згода на обробку даних');
      ok = false;
    }
    return ok;
  }

  [nameInput, phoneInput].forEach(function (inp) {
    inp.addEventListener('input', function () {
      var key = inp === nameInput ? 'name' : 'phone';
      if (inp.closest('.field').classList.contains('has-error')) setError(key, '');
    });
  });
  consentInput.addEventListener('change', function () { setError('consent', ''); });

  /* ---------- Підсумок ---------- */
  function fillSummary() {
    var svc = getService();
    var master = getMaster();
    var map = {
      service: svc ? svc.name + ' (' + svc.duration + ' хв)' : '',
      master: master ? master.name : '',
      date: dateInput.value ? fmtDateLong(fromISO(dateInput.value)) : '',
      time: timeInput.value,
      name: nameInput.value.trim(),
      phone: phoneInput.value,
      price: svc ? svc.price + ' грн' : ''
    };
    $$('[data-sum]', form).forEach(function (el) {
      el.textContent = map[el.getAttribute('data-sum')] || '';
    });
  }

  /* ---------- Навігація кроків ---------- */
  function stepValid(n) {
    switch (n) {
      case 1: return !!getService();
      case 2: return !!getMaster();
      case 3: return !!dateInput.value;
      case 4: return !!timeInput.value;
      default: return true;
    }
  }

  function updateNext() {
    if (state.done) return;
    btnNext.disabled = !stepValid(state.step);
  }

  function goTo(n) {
    state.step = Math.max(1, Math.min(LAST_STEP, n));
    statusEl.textContent = '';
    steps.forEach(function (s) {
      s.classList.toggle('is-active', +s.getAttribute('data-step') === state.step);
    });
    if (stepper) {
      $$('.stepper__item', stepper).forEach(function (li) {
        var i = +li.getAttribute('data-step-ind');
        li.classList.toggle('is-active', i === state.step);
        li.classList.toggle('is-done', i < state.step);
      });
    }
    if (state.step === 3) { renderCalendar(); renderQuickDays(); }
    if (state.step === 4) renderSlots();
    if (state.step === 6) fillSummary();
    btnBack.hidden = state.step === 1;
    btnNextLabel.textContent = state.step === LAST_STEP ? 'Підтвердити запис' : 'Далі';
    dialog.setAttribute('data-step', state.step);
    dialog.scrollTop = 0;
    updateNext();
  }

  btnBack.addEventListener('click', function () {
    if (state.step > 1) goTo(state.step - 1);
  });

  btnNext.addEventListener('click', function () {
    if (state.done) return;
    if (state.step === 5 && !validateContacts()) return;
    if (!stepValid(state.step)) return;
    if (state.step < LAST_STEP) { goTo(state.step + 1); return; }
    submit();
  });

  form.addEventListener('submit', function (e) { e.preventDefault(); });

  /* Зміна послуги змінює тривалість, тому час скидаємо */
  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t && t.name === 'service') timeInput.value = '';
    updateNext();
  });

  /* ---------- Відправка (backend ще не підключений) ---------- */
  function submit() {
    // Honeypot: бот заповнив приховане поле, тихо імітуємо успіх без жодної дії
    var isBot = honeypot && honeypot.value.trim() !== '';
    var svc = getService();
    var master = getMaster();
    var payload = {
      service: svc ? svc.value : '',
      serviceName: svc ? svc.name : '',
      duration: svc ? svc.duration : 0,
      price: svc ? svc.price : 0,
      master: master ? master.value : '',
      masterName: master ? master.name : '',
      date: dateInput.value,
      time: timeInput.value,
      name: nameInput.value.trim(),
      phone: phoneInput.value
    };
    if (!isBot) {
      // Точка підключення для backend/Supabase: слухайте цю подію
      document.dispatchEvent(new CustomEvent('booking:submit', { detail: payload }));
    }
    showSuccess(payload);
  }

  function showSuccess(p) {
    state.done = true;
    steps.forEach(function (s) { s.classList.remove('is-active'); });
    if (stepper) stepper.classList.add('is-hidden');
    actions.hidden = true;
    statusEl.textContent = '';
    successText.textContent = p.serviceName + ' · ' + p.masterName + ' · ' +
      fmtDateLong(fromISO(p.date)) + ' о ' + p.time + '. Ми зв\'яжемося з вами за номером ' + p.phone + '.';
    success.hidden = false;
    dialog.scrollTop = 0;
  }

  /* ---------- Скидання ---------- */
  function resetAll() {
    form.reset();
    state.done = false;
    dateInput.value = '';
    timeInput.value = '';
    slotsEl.innerHTML = '';
    setError('name', '');
    setError('phone', '');
    setError('consent', '');
    today = startOfDay(new Date());
    maxDate = addDays(today, HORIZON_DAYS);
    view.y = today.getFullYear();
    view.m = today.getMonth();
    success.hidden = true;
    actions.hidden = false;
    if (stepper) stepper.classList.remove('is-hidden');
    goTo(1);
  }

  btnReset.addEventListener('click', resetAll);

  /* ---------- Події модального вікна (з main.js) ---------- */
  modal.addEventListener('modal:open', function (e) {
    if (state.done) resetAll();
    var preset = e.detail && e.detail.service;
    if (preset) {
      var radio = form.querySelector('input[name="service"][value="' + preset + '"]');
      if (radio) {
        radio.checked = true;
        timeInput.value = '';
      }
    }
    goTo(state.step);
  });

  /* ---------- Старт ---------- */
  renderCalendar();
  renderQuickDays();
  goTo(1);
})();
