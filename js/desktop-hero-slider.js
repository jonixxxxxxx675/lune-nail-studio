(function () {
  'use strict';

  // Desktop only. Mobile hero is intentionally untouched.
  if (!window.matchMedia('(min-width: 769px)').matches) return;

  var image = document.querySelector('.hero__bg img');
  var steps = document.getElementById('heroSteps');
  if (!image || !steps) return;

  var slides = [
    'assets/images/lune-hero-1.png',
    'assets/images/lune-hero-2.png',
    'assets/images/lune-hero-3.png'
  ];

  var index = 0;
  var timer = null;
  var fadeMs = 420;
  var intervalMs = 6000;
  var swapToken = 0;

  // Preload all desktop slides so switching never waits for the network.
  slides.forEach(function (src) {
    var preload = new Image();
    preload.src = src;
  });

  function updateSteps() {
    Array.prototype.forEach.call(steps.querySelectorAll('li'), function (li, i) {
      li.classList.toggle('is-active', i === index);
      var button = li.querySelector('button[data-slide]');
      if (button) {
        button.setAttribute('aria-current', i === index ? 'true' : 'false');
      }
    });
  }

  function show(indexToShow) {
    index = (indexToShow + slides.length) % slides.length;
    var token = ++swapToken;
    var nextSrc = slides[index];

    updateSteps();

    image.style.opacity = '0';

    window.setTimeout(function () {
      if (token !== swapToken) return;
      image.src = nextSrc;
      image.onload = function () {
        if (token === swapToken) image.style.opacity = '1';
      };
      // Cached images may not fire onload after assigning src.
      if (image.complete) image.style.opacity = '1';
    }, fadeMs);
  }

  function restart() {
    window.clearTimeout(timer);
    timer = window.setTimeout(function tick() {
      show(index + 1);
      timer = window.setTimeout(tick, intervalMs);
    }, intervalMs);
  }

  Array.prototype.forEach.call(steps.querySelectorAll('button[data-slide]'), function (button) {
    button.addEventListener('click', function () {
      show(Number(button.getAttribute('data-slide')) || 0);
      restart();
    });
  });

  // Start immediately on the first desktop slide, then auto-advance.
  image.src = slides[0];
  image.onload = function () { image.style.opacity = '1'; };
  if (image.complete) image.style.opacity = '1';
  updateSteps();
  restart();
}());
