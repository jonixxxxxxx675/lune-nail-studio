(function () {
  'use strict';
  if (!matchMedia('(max-width:767px)').matches) return;

  var styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = 'mobile-enhancements.css';
  document.head.appendChild(styleLink);

  var ACCOUNT_KEY = 'lune-account-v1';
  var ACCOUNT_KEY_MAIN = 'lune-account';
  var BOOKINGS_KEY = 'lune-bookings-v1';
  var BOOKINGS_KEY_MAIN = 'lune-bookings';

  function getAccount() {
    try { return JSON.parse(localStorage.getItem(ACCOUNT_KEY_MAIN) || localStorage.getItem(ACCOUNT_KEY) || 'null'); } catch (e) { return null; }
  }

  function setAccount(account) {
    try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account)); localStorage.setItem(ACCOUNT_KEY_MAIN, JSON.stringify(account)); } catch (e) {}
  }

  function getBookings() {
    try { var a=JSON.parse(localStorage.getItem(BOOKINGS_KEY_MAIN) || 'null'); if(Array.isArray(a)&&a.length)return a; return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]'); } catch (e) { return []; }
  }

  function setBookings(bookings) {
    try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings)); localStorage.setItem(BOOKINGS_KEY_MAIN, JSON.stringify(bookings)); } catch (e) {}
  }

  function waitForApp() {
    var app = document.querySelector('.lune-mobile-app');
    if (!app) return setTimeout(waitForApp, 40);
    init(app);
  }

  function init(app) {
    if (app.dataset.enhanced === '1') return;
    app.dataset.enhanced = '1';

    // The legacy profile modal is replaced by the dedicated mobile account page.
    var legacyProfile = app.querySelector('.lm-modal[data-modal=\"profile\"]');
    if (legacyProfile) legacyProfile.remove();

    var menu = app.querySelector('.lm-menu-panel');
    var accountOverlay = document.createElement('div');
    accountOverlay.className = 'lm-account-overlay';
    accountOverlay.setAttribute('aria-hidden', 'true');
    accountOverlay.innerHTML = `
      <div class="lm-account-shell">
        <div class="lm-account-head">
          <button class="lm-account-close" type="button" aria-label="Назад">‹</button>
          <div class="lm-account-head-title">
            <p>LUNE</p>
            <h2>Мій аккаунт</h2>
          </div>
          <span class="lm-account-head-spacer" aria-hidden="true"></span>
        </div>
        <div class="lm-account-card" data-account-root></div>
      </div>`;
    document.body.appendChild(accountOverlay);

    var gate = document.createElement('div');
    gate.className = 'lm-book-gate';
    gate.setAttribute('aria-hidden', 'true');
    gate.innerHTML = `
      <div class="lm-book-gate-card" role="dialog" aria-modal="true" aria-labelledby="lmGateTitle">
        <div class="lm-book-gate-icon">♢</div>
        <h3 id="lmGateTitle">Створіть аккаунт</h3>
        <p>Щоб продовжити бронювання, спочатку потрібно зареєструватися. Після цього ваші бронювання та QR-код будуть збережені в аккаунті.</p>
        <div class="lm-book-gate-actions">
          <button class="lm-book-gate-primary" type="button" data-register>Зареєструватися →</button>
          <button class="lm-book-gate-secondary" type="button" data-gate-close>Пізніше</button>
        </div>
      </div>`;
    document.body.appendChild(gate);

    function closeOverlay(el) {
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function openOverlay(el) {
      el.classList.add('is-open');
      el.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function showNotice(text) {
      var n = document.querySelector('.lm-mobile-notice');
      if (!n) { n = document.createElement('div'); n.className = 'lm-mobile-notice'; document.body.appendChild(n); }
      n.textContent = text; n.classList.add('is-visible'); clearTimeout(n._timer); n._timer = setTimeout(function () { n.classList.remove('is-visible'); }, 2200);
    }

    function syncMainAvatar() {
      var box = app.querySelector('[data-main-avatar]');
      var letter = app.querySelector('[data-main-avatar-letter]');
      var img = app.querySelector('[data-main-avatar-img]');
      var account = getAccount();
      if (!box || !letter || !img) return;
      if (account && account.avatar) { img.src = account.avatar; img.hidden = false; letter.hidden = true; }
      else { img.removeAttribute('src'); img.hidden = true; letter.hidden = false; letter.textContent = account && account.name ? account.name.slice(0,1).toUpperCase() : 'L'; }
    }

    function renderAccount(tab) {
      var root = accountOverlay.querySelector('[data-account-root]');
      var account = getAccount();
      if (!account) {
        root.innerHTML = `
          <div class="lm-profile-intro">
            <div class="lm-avatar-picker lm-avatar-picker--empty" data-register-avatar>
              <span>+</span>
              <small>Фото</small>
              <input name="avatar" type="file" accept="image/*" data-avatar-input>
            </div>
            <div>
              <span class="lm-profile-kicker">ОСОБИСТИЙ ПРОСТІР</span>
              <h3>Створіть аккаунт</h3>
              <p>Ваші дані, бронювання та QR-код будуть збережені у профілі LUNE.</p>
            </div>
          </div>
          <form class="lm-account-form" data-register-form>
            <label>Ваше ім’я<input name="name" type="text" autocomplete="name" placeholder="Наприклад, Анна" required></label>
            <label>Телефон<input name="phone" type="tel" autocomplete="tel" placeholder="+380 ..." required></label>
            <label>Email<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required></label>
            <button class="lm-account-submit" type="submit">Створити аккаунт →</button>
          </form>`;

        root.querySelector('[data-register-form]').addEventListener('submit', function (e) {
          e.preventDefault();
          var fd = new FormData(e.currentTarget);
          var name = String(fd.get('name') || '').trim();
          var phone = String(fd.get('phone') || '').trim();
          var email = String(fd.get('email') || '').trim();
          var file = fd.get('avatar');
          if (!name || !phone || !email) return;
          var accountData = { id: 'LUNE-' + Date.now().toString(36).toUpperCase(), name: name, phone: phone, email: email, createdAt: new Date().toISOString() };
          function finish(avatar) { if (avatar) accountData.avatar = avatar; setAccount(accountData); renderAccount('profile'); syncMainAvatar(); }
          if (file && file.size) { var reader = new FileReader(); reader.onload = function () { finish(reader.result); }; reader.readAsDataURL(file); } else finish('');
          renderAccount('profile');
          syncMainAvatar();
        });
        return;
      }

      var initial = tab || 'profile';
      root.innerHTML = `
        <div class="lm-profile-hero">
          <label class="lm-avatar-picker" title="Змінити аватарку">
            ${account.avatar ? `<img src="${escapeHtml(account.avatar)}" alt="">` : `<span>${escapeHtml(account.name.slice(0, 1).toUpperCase())}</span>`}
            <i aria-hidden="true">+</i>
            <input name="avatar" type="file" accept="image/*" data-avatar-input>
          </label>
          <div class="lm-profile-main">
            <span class="lm-profile-kicker">ОСОБИСТИЙ ПРОСТІР</span>
            <strong>${escapeHtml(account.name)}</strong>
            <small>${escapeHtml(account.email)}</small>
          </div>
        </div>
        <div class="lm-account-tabs">
          <button class="lm-account-tab ${initial === 'profile' ? 'is-active' : ''}" data-tab="profile" type="button">Профіль</button>
          <button class="lm-account-tab ${initial === 'bookings' ? 'is-active' : ''}" data-tab="bookings" type="button">Мої бронювання</button>
          <button class="lm-account-tab ${initial === 'qr' ? 'is-active' : ''}" data-tab="qr" type="button">Мій QR</button>
        </div>
        <section class="lm-account-pane ${initial === 'profile' ? 'is-active' : ''}" data-pane="profile">
          <div class="lm-data-heading"><span>ПЕРСОНАЛЬНІ ДАНІ</span><p>Усі дані профілю зібрані в одному місці.</p></div>
          <form class="lm-account-form" data-profile-form>
            <label>Ім'я<input name="name" type="text" value="${escapeHtml(account.name)}" required></label>
            <label>Телефон<input name="phone" type="tel" value="${escapeHtml(account.phone)}" required></label>
            <label>Email<input name="email" type="email" value="${escapeHtml(account.email)}" required></label>
            <input name="avatar" type="file" accept="image/*" data-avatar-form-input hidden>
            <button class="lm-account-submit" type="submit">Зберегти зміни →</button>
          </form>
          <button class="lm-account-link" data-account-book type="button">Створити нове бронювання</button>
          <button class="lm-account-link" data-account-logout type="button">Вийти з аккаунта</button>
        </section>
        <section class="lm-account-pane ${initial === 'bookings' ? 'is-active' : ''}" data-pane="bookings">
          <h3>Мої бронювання</h3>
          <div data-bookings-list></div>
        </section>
        <section class="lm-account-pane ${initial === 'qr' ? 'is-active' : ''}" data-pane="qr">
          <h3>Персональний QR</h3>
          <p>Покажи цей код у студії — він прив’язаний до твого аккаунта.</p>
          <div class="lm-qr-wrap"><div class="lm-qr" id="luneQr"></div></div>
          <div class="lm-qr-caption">${escapeHtml(account.id)}</div>
        </section>`;

      root.querySelectorAll('[data-tab]').forEach(function (btn) {
        btn.addEventListener('click', function () { renderAccount(btn.dataset.tab); });
      });

      var list = root.querySelector('[data-bookings-list]');
      if (list) renderBookings(list);

      var book = root.querySelector('[data-account-book]');
      if (book) book.addEventListener('click', function () {
        closeOverlay(accountOverlay);
        openBooking();
      });

      function bindAvatarPicker() {
        var picker = root.querySelector('[data-avatar-input]');
        if (!picker || picker.dataset.bound === '1') return;
        picker.dataset.bound = '1';
        picker.addEventListener('change', function () {
          var file = picker.files && picker.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function () {
            var hero = root.querySelector('.lm-avatar-picker');
            if (!hero) return;
            hero.innerHTML = '<img src="' + escapeHtml(reader.result) + '" alt=""><i aria-hidden="true">+</i><input name="avatar" type="file" accept="image/*" data-avatar-input>';
            bindAvatarPicker();
          };
          reader.readAsDataURL(file);
        });
      }
      bindAvatarPicker();

      var profileForm = root.querySelector('[data-profile-form]');
      if (profileForm) profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(profileForm), file = fd.get('avatar');
        var picker = root.querySelector('[data-avatar-input]');
        if ((!file || !file.size) && picker && picker.files && picker.files[0]) file = picker.files[0];
        function save(avatar) { var next = { id: account.id, name: String(fd.get('name')||account.name).trim(), phone: String(fd.get('phone')||account.phone).trim(), email: String(fd.get('email')||account.email).trim(), createdAt: account.createdAt }; if (avatar) next.avatar = avatar; else if (account.avatar) next.avatar = account.avatar; setAccount(next); renderAccount('profile'); syncMainAvatar(); showNotice('Зміни збережено'); }
        if (file && file.size) { var reader = new FileReader(); reader.onload = function () { save(reader.result); }; reader.readAsDataURL(file); } else save('');
      });

      var logout = root.querySelector('[data-account-logout]');
      if (logout) logout.addEventListener('click', function () {
        try { localStorage.removeItem(ACCOUNT_KEY); } catch (e) {}
        renderAccount('profile');
      });

      if (initial === 'qr') renderQr();
      var mainProfile = app.querySelector('[data-register]');
      if (mainProfile) {
        var freshProfile = mainProfile.cloneNode(true);
        mainProfile.replaceWith(freshProfile);
        freshProfile.addEventListener('click', function () { openAccount('profile'); });
      }
      syncMainAvatar();
    }

    function renderBookings(list) {
      var bookings = getBookings();
      if (!bookings.length) {
        list.innerHTML = '<div class="lm-booking-empty">Поки що бронювань немає.</div>';
        return;
      }
      list.innerHTML = bookings.slice().reverse().map(function (b) {
        return `<article class="lm-booking-item"><strong>${escapeHtml(b.service)}</strong><span>${escapeHtml(b.master)} · ${escapeHtml(b.date)} · ${escapeHtml(b.time)}</span><button type="button" class="lm-booking-cancel" data-cancel-booking="${escapeHtml(b.id || '')}">Скасувати бронювання</button></article>`;
      }).join('');
      list.querySelectorAll('[data-cancel-booking]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-cancel-booking');
          var next = getBookings().filter(function (b) { return String(b.id) !== String(id); });
          setBookings(next);
          renderBookings(list);
          showNotice('Бронювання скасоване');
        });
      });
    }

    function renderQr() {
      var holder = document.getElementById('luneQr');
      var account = getAccount();
      if (!holder || !account) return;
      holder.innerHTML = '';
      var payload = JSON.stringify({ studio: 'LUNE Nail Studio', account: account.id, name: account.name });
      if (window.QRCode) {
        new window.QRCode(holder, { text: payload, width: 170, height: 170, colorDark: '#241b19', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M });
        return;
      }
      loadQrLibrary(function () {
        if (!holder.isConnected) return;
        holder.innerHTML = '';
        if (window.QRCode) {
          new window.QRCode(holder, { text: payload, width: 170, height: 170, colorDark: '#241b19', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M });
        } else {
          holder.innerHTML = '<span class="lm-qr-fallback">' + escapeHtml(payload) + '</span>';
        }
      });
    }

    var qrLoading = false;
    function loadQrLibrary(done) {
      if (window.QRCode) return done();
      if (qrLoading) return setTimeout(function () { loadQrLibrary(done); }, 120);
      qrLoading = true;
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
      s.onload = function () { qrLoading = false; done(); };
      s.onerror = function () { qrLoading = false; done(); };
      document.head.appendChild(s);
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>'"]/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c];
      });
    }

    function openAccount(tab) {
      renderAccount(tab || 'profile');
      openOverlay(accountOverlay);
    }

    function openGate() { openOverlay(gate); }
    function closeGate() { closeOverlay(gate); }

    function openBooking() {
      if (!getAccount()) { openGate(); return; }
      var btn = app.querySelector('.js-open-book');
      if (btn) btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    /* Existing listeners are already attached by mobile.js. Replace booking/menu triggers so the account gate is authoritative. */
    app.querySelectorAll('.js-open-book').forEach(function (old) {
      var fresh = old.cloneNode(true);
      old.replaceWith(fresh);
      fresh.addEventListener('click', function (e) {
        e.preventDefault();
        if (!getAccount()) openGate();
        else {
          var master = app.querySelector('.lm-screen[data-screen="master"]');
          app.querySelectorAll('.lm-screen').forEach(function (s) { s.classList.toggle('is-active', s === master); });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    if (menu) {
      var bookingLink = menu.querySelector('a[href="#booking"]');
      if (bookingLink) {
        var freshBooking = bookingLink.cloneNode(true);
        bookingLink.replaceWith(freshBooking);
        freshBooking.addEventListener('click', function (e) {
          e.preventDefault();
          menu.classList.remove('is-open');
          if (!getAccount()) openGate(); else openBooking();
        });
      }

      var accountLink = document.createElement('a');
      accountLink.href = '#account';
      accountLink.textContent = 'Мій аккаунт';
      accountLink.dataset.accountAction = 'profile';
      menu.appendChild(accountLink);

      var bookingsLink = document.createElement('a');
      bookingsLink.href = '#bookings';
      bookingsLink.textContent = 'Мої бронювання';
      bookingsLink.dataset.accountAction = 'bookings';
      menu.appendChild(bookingsLink);

      var qrLink = document.createElement('a');
      qrLink.href = '#qr';
      qrLink.textContent = 'Мій QR-код';
      qrLink.dataset.accountAction = 'qr';
      menu.appendChild(qrLink);

      menu.querySelectorAll('[data-account-action]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          menu.classList.remove('is-open');
          openAccount(link.dataset.accountAction);
        });
      });
    }

    app.querySelector('.lm-account-close')?.addEventListener('click', function () { closeOverlay(accountOverlay); });
    accountOverlay.addEventListener('click', function (e) { if (e.target === accountOverlay) closeOverlay(accountOverlay); });
    gate.querySelector('[data-gate-close]').addEventListener('click', closeGate);
    gate.querySelector('[data-register]').addEventListener('click', function () { closeGate(); openAccount('profile'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeOverlay(accountOverlay); closeGate(); }
    });

    /* Add account shortcuts to the existing footer. */
    var footer = app.querySelector('.lm-footer');
    if (footer && !footer.querySelector('.lm-footer-links')) {
      var links = document.createElement('div');
      links.className = 'lm-footer-links';
      links.innerHTML = `
        <button class="lm-footer-link" data-footer-account type="button">Мій аккаунт</button>
        <button class="lm-footer-link" data-footer-bookings type="button">Мої бронювання</button>
        <button class="lm-footer-link" data-footer-qr type="button">Мій QR-код</button>`;
      footer.appendChild(links);
      links.querySelector('[data-footer-account]').addEventListener('click', function () { openAccount('profile'); });
      links.querySelector('[data-footer-bookings]').addEventListener('click', function () { openAccount('bookings'); });
      links.querySelector('[data-footer-qr]').addEventListener('click', function () { openAccount('qr'); });
    }

    /* Save a local demo booking when the final confirmation is pressed. Supabase will replace this later. */
    var confirmButton = app.querySelector('[data-confirm]');
    if (confirmButton) {
      confirmButton.addEventListener('click', function () {
        var account = getAccount();
        if (!account) return;
        var service = app.querySelector('.lm-service.is-selected strong');
        var master = app.querySelector('.lm-master.is-selected strong');
        var date = app.querySelector('.lm-date-label');
        var time = app.querySelector('.lm-time.is-selected');
        var booking = {
          id: 'BOOK-' + Date.now().toString(36).toUpperCase(),
          service: service ? service.textContent.replace(/\s+/g, ' ').trim() : 'Послуга',
          master: master ? master.textContent.trim() : 'Майстер',
          date: date ? date.textContent.replace(/^▣\s*/, '').trim() : 'Дата',
          time: time ? time.textContent.trim() : 'Час',
          createdAt: new Date().toISOString()
        };
        var bookings = getBookings();
        bookings.push(booking);
        setBookings(bookings);
      }, { passive: true });
    }

    /* The final confirmation already returns home; keep the account state and make the flow visibly complete. */
    var confirmOk = app.querySelector('.lm-confirm-ok');
    if (confirmOk) {
      confirmOk.addEventListener('click', function () {
        setTimeout(function () {
          if (getAccount()) renderAccount('bookings');
        }, 120);
      }, { passive: true });
    }
  }

  waitForApp();
})();
