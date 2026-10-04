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
        <div class="lm-times">${['10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','16:00'].map((t,i)=>`<button class="lm-time lm-3d-card ${i===3?'is-selected':''}" type="button">${t}</button>`).join('')}</div>
        <button class="lm-next lm-3d" data-confirm type="button">Підтвердити запис <span>→</span></button>
      </div>
    </section>

    <section class="lm-screen" data-screen="account">
      <div class="lm-top"><button class="lm-back lm-3d" data-back type="button">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-account-wrap">
        <div class="lm-account-card">
          <div class="lm-account-avatar" data-main-avatar>
            <span data-main-avatar-letter>L</span>
            <img data-main-avatar-img alt="" hidden>
          </div><small class="lm-eyebrow">ОСОБИСТИЙ ПРОСТІР</small><h2>Мій аккаунт</h2><p data-account-state>Зареєструйся, щоб зберігати бронювання та свій QR-код.</p>
          <button class="lm-next lm-3d" data-register type="button">Зареєструватися <span>→</span></button>
        </div>
        <div class="lm-account-links">
          <button class="lm-account-link lm-3d-card" data-my-bookings type="button"><b>Мої бронювання</b><span>Переглянути записи</span><i>→</i></button>
          <button class="lm-account-link lm-3d-card" data-my-qr type="button"><b>Мій QR-код</b><span>Код клієнта LUNE</span><i>→</i></button>
        </div>
      </div>
    </section>

    <div class="lm-menu-panel" aria-hidden="true">
      <button class="lm-menu-close lm-3d" type="button">×</button>
      <small>МЕНЮ</small>
      <a href="#booking">Запис онлайн</a><a href="#account">Мій аккаунт</a><a href="#support">Служба підтримки</a><a href="#branches">Наші відділення</a>
      <div class="lm-menu-language" aria-label="Language">
        <span class="lm-language-globe" aria-hidden="true"><i></i><b></b></span>
        <div class="lm-menu-language__options">
          <button type="button" class="is-active" data-lang="uk" aria-label="Українська">UA</button>
          <span class="lm-language-arrow" aria-hidden="true">→</span>
          <button type="button" data-lang="en" aria-label="English">EN</button>
        </div>
      </div>
    </div>
    <div class="lm-modal" data-modal="register" aria-hidden="true"><div class="lm-modal-box"><button class="lm-modal-close lm-3d" data-modal-close type="button">×</button><small>ПЕРШИЙ КРОК</small><h3>Створи свій аккаунт</h3><p>Реєстрація потрібна перед першим бронюванням.</p><form data-register-form><label>Ім'я<input name="name" required autocomplete="name" placeholder="Твоє ім'я"></label><label>Телефон<input name="phone" required autocomplete="tel" inputmode="tel" placeholder="+380 ..."></label><label>Email<input name="email" type="email" required autocomplete="email" placeholder="you@email.com"></label><button class="lm-next lm-3d" type="submit">Створити аккаунт <span>→</span></button></form></div></div>
    <div class="lm-modal" data-modal="auth-gate" aria-hidden="true"><div class="lm-modal-box lm-modal-center"><div class="lm-modal-icon">L</div><small>ЗАПИС ОНЛАЙН</small><h3>Спочатку зареєструйся</h3><p>Твій аккаунт потрібен, щоб зберегти бронювання та QR-код клієнта.</p><button class="lm-next lm-3d" data-gate-register type="button">Мій аккаунт <span>→</span></button></div></div>
    <div class="lm-modal" data-modal="confirm" aria-hidden="true"><div class="lm-modal-box lm-modal-center"><div class="lm-success">✓</div><small>ГОТОВО</small><h3>Бронювання підтверджено</h3><p>Запис збережено у твоєму аккаунті.</p><button class="lm-next lm-3d" data-confirm-ok type="button">Окей <span>→</span></button></div></div>
    <div class="lm-modal" data-modal="qr" aria-hidden="true"><div class="lm-modal-box lm-modal-center"><button class="lm-modal-close lm-3d" data-modal-close type="button">×</button><small>ТВІЙ QR-КОД</small><h3>Код клієнта LUNE</h3><div class="lm-qr" data-qr></div><p data-qr-label>LUNE CLIENT</p><button class="lm-next lm-3d" data-modal-close type="button">Закрити</button></div></div>
    <div class="lm-modal" data-modal="bookings" aria-hidden="true"><div class="lm-modal-box"><button class="lm-modal-close lm-3d" data-modal-close type="button">×</button><small>ІСТОРІЯ</small><h3>Мої бронювання</h3><div data-bookings-list class="lm-bookings-list"></div></div></div>
    <div class="lm-modal" data-modal="profile" aria-hidden="true"><div class="lm-modal-box"><button class="lm-modal-close lm-3d" data-modal-close type="button">×</button><small>ОСОБИСТИЙ ПРОСТІР</small><h3>Ваш профіль</h3><form data-profile-form><label>Ім'я<input name="name" required autocomplete="name"></label><label>Телефон<input name="phone" required autocomplete="tel"></label><label>Email<input name="email" type="email" required autocomplete="email"></label><label class="lm-avatar-upload">Додати аватарку<input name="avatar" type="file" accept="image/*"></label><button class="lm-next lm-3d" type="submit">Зберегти зміни <span>→</span></button></form></div></div>
    <div class="lm-toast" aria-live="polite"></div>`;

  document.body.appendChild(app);
  document.body.classList.add('lune-mobile-active');

  app.querySelectorAll('.lm-hero img').forEach(function(img){
    var hero=img.closest('.lm-hero');
    var reveal=function(){if(hero) hero.classList.add('is-media-ready');};
    var hide=function(){if(hero) hero.classList.remove('is-media-ready');};
    img.addEventListener('load',reveal,{once:true});
    img.addEventListener('error',hide,{once:true});
    if(img.complete && img.naturalWidth) reveal();
  });

  var screens=[...app.querySelectorAll('.lm-screen')],toast=app.querySelector('.lm-toast');
  var current='home',history=['home'],serviceSelected=0,selectedDate=17,selectedTime='11:30';
  var monthDate=new Date(2026,9,1);
  var account=JSON.parse(localStorage.getItem('lune-account')||'null');
  var bookings=JSON.parse(localStorage.getItem('lune-bookings')||'[]');

  var currentLanguage=(function(){try{return localStorage.getItem('lune-language')||'uk'}catch(e){return 'uk'}})();
  var LUNE_I18N={"МЕНЮ": "MENU", "Запис онлайн": "Online booking", "Мій аккаунт": "My account", "Служба підтримки": "Support", "Наші відділення": "Our locations", "Мова": "Language", "Українська": "Ukrainian", "English": "English", "СТУДІЯ МАНІКЮРУ": "NAIL STUDIO", "КРАСА": "BEAUTY", "У ДЕТАЛЯХ": "IN THE DETAILS", "Ідеальний манікюр,": "Perfect manicure,", "який підкреслює тебе": "that highlights you", "Якісні": "Quality", "матеріали": "materials", "Досвідчені": "Experienced", "майстри": "masters", "Затишна": "Cozy", "атмосфера": "atmosphere", "Обери послугу, майстра, дату та час": "Choose a service, master, date and time", "Оберіть послугу": "Choose a service", "Далі": "Next", "ВІДГУКИ": "REVIEWS", "Наші клієнти": "Our clients", "Наші роботи": "Our work", "Дуже задоволена! Атмосфера неймовірна, майстер уважна і професійна.": "Very satisfied! The atmosphere is amazing, and the master is attentive and professional.", "Найкращий манікюр у місті! Все стерильно, комфортно і красиво.": "The best manicure in the city! Everything is sterile, comfortable and beautiful.", "Робота": "Work", "Дивитися більше в Instagram →": "See more on Instagram →", "Краса у деталях. Простір для твого нового образу.": "Beauty in the details. A space for your new look.", "вул. Шевченка, 12, Львів": "12 Shevchenka St, Lviv", "Всі права захищені": "All rights reserved", "Оберіть майстра": "Choose a master", "Вільна": "Available", "сьогодні": "today", "завтра": "tomorrow", "Оберіть дату": "Choose a date", "Сьогодні": "Today", "Завтра": "Tomorrow", "Оберіть час": "Choose a time", "Підтвердити запис": "Confirm booking", "Підтвердити запис ": "Confirm booking ", "ОСОБИСТИЙ ПРОСТІР": "PERSONAL SPACE", "Зареєструйся, щоб зберігати бронювання та свій QR-код.": "Register to save your bookings and your QR code.", "Зареєструватися": "Register", "Мої бронювання": "My bookings", "Переглянути записи": "View bookings", "Мій QR-код": "My QR code", "Код клієнта LUNE": "LUNE client code", "ПЕРШИЙ КРОК": "FIRST STEP", "Створи свій аккаунт": "Create your account", "Реєстрація потрібна перед першим бронюванням.": "Registration is required before your first booking.", "Твоє ім'я": "Your name", "Твій телефон": "Your phone", "Електронна пошта": "Email", "ЗАПИС ОНЛАЙН": "ONLINE BOOKING", "Спочатку зареєструйся": "Register first", "Твій аккаунт потрібен, щоб зберегти бронювання та QR-код клієнта.": "Your account is required to save your booking and client QR code.", "Продовжити": "Continue", "ГОТОВО": "DONE", "Бронювання підтверджено": "Booking confirmed", "Запис збережено у твоєму аккаунті.": "Your booking has been saved to your account.", "Окей": "Okay", "ТВІЙ QR-КОД": "YOUR QR CODE", "ІСТОРІЯ": "HISTORY", "Поки що немає бронювань.": "No bookings yet.", "Твій аккаунт активний. Тут зберігатимуться бронювання та QR-код.": "Your account is active. Your bookings and QR code will be stored here.", "Відкрити профіль →": "Open profile →", "Профіль уже активний": "Profile is already active", "Ваш профіль": "Your profile", "Ім'я": "Name", "Телефон": "Phone", "Email": "Email", "Зберегти зміни": "Save changes", "Додати аватарку": "Add avatar", "Скасувати бронювання": "Cancel booking", "Бронювання скасоване": "Booking cancelled", "Зміни збережено": "Changes saved", "Аккаунт створено": "Account created", "Послугу обрано": "Service selected", "Майстра обрано": "Master selected", "Час обрано": "Time selected", "Дата обрана": "Date selected", "Класичний манікюр": "Classic manicure", "Покриття гель-лаком": "Gel polish", "Дизайн нігтів": "Nail design", "Френч": "French", "Зміцнення нігтів": "Nail strengthening", "Класичний": "Classic", "манікюр": "manicure", "Покриття": "Gel polish", "гель-лаком": "gel polish", "ПЕРЕДЗАПИС": "PRE-BOOKING", "Січень": "January", "Лютий": "February", "Березень": "March", "Квітень": "April", "Травень": "May", "Червень": "June", "Липень": "July", "Серпень": "August", "Вересень": "September", "Жовтень": "October", "Листопад": "November", "Грудень": "December", "Пн": "Mon", "Вт": "Tue", "Ср": "Wed", "Чт": "Thu", "Пт": "Fri", "Сб": "Sat", "Нд": "Sun", "17 жовтня 2026": "October 17, 2026", "▣   Сб, 17 жовтня 2026": "▣   Sat, October 17, 2026", "Ім'я": "Name", "Телефон": "Phone", "Email": "Email", "Створити аккаунт": "Create account", "Закрити": "Close", "LUNE CLIENT": "LUNE CLIENT"};
  LUNE_I18N['Розділ доступний на головній сторінці']='This section is available on the home page';
  function translateText(text){
    var value=text.trim();
    if(!value)return text;
    if(currentLanguage==='uk') {
      for(var k in LUNE_I18N) if(LUNE_I18N[k]===value) return text.slice(0,text.indexOf(value))+k+text.slice(text.indexOf(value)+value.length);
      value=value.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g,function(m){var i=['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(m);return i>=0?['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'][i]:m;});
      value=value.replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/g,function(m){return {Mon:'Пн',Tue:'Вт',Wed:'Ср',Thu:'Чт',Fri:'Пт',Sat:'Сб',Sun:'Нд'}[m]||m;});
      return value;
    }
    if(Object.prototype.hasOwnProperty.call(LUNE_I18N,value)) return text.replace(value,LUNE_I18N[value]);
    value=value.replace(/\b(Січень|Лютий|Березень|Квітень|Травень|Червень|Липень|Серпень|Вересень|Жовтень|Листопад|Грудень)\b/g,function(m){return LUNE_I18N[m]||m;});
    value=value.replace(/\b(Пн|Вт|Ср|Чт|Пт|Сб|Нд)\b/g,function(m){return LUNE_I18N[m]||m;});
    return value;
  }
  function applyLanguage(){
    var walker=document.createTreeWalker(app,NodeFilter.SHOW_TEXT);
    var node;
    while(node=walker.nextNode()){
      var parent=node.parentElement;
      if(!parent || ['SCRIPT','STYLE'].indexOf(parent.tagName)>=0) continue;
      var original=node.nodeValue;
      var translated=translateText(original);
      if(translated!==original) node.nodeValue=translated;
    }
    app.querySelectorAll('[placeholder],[aria-label]').forEach(function(el){
      ['placeholder','aria-label'].forEach(function(attr){
        if(el.hasAttribute(attr)){
          var v=el.getAttribute(attr),t=translateText(v);
          if(t!==v) el.setAttribute(attr,t);
        }
      });
    });
    var langMenu=app.querySelector('.lm-menu-panel');
    if(langMenu) langMenu.querySelectorAll('[data-lang]').forEach(function(x){x.classList.toggle('is-active',x.dataset.lang===currentLanguage)});
    document.documentElement.lang=currentLanguage==='en'?'en':'uk';
  }
  function msg(t){t=translateText(t);toast.textContent=t;toast.classList.add('show');clearTimeout(msg.timer);msg.timer=setTimeout(()=>toast.classList.remove('show'),2200)}
  function show(n,addHistory){if(addHistory!==false&&current!==n)history.push(n);current=n;screens.forEach(s=>s.classList.toggle('is-active',s.dataset.screen===n));window.scrollTo({top:0,behavior:'smooth'})}
  function back(){if(history.length>1){history.pop();show(history[history.length-1],false)}else show('home',false)}
  function openModal(name){var m=app.querySelector('[data-modal="'+name+'"]');if(m){m.classList.add('is-open');m.setAttribute('aria-hidden','false')}}
  function closeModals(){app.querySelectorAll('.lm-modal.is-open').forEach(m=>{m.classList.remove('is-open');m.setAttribute('aria-hidden','true')})}
  function requireAccount(){if(account)return true;openModal('auth-gate');return false}
  function updateAccount(){var state=app.querySelector('[data-account-state]'),btn=app.querySelector('[data-register]');if(account){state.textContent='Твій аккаунт активний. Тут зберігатимуться бронювання та QR-код.';btn.textContent='Відкрити профіль →';}else{state.textContent='Зареєструйся, щоб зберігати бронювання та свій QR-код.';btn.innerHTML='Зареєструватися <span>→</span>'}}
  function syncMainAvatar(){var box=app.querySelector('[data-main-avatar]'),letter=app.querySelector('[data-main-avatar-letter]'),img=app.querySelector('[data-main-avatar-img]');if(!box||!letter||!img)return;if(account&&account.avatar){img.src=account.avatar;img.hidden=false;letter.hidden=true;}else{img.removeAttribute('src');img.hidden=true;letter.hidden=false;letter.textContent=account&&account.name?account.name.slice(0,1).toUpperCase():'L';}}
  function openProfile(){if(!account){openModal('register');return}closeModals();var f=app.querySelector('[data-profile-form]');if(f){f.elements.name.value=account.name||'';f.elements.phone.value=account.phone||'';f.elements.email.value=account.email||'';f.elements.avatar.value='';}openModal('profile');syncMainAvatar();}
  function renderBookings(){try{bookings=JSON.parse(localStorage.getItem('lune-bookings')||'[]')}catch(e){}var box=app.querySelector('[data-bookings-list]');if(!box)return;if(!bookings.length){box.innerHTML='<div class="lm-empty">Поки що немає бронювань.</div>';return}box.innerHTML=bookings.map(b=>`<div class="lm-booking" data-booking-id="${b.id||''}"><b>${b.service}</b><span>${b.date} • ${b.time}</span><small>${b.master}</small><button type="button" class="lm-booking-cancel" data-cancel-booking="${b.id||''}">Скасувати бронювання</button></div>`).join('');box.querySelectorAll('[data-cancel-booking]').forEach(function(btn){btn.addEventListener('click',function(){var id=btn.getAttribute('data-cancel-booking');bookings=bookings.filter(function(b){return String(b.id)!==String(id)});localStorage.setItem('lune-bookings',JSON.stringify(bookings));renderBookings();msg('Бронювання скасоване');});});}
  function qrSvg(value){var seed=0;for(var i=0;i<value.length;i++)seed=(seed*31+value.charCodeAt(i))>>>0;var cells=21,cell=7,size=cells*cell,rects='';for(var y=0;y<cells;y++)for(var x=0;x<cells;x++){var corner=(x<7&&y<7)||(x>=14&&y<7)||(x<7&&y>=14);var on;if(corner){var ox=x<7?0:14,oy=y<7?0:14,dx=x-ox,dy=y-oy;on=dx===0||dx===6||dy===0||dy===6||(dx>=2&&dx<=4&&dy>=2&&dy<=4)}else{seed=(seed*1664525+1013904223)>>>0;on=(seed&1)===1}if(on)rects+=`<rect x="${x*cell}" y="${y*cell}" width="${cell}" height="${cell}"/>`}return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="QR-код"><rect width="100%" height="100%" fill="#fff"/>${rects}</svg>`}

  function renderCalendar(){var grid=app.querySelector('[data-calendar]'),label=app.querySelector('[data-month-label]'),names=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];label.textContent=names[monthDate.getMonth()]+' '+monthDate.getFullYear();var first=(monthDate.getDay()+6)%7,days=new Date(monthDate.getFullYear(),monthDate.getMonth()+1,0).getDate(),html=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(d=>`<span class="cal-week">${d}</span>`).join('');for(var i=0;i<first;i++)html+='<span class="cal-empty"></span>';for(var d=1;d<=days;d++)html+=`<button type="button" class="cal-day lm-3d ${d===selectedDate?'selected':''}">${d}</button>`;grid.innerHTML=html;grid.querySelectorAll('.cal-day').forEach(b=>b.addEventListener('click',()=>{grid.querySelectorAll('.cal-day').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selectedDate=Number(b.textContent);msg('Дата обрана')}))}

  renderCalendar();updateAccount();renderBookings();applyLanguage();
  app.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',back));
  app.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.next)));
  app.querySelectorAll('.lm-service').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-service').forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected');serviceSelected=Number(b.dataset.service);msg('Послугу обрано')}));
  app.querySelectorAll('.lm-master').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-master').forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected');msg('Майстра обрано')}));
  app.querySelectorAll('.lm-time').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-time').forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected');selectedTime=b.textContent.trim();msg('Час обрано')}));
  app.querySelectorAll('.lm-pill').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-pill').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
  app.querySelector('[data-month="prev"]').addEventListener('click',()=>{monthDate.setMonth(monthDate.getMonth()-1);renderCalendar()});
  app.querySelector('[data-month="next"]').addEventListener('click',()=>{monthDate.setMonth(monthDate.getMonth()+1);renderCalendar()});
  app.querySelector('[data-book-start]').addEventListener('click',()=>{if(requireAccount())show('master')});
  app.querySelector('[data-confirm]').addEventListener('click',()=>{if(!requireAccount())return;var names=['Класичний манікюр','Покриття гель-лаком','Дизайн нігтів','Френч','Зміцнення нігтів'];var masters=app.querySelector('.lm-master.is-selected strong');bookings.unshift({service:names[serviceSelected]||names[0],master:masters?masters.textContent:'Анастасія',date:'17 жовтня 2026',time:selectedTime});localStorage.setItem('lune-bookings',JSON.stringify(bookings));renderBookings();openModal('confirm')});
  app.querySelector('[data-confirm-ok]').addEventListener('click',()=>{closeModals();history=['home'];show('home',false)});
  app.querySelectorAll('[data-modal-close]').forEach(b=>b.addEventListener('click',closeModals));
  app.querySelector('[data-gate-register]').addEventListener('click',()=>{closeModals();openModal('register')});
  app.querySelector('[data-register]').addEventListener('click',openProfile);
  app.querySelector('[data-register-form]').addEventListener('submit',function(e){e.preventDefault();var fd=new FormData(e.target);account={name:fd.get('name'),phone:fd.get('phone'),email:fd.get('email'),id:'LUNE-'+Math.random().toString(36).slice(2,8).toUpperCase()};localStorage.setItem('lune-account',JSON.stringify(account));try{localStorage.setItem('lune-account-v1',JSON.stringify(account))}catch(e){}updateAccount();syncMainAvatar();app.querySelector('[data-qr]').innerHTML=qrSvg(account.id);app.querySelector('[data-qr-label]').textContent=account.id;closeModals();show('account');msg('Аккаунт створено')});
  app.querySelector('[data-profile-form]').addEventListener('submit',function(e){e.preventDefault();if(!account)return;var form=e.currentTarget,fd=new FormData(form),file=fd.get('avatar');function save(avatar){account.name=String(fd.get('name')||account.name).trim();account.phone=String(fd.get('phone')||account.phone).trim();account.email=String(fd.get('email')||account.email).trim();if(avatar)account.avatar=avatar;localStorage.setItem('lune-account',JSON.stringify(account));try{localStorage.setItem('lune-account-v1',JSON.stringify(account))}catch(e){}updateAccount();syncMainAvatar();closeModals();msg('Зміни збережено')}if(file&&file.size){var reader=new FileReader();reader.onload=function(){save(reader.result)};reader.readAsDataURL(file)}else save(account.avatar||'')});
  app.querySelector('[data-profile-form]').addEventListener('reset',function(){});
  app.querySelector('[data-my-qr]').addEventListener('click',()=>{if(!requireAccount())return;app.querySelector('[data-qr]').innerHTML=qrSvg(account.id);app.querySelector('[data-qr-label]').textContent=account.id;openModal('qr')});
  app.querySelector('[data-my-bookings]').addEventListener('click',()=>{if(!requireAccount())return;renderBookings();openModal('bookings')});
  app.querySelectorAll('[data-account-open]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();show('account')}));

  var menu=app.querySelector('.lm-menu-panel');
  app.querySelector('.lm-menu').addEventListener('click',()=>{menu.classList.add('is-open');menu.setAttribute('aria-hidden','false')});
  app.querySelector('.lm-menu-close').addEventListener('click',()=>{menu.classList.remove('is-open');menu.setAttribute('aria-hidden','true')});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();menu.classList.remove('is-open');menu.setAttribute('aria-hidden','true');var target=a.getAttribute('href');if(target==='#booking'){if(requireAccount())show('master')}else if(target==='#account'){show('account')}else msg('Розділ доступний на головній сторінці')}));
  menu.querySelectorAll('[data-lang]').forEach(function(btn){btn.addEventListener('click',function(){
    currentLanguage=btn.dataset.lang;
    try{localStorage.setItem('lune-language',currentLanguage)}catch(e){}
    applyLanguage();
    msg(currentLanguage==='en'?'English':'Українська');
  })});

  app.querySelectorAll('button,a').forEach(el=>el.addEventListener('pointerdown',()=>el.classList.add('is-pressing')));
  document.addEventListener('pointerup',()=>app.querySelectorAll('.is-pressing').forEach(el=>el.classList.remove('is-pressing')),{passive:true});
})();
