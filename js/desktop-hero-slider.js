(function () {
  'use strict';

  /* Desktop hero only. Mobile is intentionally untouched. */
  function initDesktopHeroSlider() {
    if (!window.matchMedia || !window.matchMedia('(min-width: 900px)').matches) return;

    var hero = document.getElementById('hero');
    if (!hero) return;

    var bg = hero.querySelector('.hero__bg');
    var stack = bg && bg.querySelector('.hero__desktop-slides');
    var steps = document.getElementById('heroSteps');
    if (!stack) return;

    var layers = Array.prototype.slice.call(
      stack.querySelectorAll('.hero__desktop-slide')
    );
    if (layers.length !== 3) return;

    var index = 0;
    var timer = null;
    var duration = 6000;

    hero.classList.add('desktop-slider-js');
    stack.style.display = 'block';

    /* JS owns opacity. Use inline !important so no theme/media rule can
       pin slide 1 and prevent the desktop slider from moving. */
    layers.forEach(function (layer, i) {
      layer.style.setProperty('animation', 'none', 'important');
      layer.style.setProperty('opacity', i === 0 ? '1' : '0', 'important');
      layer.style.setProperty('visibility', i === 0 ? 'visible' : 'hidden', 'important');
      layer.style.setProperty('transition', 'opacity 700ms ease', 'important');
      layer.style.pointerEvents = 'none';
      layer.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
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
        var active = i === index;
        layer.style.setProperty('opacity', active ? '1' : '0', 'important');
        layer.style.setProperty('visibility', active ? 'visible' : 'hidden', 'important');
        layer.setAttribute('aria-hidden', active ? 'false' : 'true');
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

    /* Preload all three desktop hero images. */
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
