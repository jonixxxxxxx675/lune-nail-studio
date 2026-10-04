(function(){
  'use strict';
  if(!matchMedia('(max-width:767px)').matches)return;
  if(document.querySelector('.lune-mobile-app'))return;

  var app=document.createElement('div');
  app.className='lune-mobile-app';
  app.innerHTML=`
    <section class="lm-screen is-active" data-screen="home">
      <div class="lm-top">
        <a class="lm-logo" href="#"><b>LUNE</b><small>NAIL STUDIO</small></a>
        <button class="lm-menu lm-3d" aria-label="Меню"><span></span></button>
      </div>
      <div class="lm-hero">
        <img src="assets/images/hero-mobile.webp" alt="LUNE Nail Studio">
        <div class="lm-hero-content">
          <div class="lm-kicker">СТУДІЯ МАНІКЮРУ</div>
          <h1 class="lm-title">КРАСА<br>У ДЕТАЛЯХ</h1>
          <p class="lm-lead">Ідеальний манікюр,<br>який підкреслює тебе</p>
        </div>
      </div>
      <div class="lm-features">
        <div class="lm-feature"><span class="lm-feature-icon">◇</span><b>Якісні</b><span>матеріали</span></div>
        <div class="lm-feature"><span class="lm-feature-icon">♧</span><b>Досвідчені</b><span>майстри</span></div>
        <div class="lm-feature"><span class="lm-feature-icon">❀</span><b>Затишна</b><span>атмосфера</span></div>
      </div>
      <div class="lm-card">
        <div class="lm-card-head"><div class="lm-card-icon">⌑</div><div><h2>Запис онлайн</h2><p>Обери послугу, майстра, дату та час</p></div></div>
        <div class="lm-steps" data-step="1">
          <div class="lm-step is-active"><span class="lm-step-dot">1</span><i class="lm-step-line"></i></div>
          <div class="lm-step"><span class="lm-step-dot">2</span><i class="lm-step-line"></i></div>
          <div class="lm-step"><span class="lm-step-dot">3</span><i class="lm-step-line"></i></div>
          <div class="lm-step"><span class="lm-step-dot">4</span></div>
        </div>
        <h3>Оберіть послугу</h3>
        <div class="lm-service-list">
          ${[
            ['Класичний','манікюр','60 хв','500 грн','assets/classic-manicure.png'],
            ['Покриття','гель-лаком','90 хв','800 грн','assets/gel-polish.png'],
            ['Дизайн нігтів','','90 хв','900 грн','assets/nail-design.png'],
            ['Френч','','90 хв','900 грн','assets/french.png'],
            ['Зміцнення нігтів','','60 хв','600 грн','assets/nail-strengthening.png']
          ].map((x,i)=>`<button class="lm-service lm-3d-card ${i===0?'is-selected':''}" data-service="${i}" type="button"><img src="${x[4]}" alt=""><span class="lm-service-main"><strong>${x[0]}${x[1]?'<br>'+x[1]:''}</strong><small>${x[2]} • ${x[3]}</small></span><span class="lm-radio"></span></button>`).join('')}
        </div>
        <button class="lm-next lm-3d" data-book-start type="button">Далі <span>→</span></button>
      </div>
      <div class="lm-section-title"><small>ВІДГУКИ</small><h2>Наші клієнти</h2></div>
      <div class="lm-reviews">
        <article class="lm-review"><div class="lm-review-top"><img class="lm-avatar" src="assets/images/avatar-1.jpg" alt="Анастасія"><div><b>Анастасія</b><div class="lm-stars">★★★★★</div></div></div><p>“Дуже задоволена! Атмосфера неймовірна, майстер уважна і професійна.”</p></article>
        <article class="lm-review"><div class="lm-review-top"><img class="lm-avatar" src="assets/images/avatar-2.jpg" alt="Марія"><div><b>Марія</b><div class="lm-stars">★★★★★</div></div></div><p>“Найкращий манікюр у місті! Все стерильно, комфортно і красиво.”</p></article>
      </div>
      <div class="lm-section-title"><small>INSTAGRAM</small><h2>Наші роботи</h2></div>
      <div class="lm-gallery">${[1,2,3,4,5,6].map(i=>`<img src="assets/mobile-gallery-${i}.png" alt="Робота ${i}" loading="lazy" decoding="async">`).join('')}</div>
      <button class="lm-instagram lm-3d" type="button">◎ &nbsp; Дивитися більше в Instagram →</button>
      <footer class="lm-footer">
        <div class="lm-footer-grid">
          <div><div class="lm-logo lm-logo--footer"><b>LUNE</b><small>NAIL STUDIO</small></div><p>Краса у деталях. Простір для твого нового образу.</p></div>
          <div class="lm-contact"><a href="tel:+380981234567">⌕ &nbsp; +380 98 123 45 67</a><span>⌖ &nbsp; вул. Шевченка, 12, Львів</span><a href="#account" data-account-open>◎ &nbsp; Мій аккаунт</a></div>
        </div>
        <div class="lm-footer-bottom"><span>© 2026 LUNE Nail Studio</span><span>Всі права захищені</span></div>
      </footer>
    </section>

    <section class="lm-screen" data-screen="master">
      <div class="lm-top"><button class="lm-back lm-3d" data-back type="button">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-book-body">
        <div class="lm-steps"><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">2</span><i class="lm-step-line"></i></div><div class="lm-step"><span class="lm-step-dot">3</span><i class="lm-step-line"></i></div><div class="lm-step"><span class="lm-step-dot">4</span></div></div>
        <h2 class="lm-book-title">Оберіть майстра</h2>
        <div class="lm-master-list">${['Анастасія','Марія','Катерина','Ольга','Софія'].map((n,i)=>`<button class="lm-master lm-3d-card ${i===0?'is-selected':''}" type="button"><img src="assets/master-${i+1}.png" alt="${n}" loading="lazy"><span class="lm-master-main"><strong>${n}</strong><small>★ ${['5.0','4.9','4.8','4.8','4.7'][i]}<br>Вільна ${i<2?'сьогодні':'завтра'}</small></span><span class="lm-radio"></span></button>`).join('')}</div>
        <button class="lm-next lm-3d" data-next="date" type="button">Далі <span>→</span></button>
      </div>
    </section>

    <section class="lm-screen" data-screen="date">
      <div class="lm-top"><button class="lm-back lm-3d" data-back type="button">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-book-body">
        <div class="lm-steps"><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">3</span><i class="lm-step-line"></i></div><div class="lm-step"><span class="lm-step-dot">4</span></div></div>
        <h2 class="lm-book-title">Оберіть дату</h2>
        <div class="lm-calendar"><div class="lm-month"><button class="lm-3d" type="button" data-month="prev">‹</button><b data-month-label>Жовтень 2026</b><button class="lm-3d" type="button" data-month="next">›</button></div><div class="lm-cal-grid" data-calendar></div><div class="lm-available"><button class="lm-pill active lm-3d" type="button">Сьогодні</button><button class="lm-pill lm-3d" type="button">Завтра</button><button class="lm-pill lm-3d" type="button">Пн, 20</button><button class="lm-pill lm-3d" type="button">Вт, 21</button></div></div>
        <button class="lm-next lm-3d" data-next="time" type="button">Далі <span>→</span></button>
      </div>
    </section>

    <section class="lm-screen" data-screen="time">
      <div class="lm-top"><button class="lm-back lm-3d" data-back type="button">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-book-body">
        <div class="lm-steps"><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">4</span></div></div>
        <h2 class="lm-book-title">Оберіть час</h2><p class="lm-date-label">▣ &nbsp; Сб, 17 жовтня 2026</p>
        <div class="lm-times">${Array.from({length:21},(_,i)=>{var h=10+Math.floor(i/2),m=i%2?'30':'00',t=String(h).padStart(2,'0')+':'+m;return `<button class="lm-time lm-3d-card ${t===selectedTime?'is-selected':''}" data-time="${t}" type="button">${t}</button>`}).join('')}</div>
        <button class="lm-next lm-3d" data-confirm type="button">Підтвердити запис <span>→</span></button>
      </div>
    </section>

    <section class="lm-screen" data-screen="account">
      <div class="lm-top"><button class="lm-back lm-3d" data-back type="button">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-account-wrap">
        <div class="lm-account-card">
          <div class="lm-account-avatar" data-account-avatar aria-label="Фото профілю">L</div><small class="lm-eyebrow">ОСОБИСТИЙ ПРОСТІР</small><h2>Мій аккаунт</h2><p data-account-state>Зареєструйся, щоб зберігати бронювання та свій QR-код.</p>
          <button class="lm-next lm-3d" data-register type="button">Зареєструватися <span>→</span></button>
        </div>
        <div class="lm-account-links">
          <button class="lm-account-link lm-3d-card" data-my-bookings type="button"><b>Мої бронювання</b><span>Переглянути записи</span><i>→</i></button>
          <button class="lm-account-link lm-3d-card" data-my-qr type="button"><b>Мій QR-код</b><span>Код клієнта LUNE</span><i>→</i></button>
        </div>
      </div>
    </section>

    <section class="lm-screen" data-screen="profile">
      <div class="lm-top"><button class="lm-back lm-3d" data-back type="button" aria-label="Назад">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-profile-wrap">
        <div class="lm-profile-card">
          <small class="lm-eyebrow">ОСОБИСТІ ДАНІ</small>
          <h2>Мій профіль</h2>
          <button class="lm-profile-photo lm-3d-card" data-profile-photo type="button">
            <span class="lm-profile-photo-image" data-profile-photo-image>L</span>
            <span><b>Змінити фото</b><small>Вибрати фото з телефону</small></span>
            <i>→</i>
          </button>
          <input class="lm-visually-hidden" data-profile-photo-input type="file" accept="image/*">
          <div class="lm-profile-fields">
            <label>Ім'я<input data-profile-name type="text" autocomplete="name"></label>
            <label>Телефон<input data-profile-phone type="tel" autocomplete="tel"></label>
            <label>Email<input data-profile-email type="email" autocomplete="email"></label>
          </div>
          <div class="lm-email-status" data-email-status></div>
          <button class="lm-next lm-3d" data-email-confirm type="button">Підтвердити e-mail <span>→</span></button>
          <button class="lm-next lm-3d lm-next--light" data-profile-save type="button">Зберегти дані</button>
        </div>
      </div>
    </section>

    <section class="lm-screen" data-screen="support">
      <div class="lm-top"><button class="lm-back lm-3d" data-back type="button" aria-label="Назад">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-info-wrap">
        <small class="lm-eyebrow">МИ ПОРУЧ</small><h2>Служба підтримки</h2><p>Потрібна допомога з бронюванням, профілем або оплатою? Напиши нам.</p>
        <a class="lm-info-card lm-3d-card" href="mailto:support@lune-studio.ua"><b>Email</b><span>support@lune-studio.ua</span><i>→</i></a>
        <a class="lm-info-card lm-3d-card" href="tel:+380981234567"><b>Телефон</b><span>+380 98 123 45 67</span><i>→</i></a>
        <div class="lm-support-hours"><b>Графік підтримки</b><span>Щодня · 09:00–20:00</span></div>
      </div>
    </section>

    <section class="lm-screen" data-screen="branches">
      <div class="lm-top"><button class="lm-back lm-3d" data-back type="button" aria-label="Назад">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-info-wrap">
        <small class="lm-eyebrow">LUNE У ЛЬВОВІ</small><h2>Наші відділення</h2><p>Обери зручну студію та відкрий її на карті.</p>
        <div class="lm-map-card"><iframe title="Карта відділень LUNE у Львові" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=23.98%2C49.82%2C24.08%2C49.87&layer=mapnik&marker=49.8419%2C24.0316"></iframe></div>
        <a class="lm-info-card lm-3d-card" href="https://www.google.com/maps/search/?api=1&query=вул.+Князя+Романа,+12,+Львів" target="_blank" rel="noopener"><b>Львів · Князя Романа, 12</b><span>Центр</span><i>↗</i></a>
        <a class="lm-info-card lm-3d-card" href="https://www.google.com/maps/search/?api=1&query=вул.+Лесі+Українки,+18,+Львів" target="_blank" rel="noopener"><b>Львів · Лесі Українки, 18</b><span>Історичний центр</span><i>↗</i></a>
        <a class="lm-info-card lm-3d-card" href="https://www.google.com/maps/search/?api=1&query=вул.+Стрийська,+45,+Львів" target="_blank" rel="noopener"><b>Львів · Стрийська, 45</b><span>Стрийський район</span><i>↗</i></a>
      </div>
    </section>

    <div class="lm-menu-panel" aria-hidden="true">
      <button class="lm-menu-back lm-3d" type="button" aria-label="Назад">‹</button>
      <small>МЕНЮ</small>
      <a href="#account">Мій аккаунт</a><a href="#support">Служба підтримки</a><a href="#branches">Наші відділення</a>
      <button class="lm-language lm-3d-card" type="button" data-language-open><span>Мова</span><b data-language-label>Українська</b><i>→</i></button>
    </div>
    <div class="lm-modal" data-modal="register" aria-hidden="true"><div class="lm-modal-box"><button class="lm-modal-close lm-3d" data-modal-close type="button">×</button><small>ПЕРШИЙ КРОК</small><h3>Створи свій аккаунт</h3><p>Реєстрація потрібна перед першим бронюванням.</p><form data-register-form><label>Ім'я<input name="name" required autocomplete="name" placeholder="Твоє ім'я"></label><label>Телефон<input name="phone" required autocomplete="tel" inputmode="tel" placeholder="+380 ..."></label><label>Email<input name="email" type="email" required autocomplete="email" placeholder="you@email.com"></label><button class="lm-next lm-3d" type="submit">Створити аккаунт <span>→</span></button></form></div></div>
    <div class="lm-modal" data-modal="auth-gate" aria-hidden="true"><div class="lm-modal-box lm-modal-center"><div class="lm-modal-icon">L</div><small>ЗАПИС ОНЛАЙН</small><h3>Спочатку зареєструйся</h3><p>Твій аккаунт потрібен, щоб зберегти бронювання та QR-код клієнта.</p><button class="lm-next lm-3d" data-gate-register type="button">Мій аккаунт <span>→</span></button></div></div>
    <div class="lm-modal" data-modal="confirm" aria-hidden="true"><div class="lm-modal-box lm-modal-center"><div class="lm-success">✓</div><small>ГОТОВО</small><h3>Бронювання підтверджено</h3><p>Запис збережено у твоєму аккаунті.</p><button class="lm-next lm-3d" data-confirm-ok type="button">Окей <span>→</span></button></div></div>
    <div class="lm-modal" data-modal="qr" aria-hidden="true"><div class="lm-modal-box lm-modal-center"><button class="lm-modal-close lm-3d" data-modal-close type="button">×</button><small>ТВІЙ QR-КОД</small><h3>Код клієнта LUNE</h3><div class="lm-qr" data-qr></div><p data-qr-label>LUNE CLIENT</p><button class="lm-next lm-3d" data-modal-close type="button">Закрити</button></div></div>
    <div class="lm-modal" data-modal="bookings" aria-hidden="true"><div class="lm-modal-box"><button class="lm-modal-close lm-3d" data-modal-close type="button">×</button><small>ІСТОРІЯ</small><h3>Мої бронювання</h3><div data-bookings-list class="lm-bookings-list"></div></div></div>
    <div class="lm-modal" data-modal="language" aria-hidden="true"><div class="lm-modal-box lm-modal-center"><button class="lm-modal-close lm-3d" data-modal-close type="button">×</button><small>НАЛАШТУВАННЯ</small><h3>Вибір мови</h3><div class="lm-language-list"><button class="lm-language-option lm-3d-card" data-language="uk" type="button"><span>Українська</span><b>UA</b></button><button class="lm-language-option lm-3d-card" data-language="en" type="button"><span>English</span><b>EN</b></button></div></div></div>
    <div class="lm-toast" aria-live="polite"></div>`;

  document.body.appendChild(app);
  document.body.classList.add('lune-mobile-active');

  var screens=[...app.querySelectorAll('.lm-screen')],toast=app.querySelector('.lm-toast');
  var current='home',history=['home'],serviceSelected=0,selectedDate=17,selectedTime='11:30';
  var language=localStorage.getItem('lune-language')||'uk';
  var monthDate=new Date(2026,9,1);
  var account=JSON.parse(localStorage.getItem('lune-account')||'null');
  var bookings=JSON.parse(localStorage.getItem('lune-bookings')||'[]');

  function msg(t){toast.textContent=t;toast.classList.add('show');clearTimeout(msg.timer);msg.timer=setTimeout(()=>toast.classList.remove('show'),2200)}
  function show(n,addHistory){if(addHistory!==false&&current!==n)history.push(n);current=n;screens.forEach(s=>s.classList.toggle('is-active',s.dataset.screen===n));window.scrollTo({top:0,behavior:'auto'})}
  function back(){if(history.length>1){history.pop();show(history[history.length-1],false)}else show('home',false)}
  function openModal(name){var m=app.querySelector('[data-modal="'+name+'"]');if(m){m.classList.add('is-open');m.setAttribute('aria-hidden','false')}}
  function closeModals(){app.querySelectorAll('.lm-modal.is-open').forEach(m=>{m.classList.remove('is-open');m.setAttribute('aria-hidden','true')})}
  function requireAccount(){if(account)return true;openModal('auth-gate');return false}
  function updateAccount(){var state=app.querySelector('[data-account-state]'),btn=app.querySelector('[data-register]'),avatar=app.querySelector('[data-account-avatar]'),photo=account&&account.photo;if(account){state.textContent='Твій аккаунт активний. Тут зберігатимуться бронювання та QR-код.';btn.innerHTML='Відкрити профіль <span>→</span>';avatar.classList.toggle('has-photo',!!photo);avatar.style.backgroundImage=photo?`url(${photo})`:'';avatar.textContent=photo?'':'L';fillProfile();}else{state.textContent='Зареєструйся, щоб зберігати бронювання та свій QR-код.';btn.innerHTML='Зареєструватися <span>→</span>';avatar.classList.remove('has-photo');avatar.style.backgroundImage='';avatar.textContent='L'}}
  function fillProfile(){if(!account)return;app.querySelector('[data-profile-name]').value=account.name||'';app.querySelector('[data-profile-phone]').value=account.phone||'';app.querySelector('[data-profile-email]').value=account.email||'';var image=app.querySelector('[data-profile-photo-image]');image.classList.toggle('has-photo',!!account.photo);image.style.backgroundImage=account.photo?`url(${account.photo})`:'';image.textContent=account.photo?'':'L';var status=app.querySelector('[data-email-status]');status.className='lm-email-status '+(account.emailConfirmed?'is-confirmed':'');status.textContent=account.emailConfirmed?'✓ E-mail підтверджено':'E-mail не підтверджено';}
  function renderBookings(){var box=app.querySelector('[data-bookings-list]');if(!bookings.length){box.innerHTML='<div class="lm-empty">Поки що немає бронювань.</div>';return}box.innerHTML=bookings.map((b,i)=>`<div class="lm-booking"><div><b>${b.service}</b><span>${b.date} • ${b.time}</span><small>${b.master}</small></div><button class="lm-cancel-booking lm-3d" type="button" data-cancel-booking="${i}">Скасувати</button></div>`).join('');box.querySelectorAll('[data-cancel-booking]').forEach(btn=>btn.addEventListener('click',()=>{var i=Number(btn.dataset.cancelBooking);bookings.splice(i,1);localStorage.setItem('lune-bookings',JSON.stringify(bookings));renderBookings();renderCalendar();renderTimes();msg('Бронювання скасовано')}))}
  function qrSvg(value){var seed=0;for(var i=0;i<value.length;i++)seed=(seed*31+value.charCodeAt(i))>>>0;var cells=21,cell=7,size=cells*cell,rects='';for(var y=0;y<cells;y++)for(var x=0;x<cells;x++){var corner=(x<7&&y<7)||(x>=14&&y<7)||(x<7&&y>=14);var on;if(corner){var ox=x<7?0:14,oy=y<7?0:14,dx=x-ox,dy=y-oy;on=dx===0||dx===6||dy===0||dy===6||(dx>=2&&dx<=4&&dy>=2&&dy<=4)}else{seed=(seed*1664525+1013904223)>>>0;on=(seed&1)===1}if(on)rects+=`<rect x="${x*cell}" y="${y*cell}" width="${cell}" height="${cell}"/>`}return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="QR-код"><rect width="100%" height="100%" fill="#fff"/>${rects}</svg>`}

  function pad2(n){return String(n).padStart(2,'0')}
  function dateKey(y,m,d){return y+'-'+pad2(m+1)+'-'+pad2(d)}
  function bookingDateKey(b){
    if(b&&b.dateKey)return b.dateKey;
    var match=String(b&&b.date||'').match(/(\d{1,2})\s+([^\s]+)\s+(\d{4})/);
    if(!match)return '';
    var names=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
    var m=names.indexOf(match[2]);
    return m<0?'':dateKey(Number(match[3]),m,Number(match[1]));
  }
  function isDateBooked(d){return bookings.some(function(b){return bookingDateKey(b)===dateKey(monthDate.getFullYear(),monthDate.getMonth(),d)})}
  function isTimeBooked(t){
    var key=dateKey(monthDate.getFullYear(),monthDate.getMonth(),selectedDate);
    return bookings.some(function(b){return bookingDateKey(b)===key && String(b.time||'')===t})
  }
  function renderCalendar(){
    var grid=app.querySelector('[data-calendar]'),label=app.querySelector('[data-month-label]'),names=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
    label.textContent=names[monthDate.getMonth()]+' '+monthDate.getFullYear();
    var first=(monthDate.getDay()+6)%7,days=new Date(monthDate.getFullYear(),monthDate.getMonth()+1,0).getDate();
    var html=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(d=>`<span class="cal-week">${d}</span>`).join('');
    for(var i=0;i<first;i++)html+='<span class="cal-empty"></span>';
    for(var d=1;d<=days;d++){
      var booked=isDateBooked(d);
      var selected=d===selectedDate&&!booked;
      html+=`<button type="button" class="cal-day lm-3d ${selected?'selected ':''}${booked?'booked':''}" ${booked?'disabled aria-disabled="true"':''}>${d}</button>`;
    }
    grid.innerHTML=html;
    grid.querySelectorAll('.cal-day:not(.booked)').forEach(b=>b.addEventListener('click',()=>{
      grid.querySelectorAll('.cal-day').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      selectedDate=Number(b.textContent);
      renderTimes();
      msg('Дата обрана')
    }));
    renderTimes();
  }
  function renderTimes(){
    app.querySelectorAll('.lm-time').forEach(function(b){
      var t=b.dataset.time||b.textContent.trim();
      var booked=isTimeBooked(t);
      b.classList.toggle('booked',booked);
      b.disabled=booked;
      b.setAttribute('aria-disabled',booked?'true':'false');
      b.classList.toggle('is-selected',!booked&&t===selectedTime);
    });
  }

  renderCalendar();updateAccount();renderBookings();
  app.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',back));
  app.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.next)));
  app.querySelectorAll('.lm-service').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-service').forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected');serviceSelected=Number(b.dataset.service);msg('Послугу обрано')}));
  app.querySelectorAll('.lm-master').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-master').forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected');msg('Майстра обрано')}));
  app.querySelectorAll('.lm-time').forEach(b=>b.addEventListener('click',()=>{if(b.disabled)return;app.querySelectorAll('.lm-time').forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected');selectedTime=b.dataset.time||b.textContent.trim();msg('Час обрано')}));
  app.querySelectorAll('.lm-pill').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-pill').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
  app.querySelector('[data-month="prev"]').addEventListener('click',()=>{monthDate.setMonth(monthDate.getMonth()-1);selectedDate=1;renderCalendar()});
  app.querySelector('[data-month="next"]').addEventListener('click',()=>{monthDate.setMonth(monthDate.getMonth()+1);selectedDate=1;renderCalendar()});
  app.querySelector('[data-book-start]').addEventListener('click',()=>{if(requireAccount())show('master')});
  app.querySelector('[data-confirm]').addEventListener('click',()=>{
    if(!requireAccount())return;
    if(isTimeBooked(selectedTime)){msg('Цей час уже заброньований');renderTimes();return}
    var names=['Класичний манікюр','Покриття гель-лаком','Дизайн нігтів','Френч','Зміцнення нігтів'];
    var masters=app.querySelector('.lm-master.is-selected strong');
    var monthNames=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
    var dateLabel=selectedDate+' '+monthNames[monthDate.getMonth()]+' '+monthDate.getFullYear();
    bookings.unshift({service:names[serviceSelected]||names[0],master:masters?masters.textContent:'Анастасія',date:dateLabel,dateKey:dateKey(monthDate.getFullYear(),monthDate.getMonth(),selectedDate),time:selectedTime});
    localStorage.setItem('lune-bookings',JSON.stringify(bookings));
    renderBookings();renderCalendar();renderTimes();openModal('confirm')
  });
  app.querySelector('[data-confirm-ok]').addEventListener('click',()=>{closeModals();history=['home'];show('home',false)});
  app.querySelectorAll('[data-modal-close]').forEach(b=>b.addEventListener('click',closeModals));
  app.querySelector('[data-gate-register]').addEventListener('click',()=>{closeModals();openModal('register')});
  app.querySelector('[data-register]').addEventListener('click',()=>account?show('profile'):openModal('register'));
  app.querySelector('[data-register-form]').addEventListener('submit',function(e){e.preventDefault();var fd=new FormData(e.target);account={name:fd.get('name'),phone:fd.get('phone'),email:fd.get('email'),emailConfirmed:false,id:'LUNE-'+Math.random().toString(36).slice(2,8).toUpperCase()};localStorage.setItem('lune-account',JSON.stringify(account));updateAccount();app.querySelector('[data-qr]').innerHTML=qrSvg(account.id);app.querySelector('[data-qr-label]').textContent=account.id;closeModals();show('account');msg('Аккаунт створено')});
  app.querySelector('[data-my-qr]').addEventListener('click',()=>{if(!requireAccount())return;app.querySelector('[data-qr]').innerHTML=qrSvg(account.id);app.querySelector('[data-qr-label]').textContent=account.id;openModal('qr')});
  app.querySelector('[data-my-bookings]').addEventListener('click',()=>{if(!requireAccount())return;renderBookings();openModal('bookings')});
  app.querySelectorAll('[data-account-open]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();show('account')}));
  app.querySelector('[data-profile-photo]').addEventListener('click',()=>{if(requireAccount())app.querySelector('[data-profile-photo-input]').click()});
  app.querySelector('[data-profile-photo-input]').addEventListener('change',e=>{var file=e.target.files&&e.target.files[0];if(!file||!account)return;var reader=new FileReader();reader.onload=ev=>{var img=new Image();img.onload=()=>{var max=512,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);account.photo=canvas.toDataURL('image/jpeg',.82);localStorage.setItem('lune-account',JSON.stringify(account));updateAccount();msg('Фото профілю оновлено')};img.src=ev.target.result};reader.readAsDataURL(file);e.target.value=''});
  app.querySelector('[data-profile-save]').addEventListener('click',()=>{if(!requireAccount())return;account.name=app.querySelector('[data-profile-name]').value.trim();account.phone=app.querySelector('[data-profile-phone]').value.trim();account.email=app.querySelector('[data-profile-email]').value.trim();localStorage.setItem('lune-account',JSON.stringify(account));updateAccount();msg('Дані збережено')});
  app.querySelector('[data-email-confirm]').addEventListener('click',()=>{if(!requireAccount())return;account.emailConfirmed=true;localStorage.setItem('lune-account',JSON.stringify(account));fillProfile();msg('E-mail підтверджено')});

  var menu=app.querySelector('.lm-menu-panel');
  function closeMenu(){menu.classList.remove('is-open');menu.setAttribute('aria-hidden','true')}
  app.querySelector('.lm-menu').addEventListener('click',()=>{menu.classList.add('is-open');menu.setAttribute('aria-hidden','false')});
  app.querySelector('.lm-menu-back').addEventListener('click',closeMenu);
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();closeMenu();var target=a.getAttribute('href');if(target==='#account')show('account');else if(target==='#support')show('support');else if(target==='#branches')show('branches')}));
  app.querySelector('[data-language-open]').addEventListener('click',()=>openModal('language'));
  app.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>{language=b.dataset.language;localStorage.setItem('lune-language',language);app.querySelector('[data-language-label]').textContent=language==='en'?'English':'Українська';closeModals();msg(language==='en'?'Language: English':'Мова: українська')}));
  app.querySelector('[data-language-label]').textContent=language==='en'?'English':'Українська';

  app.querySelectorAll('button,a').forEach(el=>el.addEventListener('pointerdown',()=>el.classList.add('is-pressing')));
  document.addEventListener('pointerup',()=>app.querySelectorAll('.is-pressing').forEach(el=>el.classList.remove('is-pressing')),{passive:true});
})();
