(function () {
  'use strict';

  // Desktop only. Mobile hero is intentionally untouched.
  if (!window.matchMedia('(min-width: 769px)').matches) return;

  var image = document.querySelector('.hero__bg img');
  var steps = document.getElementById('heroSteps');
  if (!image || !steps) return;

  // Exactly three desktop hero slides.
  var slides = [
    'assets/images/lune-hero-1.png',
    'assets/images/lune-hero-2.png',
    'assets/images/lune-hero-3.png'
  ];

  var buttons = Array.prototype.slice.call(
    steps.querySelectorAll('button[data-slide]')
  ).filter(function (button) {
    var value = Number(button.getAttribute('data-slide'));
    return Number.isInteger(value) && value >= 0 && value < slides.length;
  });

  // Keep the desktop indicator strictly synchronized with the 3 slides.
  Array.prototype.forEach.call(steps.querySelectorAll('li'), function (li) {
    var button = li.querySelector('button[data-slide]');
    if (!button || buttons.indexOf(button) === -1) li.remove();
  });

  var index = 0;
  var timer = null;
  var fadeMs = 420;
  var intervalMs = 6000;
  var swapToken = 0;

  function preload(src) {
    var img = new Image();
    img.src = src;
  }

  slides.forEach(preload);

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
    if (!Number.isInteger(nextIndex)) return;

    index = ((nextIndex % slides.length) + slides.length) % slides.length;
    var token = ++swapToken;
    var nextSrc = slides[index];

    updateSteps();
    image.style.opacity = '0';

    window.setTimeout(function () {
      if (token !== swapToken) return;

      image.onload = function () {
        if (token === swapToken) image.style.opacity = '1';
      };
      image.onerror = function () {
        if (token === swapToken) image.style.opacity = '1';
        console.error('[LUNE desktop hero] Failed to load:', nextSrc);
      };
      image.src = nextSrc;

      if (image.complete && image.naturalWidth > 0) {
        image.style.opacity = '1';
      }
    }, fadeMs);
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

  // Initialize slide 1 and start the automatic 1 → 2 → 3 → 1 loop.
  show(0);
  restart();
}());
