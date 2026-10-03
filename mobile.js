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
        <button class="lm-menu" aria-label="Меню"><span></span></button>
      </div>
      <div class="lm-hero">
        <img src="assets/images/hero-mobile.webp" alt="LUNE Nail Studio">
        <div class="lm-hero-content">
          <div class="lm-kicker">СТУДІЯ МАНІКЮРУ</div>
          <h1 class="lm-title">КРАСА<br>У ДЕТАЛЯХ</h1>
          <p class="lm-lead">Ідеальний манікюр,<br>який підкреслює тебе</p>
          <button class="lm-cta js-open-book">Запис онлайн <i>→</i></button>
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
            ['Класичний','манікюр','60 хв','500 грн','assets/intro/scene-3.webp'],
            ['Покриття','гель-лаком','90 хв','800 грн','assets/intro/scene-4.webp'],
            ['Дизайн нігтів','','90 хв','900 грн','assets/intro/scene-3.webp'],
            ['Френч','','90 хв','900 грн','assets/intro/scene-4.webp'],
            ['Зміцнення нігтів','','60 хв','600 грн','assets/intro/scene-3.webp']
          ].map((x,i)=>`<button class="lm-service ${i===0?'is-selected':''}" data-service="${i}" type="button"><img src="${x[4]}" alt=""><span class="lm-service-main"><strong>${x[0]}${x[1]?'<br>'+x[1]:''}</strong><small>${x[2]} • ${x[3]}</small></span><span class="lm-radio"></span></button>`).join('')}
        </div>
        <button class="lm-next js-open-book" type="button">Далі →</button>
      </div>
      <div class="lm-section-title"><small>ВІДГУКИ</small><h2>Наші клієнти</h2></div>
      <div class="lm-reviews">
        <article class="lm-review"><div class="lm-review-top"><img class="lm-avatar" src="assets/intro/scene-3.webp"><div><b>Анастасія</b><div class="lm-stars">★★★★★</div></div></div><p>“Дуже задоволена! Атмосфера неймовірна, майстер уважна і професійна.”</p></article>
        <article class="lm-review"><div class="lm-review-top"><img class="lm-avatar" src="assets/intro/scene-4.webp"><div><b>Марія</b><div class="lm-stars">★★★★★</div></div></div><p>“Найкращий манікюр у місті! Все стерильно, комфортно і красиво.”</p></article>
      </div>
      <div class="lm-section-title"><small>INSTAGRAM</small><h2>Наші роботи</h2></div>
      <div class="lm-gallery">${Array.from({length:9},(_,i)=>`<img src="assets/intro/scene-${i%2?4:3}.webp" alt="Робота ${i+1}">`).join('')}</div>
      <button class="lm-instagram" type="button">◎ &nbsp; Дивитися більше в Instagram →</button>
      <div class="lm-footer"><div class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></div><div class="lm-contact"><div>⌖ &nbsp; вул. Шевченка, 12<br>  Львів</div><div>⌕ &nbsp; +380 98 123 45 67</div><div>◎ &nbsp; @lune.nail.studio</div><div>© 2026 Lune Nail Studio.<br>Всі права захищені.</div></div></div>
    </section>

    <section class="lm-screen" data-screen="master">
      <div class="lm-top"><button class="lm-back" data-back type="button">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-book-body">
        <div class="lm-steps"><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">2</span><i class="lm-step-line"></i></div><div class="lm-step"><span class="lm-step-dot">3</span><i class="lm-step-line"></i></div><div class="lm-step"><span class="lm-step-dot">4</span></div></div>
        <h2 class="lm-book-title">Оберіть майстра</h2>
        <div class="lm-master-list">${['Анастасія','Марія','Катерина','Ольга','Софія'].map((n,i)=>`<button class="lm-master ${i===0?'is-selected':''}" type="button"><img src="assets/intro/scene-${i%2?4:3}.webp"><span class="lm-master-main"><strong>${n}</strong><small>★ ${['5.0','4.9','4.8','4.8','4.7'][i]}<br>Вільна ${i<2?'сьогодні':'завтра'}</small></span><span class="lm-radio"></span></button>`).join('')}</div>
        <button class="lm-next" data-next="date" type="button">Далі →</button>
      </div>
    </section>

    <section class="lm-screen" data-screen="date">
      <div class="lm-top"><button class="lm-back" data-back type="button">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-book-body">
        <div class="lm-steps"><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">3</span><i class="lm-step-line"></i></div><div class="lm-step"><span class="lm-step-dot">4</span></div></div>
        <h2 class="lm-book-title">Оберіть дату</h2>
        <div class="lm-calendar"><div class="lm-month"><button type="button" data-month="prev">‹</button><b data-month-label>Жовтень 2026</b><button type="button" data-month="next">›</button></div><div class="lm-cal-grid" data-calendar></div><div class="lm-available"><button class="lm-pill active" type="button">Сьогодні</button><button class="lm-pill" type="button">Завтра</button><button class="lm-pill" type="button">Пн, 20</button><button class="lm-pill" type="button">Вт, 21</button></div></div>
        <button class="lm-next" data-next="time" type="button">Далі →</button>
      </div>
    </section>

    <section class="lm-screen" data-screen="time">
      <div class="lm-top"><button class="lm-back" data-back type="button">‹</button><a class="lm-logo"><b>LUNE</b><small>NAIL STUDIO</small></a><span></span></div>
      <div class="lm-book-body">
        <div class="lm-steps"><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">✓</span><i class="lm-step-line"></i></div><div class="lm-step is-active"><span class="lm-step-dot">4</span></div></div>
        <h2 class="lm-book-title">Оберіть час</h2><p class="lm-date-label">▣ &nbsp; Сб, 17 жовтня 2026</p>
        <div class="lm-times">${['10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','16:00'].map((t,i)=>`<button class="lm-time ${i===3?'is-selected':''}" type="button">${t}</button>`).join('')}</div>
        <button class="lm-next" data-confirm type="button">Підтвердити запис →</button>
      </div>
    </section>

    <div class="lm-menu-panel" aria-hidden="true"><button class="lm-menu-close" type="button">×</button><a href="#home">Головна</a><a href="#booking">Запис онлайн</a><a href="#works">Наші роботи</a><a href="#contacts">Контакти</a></div>
    <div class="lm-toast"></div>`;

  document.body.appendChild(app);
  document.body.classList.add('lune-mobile-active');

  var screens=[...app.querySelectorAll('.lm-screen')], toast=app.querySelector('.lm-toast');
  var current='home', history=['home'];
  var serviceSelected=0, selectedDate=17;
  var monthDate=new Date(2026,9,1);

  function show(n,addHistory){
    if(addHistory!==false && current!==n) history.push(n);
    current=n;
    screens.forEach(s=>s.classList.toggle('is-active',s.dataset.screen===n));
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function back(){
    if(history.length>1){history.pop();show(history[history.length-1],false)}else show('home',false);
  }
  function msg(t){toast.textContent=t;toast.classList.add('show');clearTimeout(msg.timer);msg.timer=setTimeout(()=>toast.classList.remove('show'),2200)}

  function renderCalendar(){
    var grid=app.querySelector('[data-calendar]');
    var label=app.querySelector('[data-month-label]');
    var names=['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
    label.textContent=names[monthDate.getMonth()]+' '+monthDate.getFullYear();
    var first=(monthDate.getDay()+6)%7;
    var days=new Date(monthDate.getFullYear(),monthDate.getMonth()+1,0).getDate();
    var html=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(d=>`<span class="cal-week">${d}</span>`).join('');
    for(var i=0;i<first;i++)html+='<span class="cal-empty"></span>';
    for(var d=1;d<=days;d++)html+=`<button type="button" class="cal-day ${d===selectedDate?'selected':''}">${d}</button>`;
    grid.innerHTML=html;
    grid.querySelectorAll('.cal-day').forEach(b=>b.addEventListener('click',()=>{grid.querySelectorAll('.cal-day').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selectedDate=Number(b.textContent);msg('Дата обрана') }));
  }
  renderCalendar();

  app.querySelectorAll('.js-open-book').forEach(b=>b.addEventListener('click',()=>show('master')));
  app.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.next)));
  app.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',back));
  app.querySelectorAll('.lm-service').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-service').forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected');serviceSelected=Number(b.dataset.service);msg('Послугу обрано')}));
  app.querySelectorAll('.lm-master').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-master').forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected');msg('Майстра обрано')}));
  app.querySelectorAll('.lm-time').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-time').forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected');msg('Час обрано')}));
  app.querySelectorAll('.lm-pill').forEach(b=>b.addEventListener('click',()=>{app.querySelectorAll('.lm-pill').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
  app.querySelector('[data-month="prev"]').addEventListener('click',()=>{monthDate.setMonth(monthDate.getMonth()-1);renderCalendar()});
  app.querySelector('[data-month="next"]').addEventListener('click',()=>{monthDate.setMonth(monthDate.getMonth()+1);renderCalendar()});
  app.querySelector('[data-confirm]').addEventListener('click',()=>msg('Запис обрано. Дякуємо!'));

  var menu=app.querySelector('.lm-menu-panel');
  app.querySelector('.lm-menu').addEventListener('click',()=>{menu.classList.add('is-open');menu.setAttribute('aria-hidden','false')});
  app.querySelector('.lm-menu-close').addEventListener('click',()=>{menu.classList.remove('is-open');menu.setAttribute('aria-hidden','true')});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();menu.classList.remove('is-open');var target=a.getAttribute('href');if(target==='#booking')show('master');else if(target==='#home')show('home');else msg('Розділ відкривається нижче')}));
})();
