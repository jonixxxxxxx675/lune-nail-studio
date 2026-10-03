(function () {
  'use strict';

  var root = document.documentElement;
  var intro = document.getElementById('intro');
  var mq = window.matchMedia('(max-width: 767px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var done = false;
  var timers = [];

  if (!intro || !mq.matches || reduced) {
    if (intro) intro.remove();
    root.classList.remove('intro-on', 'intro-lock');
    return;
  }

  var style = document.createElement('style');
  style.textContent = `
    @media (max-width: 767px) {
      html.intro-lock,
      html.intro-lock body {
        overflow: hidden !important;
        height: 100% !important;
        overscroll-behavior: none;
      }

      #intro {
        position: fixed;
        inset: 0;
        z-index: 9999;
        width: 100%;
        height: 100%;
        height: 100svh;
        overflow: hidden;
        background: #f7eee8;
        opacity: 1;
        visibility: visible;
        isolation: isolate;
        pointer-events: auto;
      }

      #intro .intro__scenes,
      #intro .intro__scene,
      #intro .intro__scene img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }

      #intro .intro__scenes {
        overflow: hidden;
        background: #f7eee8;
      }

      #intro .intro__scene {
        z-index: 1;
        opacity: 0;
        visibility: hidden;
        transform: scale(1.035);
        filter: blur(12px) saturate(.94);
        transition:
          opacity 1.25s cubic-bezier(.22, 1, .36, 1),
          transform 2.2s cubic-bezier(.16, 1, .3, 1),
          filter 1.65s cubic-bezier(.16, 1, .3, 1),
          visibility 0s linear 1.25s;
        will-change: opacity, transform, filter;
      }

      #intro .intro__scene:first-child {
        z-index: 2;
        opacity: 1;
        visibility: visible;
        transform: scale(1);
        filter: none;
        transition: none;
      }

      #intro .intro__scene.is-active {
        z-index: 3;
        opacity: 1;
        visibility: visible;
        transform: scale(1);
        filter: blur(0) saturate(1);
        transition-delay: 0s;
      }

      #intro .intro__scene.is-leaving {
        z-index: 2;
        opacity: 0;
        visibility: visible;
        transform: scale(1.018);
        filter: blur(5px) saturate(.97);
        transition-duration: 1.15s, 1.45s, 1.15s, 0s;
      }

      #intro .intro__scene img {
        display: block;
        object-fit: cover;
        object-position: center;
        user-select: none;
        -webkit-user-drag: none;
        transform: scale(1.012);
        will-change: transform;
      }

      #intro .intro__scene.is-active img {
        animation: luneIntroImage 4.8s cubic-bezier(.16, 1, .3, 1) both;
      }

      @keyframes luneIntroImage {
        0% { transform: scale(1.045); }
        100% { transform: scale(1.008); }
      }

      /* Petals only exist visually during the middle scene. */
      #intro .intro__petals {
        position: absolute;
        inset: 0;
        z-index: 7;
        overflow: hidden;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity .7s ease, visibility 0s linear .7s;
      }

      #intro.s2 .intro__petals {
        opacity: 1;
        visibility: visible;
        transition-delay: 0s;
      }

      #intro .intro__petal {
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: var(--w);
        height: auto;
        opacity: 0;
        transform: translate3d(0, -10vh, 0) rotate(var(--r0)) scale(.72);
        transform-origin: 50% 50%;
        filter: drop-shadow(0 7px 14px rgba(74, 33, 28, .14));
        will-change: transform, opacity;
        animation: none;
      }

      #intro.s2 .intro__petal {
        animation: lunePetalFall var(--dur) cubic-bezier(.22, .61, .36, 1) var(--delay) both;
      }

      @keyframes lunePetalFall {
        0% {
          opacity: 0;
          transform: translate3d(0, -12vh, 0) rotate(var(--r0)) scale(.72);
        }
        14% {
          opacity: var(--o);
        }
        52% {
          opacity: var(--o);
          transform: translate3d(var(--mx), 44vh, 0) rotate(var(--rm)) scale(1);
        }
        78% {
          opacity: calc(var(--o) * .82);
        }
        100% {
          opacity: 0;
          transform: translate3d(var(--ex), 112vh, 0) rotate(var(--r1)) scale(.94);
        }
      }

      #intro .intro__vignette {
        position: absolute;
        inset: 0;
        z-index: 8;
        pointer-events: none;
        background:
          radial-gradient(circle at 50% 48%, rgba(255,255,255,0) 42%, rgba(43,22,19,.10) 100%),
          linear-gradient(to bottom, rgba(43,22,19,.04), transparent 28%, transparent 72%, rgba(43,22,19,.10));
        opacity: .72;
      }

      #intro.is-out {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 1.05s cubic-bezier(.16, 1, .3, 1), visibility 0s linear 1.05s;
      }

      @media (prefers-reduced-motion: reduce) {
        #intro { display: none !important; }
      }
    }
  `;
  document.head.appendChild(style);

  function load(path, tag) {
    return new Promise(function (resolve) {
      var e = document.createElement(tag);
      e.onload = resolve;
      e.onerror = resolve;
      e[tag === 'link' ? 'href' : 'src'] = path;
      if (tag === 'link') e.rel = 'stylesheet';
      document.head.appendChild(e);
    });
  }

  Promise.all([load('mobile.css', 'link'), load('mobile.js', 'script')]);

  var petals = intro.querySelector('#introPetals');
  var P = [
    [-10, 5, 74, 1, 3.6, .00, 16, 28, -18, 38, 92, .72],
    [72, -7, 62, 2, 4.0, .30, -12, -24, 20, -42, -96, .66],
    [30, -10, 48, 3, 3.7, .55, 14, 31, -8, 56, 120, .54],
    [88, 15, 70, 1, 4.2, .75, -15, -31, 28, -24, -84, .62],
    [8, 27, 56, 2, 3.9, 1.00, 11, 24, -35, 28, 84, .55],
    [56, 22, 44, 3, 3.6, 1.20, -12, -25, 12, -48, -108, .58],
    [-5, 48, 72, 1, 4.3, 1.45, 18, 38, -24, 44, 110, .50],
    [79, 46, 50, 2, 3.8, 1.65, -18, -35, 18, -54, -116, .64],
    [25, 60, 60, 3, 4.1, 1.85, 12, 27, -16, 36, 96, .48],
    [65, 68, 46, 1, 3.7, 2.05, -10, -21, 22, -40, -90, .56],
    [42, 35, 38, 2, 4.0, 2.25, 9, 18, -10, 34, 86, .44]
  ];

  P.forEach(function (p) {
    var img = new Image();
    img.className = 'intro__petal';
    img.alt = '';
    img.decoding = 'async';
    img.src = 'assets/intro/petal-' + p[3] + '.webp';
    img.style.cssText =
      '--x:' + p[0] + '%;' +
      '--y:' + p[1] + '%;' +
      '--w:' + p[2] + 'px;' +
      '--dur:' + p[4] + 's;' +
      '--delay:' + p[5] + 's;' +
      '--mx:' + p[6] + 'vw;' +
      '--ex:' + p[7] + 'vw;' +
      '--r0:' + p[8] + 'deg;' +
      '--rm:' + p[9] + 'deg;' +
      '--r1:' + p[10] + 'deg;' +
      '--o:' + p[11] + ';';
    img.onerror = function () { img.remove(); };
    if (petals) petals.appendChild(img);
  });

  function wait(ms) {
    return new Promise(function (resolve) {
      timers.push(setTimeout(resolve, ms));
    });
  }

  function scene(n) {
    var scenes = intro.querySelectorAll('.intro__scene');
    scenes.forEach(function (s, i) {
      s.classList.toggle('is-active', i === n - 1);
      s.classList.toggle('is-leaving', i === n - 2);
    });
    intro.className = 'intro s' + n;
    intro.dataset.scene = String(n);
  }

  function finish() {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    try { sessionStorage.setItem('lune-intro-seen', '1'); } catch (e) {}
    root.classList.remove('intro-lock', 'intro-on');
    intro.classList.add('is-out');
    timers.push(setTimeout(function () {
      if (intro.parentNode) intro.remove();
      if (style.parentNode) style.remove();
    }, 1100));
  }

  async function run() {
    await new Promise(function (resolve) {
      requestAnimationFrame(function () {
        requestAnimationFrame(resolve);
      });
    });

    scene(1);
    await wait(1900);
    if (done) return;

    scene(2);
    await wait(3600);
    if (done) return;

    scene(3);
    await wait(2700);
    if (done) return;

    finish();
  }

  run();
})();
