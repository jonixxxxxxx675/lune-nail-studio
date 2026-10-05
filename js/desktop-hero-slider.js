(function () {
  'use strict';

  // Desktop only. Mobile hero remains untouched.
  if (!window.matchMedia || !window.matchMedia('(min-width: 900px)').matches) return;

  var hero = document.getElementById('hero');
  var steps = document.getElementById('heroSteps');
  if (!hero || !steps) return;

  var slides = [
    'assets/images/lune-hero-1.png',
    'assets/images/lune-hero-2.png',
    'assets/images/lune-hero-3.png'
  ];

  var index = 0;
  var timer = null;
  var intervalMs = 6000;

  // Build an isolated desktop-only layer stack. This avoids replacing the
  // mobile hero image and avoids depending on <img>.onload timing.
  var bg = hero.querySelector('.hero__bg');
  if (!bg) return;

  var stack = bg.querySelector('.hero__desktop-slides');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'hero__desktop-slides';
    stack.setAttribute('aria-hidden', 'true');

    slides.forEach(function (src, i) {
      var img = document.createElement('img');
      img.className = 'hero__desktop-slide' + (i === 0 ? ' is-active' : '');
      img.src = src;
      img.alt = '';
      img.decoding = 'async';
      img.loading = i === 0 ? 'eager' : 'lazy';
      stack.appendChild(img);
    });

    bg.insertBefore(stack, bg.firstChild);
  }

  hero.classList.add('desktop-slider-js');

  var layers = Array.prototype.slice.call(
    stack.querySelectorAll('.hero__desktop-slide')
  );
  if (layers.length !== slides.length) return;

  var buttons = Array.prototype.slice.call(
    steps.querySelectorAll('button[data-slide]')
  ).filter(function (button) {
    var value = Number(button.getAttribute('data-slide'));
    return Number.isInteger(value) && value >= 0 && value < slides.length;
  });

  function updateSteps() {
    Array.prototype.forEach.call(steps.querySelectorAll('li'), function (li) {
      var button = li.querySelector('button[data-slide]');
      if (!button) return;
      var active = Number(button.getAttribute('data-slide')) === index;
      li.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function show(nextIndex) {
    index = ((nextIndex % slides.length) + slides.length) % slides.length;

    layers.forEach(function (layer, i) {
      layer.classList.toggle('is-active', i === index);
    });

    updateSteps();
  }

  function restart() {
    window.clearInterval(timer);
    timer = window.setInterval(function () {
      show(index + 1);
    }, intervalMs);
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      show(Number(button.getAttribute('data-slide')));
      restart();
    });
  });

  show(0);
  restart();
}());
