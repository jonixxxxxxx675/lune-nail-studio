/* LUNE DESKTOP v31 — desktop-only behavior. */
(function () {
  'use strict';
  if (!window.matchMedia('(min-width: 768px)').matches) return;
  var root = document.getElementById('luneDesktop');
  if (!root) return;

  root.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var selector = link.getAttribute('href');
      var target = document.querySelector(selector);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 20,
        behavior: 'smooth'
      });
    });
  });
})();


/* Desktop service detail modal — desktop only. */
(function () {
  'use strict';
  if (!window.matchMedia('(min-width: 768px)').matches) return;
  var modal=document.getElementById('ldServiceModal');
  if(!modal) return;
  var image=document.getElementById('ldServiceModalImage');
  var title=document.getElementById('ldServiceModalTitle');
  var description=document.getElementById('ldServiceModalDescription');
  var meta=document.getElementById('ldServiceModalMeta');
  var data={
    classic:{title:'Класичний манікюр',image:'./assets/desktop/service-classic.jpg',description:'Акуратна класична процедура для догляду за нігтями та кутикулою. Майстер надає нігтям охайну форму, обробляє кутикулу та завершує процедуру делікатним доглядом.',meta:'Форма • кутикула • догляд'},
    design:{title:'Дизайн нігтів',image:'./assets/desktop/service-design.jpg',description:'Індивідуальний дизайн, підібраний під твій стиль. Від мінімалістичних деталей до виразних акцентів — кожен елемент створюється акуратно та з увагою до композиції.',meta:'Дизайн • деталі • індивідуальний стиль'},
    gel:{title:'Покриття гель-лаком',image:'./assets/desktop/service-gel.jpg',description:'Рівне стійке покриття з глянцевим фінішем. Процедура включає підготовку нігтьової пластини, нанесення покриття та акуратне завершення образу.',meta:'Підготовка • покриття • фініш'},
    strengthening:{title:'Зміцнення та догляд',image:'./assets/desktop/service-strengthening.jpg',description:'Делікатний догляд і зміцнення для натуральних нігтів. Процедура допомагає підтримувати охайний вигляд, гладкість і комфорт нігтьової пластини.',meta:'Зміцнення • догляд • натуральні нігті'}
  };
  function openService(key){
    var item=data[key]; if(!item)return;
    image.src=item.image; image.alt=item.title; title.textContent=item.title; description.textContent=item.description; meta.textContent=item.meta;
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  function closeService(){
    modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow='';
  }
  document.querySelectorAll('#luneDesktop .ld-service-card[data-service]').forEach(function(card){
    card.addEventListener('click',function(){openService(card.dataset.service);});
    card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openService(card.dataset.service);}});
  });
  modal.querySelectorAll('[data-service-close]').forEach(function(el){el.addEventListener('click',closeService);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('is-open'))closeService();});
})();
