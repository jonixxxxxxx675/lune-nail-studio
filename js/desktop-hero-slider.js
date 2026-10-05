(function () {
  'use strict';

  /* Desktop hero only. Do not touch the mobile hero. */
  function initDesktopHeroSlider() {
    if (!window.matchMedia || !window.matchMedia('(min-width: 900px)').matches) return;

    var hero = document.getElementById('hero');
    if (!hero) return;

    var bg = hero.querySelector('.hero__bg');
    var stack = bg && bg.querySelector('.hero__desktop-slides');
    var steps = document.getElementById('heroSteps');
    if (!bg || !stack) return;

    var layers = Array.prototype.slice.call(
      stack.querySelectorAll('.hero__desktop-slide')
    );
    if (layers.length !== 3) return;

    var index = 0;
    var timer = null;
    var duration = 6000;

    /* Make the JS state authoritative, including when the browser has
       prefers-reduced-motion enabled. The user explicitly requested auto-play. */
    hero.classList.add('desktop-slider-js');
    stack.style.display = 'block';

    layers.forEach(function (layer, i) {
      layer.style.setProperty('opacity', i === 0 ? '1' : '0', 'important');
      layer.style.transition = 'opacity 700ms ease';
      layer.style.pointerEvents = 'none';
      layer.setAttribute('aria-hidden', 'true');
    });

    function updateSteps() {
      if (!steps) return;
      Array.prototype.forEach.call(steps.querySelectorAll('li'), function (li) {
        var button = li.querySelector('button[data-slide]');
        if (!button) return;
        var active = Number(button.getAttribute('data-slide')) === index;
        li.classList.toggle('is-active', active);
        button.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    function show(nextIndex) {
      index = ((nextIndex % layers.length) + layers.length) % layers.length;
      layers.forEach(function (layer, i) {
        layer.style.setProperty('opacity', i === index ? '1' : '0', 'important');
      });
      updateSteps();
    }

    function schedule() {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        show(index + 1);
        schedule();
      }, duration);
    }

    if (steps) {
      Array.prototype.forEach.call(
        steps.querySelectorAll('button[data-slide]'),
        function (button) {
          button.addEventListener('click', function () {
            show(Number(button.getAttribute('data-slide')) || 0);
            schedule();
          });
        }
      );
    }

    /* Preload all desktop hero images so the first transition cannot stall. */
    layers.forEach(function (layer) {
      var src = layer.getAttribute('src');
      if (src) {
        var preload = new Image();
        preload.src = src;
      }
    });

    show(0);
    schedule();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDesktopHeroSlider, { once: true });
  } else {
    initDesktopHeroSlider();
  }
}());
