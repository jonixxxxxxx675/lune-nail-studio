/* LUNE DESKTOP v26 — desktop-only behavior. */
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
