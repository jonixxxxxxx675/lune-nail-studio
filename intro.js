(function () {
  'use strict';

  var root = document.documentElement;
  var intro = document.getElementById('intro');
  var mq = window.matchMedia('(max-width: 767px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var done = false;
  var frame = 0;
  var last = 0;
  var clock = 0;
  var nextWave = 2;
  var w = 0;
  var h = 0;
  var particles = [];
  var sprite = null;
  var ready = false;
  var photoReady = false;
  var started = false;

  if (!intro || !mq.matches || reduced) {
    if (intro) intro.remove();
    root.classList.remove('intro-on', 'intro-lock');
    return;
  }

  var ambient = document.getElementById('luneAmbient');
  var photo = document.getElementById('lunePhoto');
  var canvas = document.getElementById('luneCanvas');
  var ctx = canvas.getContext('2d');

  var BACKGROUND_URL = './assets/intro/lune-background.png';
  var PETAL_URL = './assets/intro/petal-1.webp';

  var style = document.createElement('style');
  style.textContent = `
    html.intro-lock, html.intro-lock body {
      overflow: hidden !important;
      height: 100% !important;
      overscroll-behavior: none;
    }

    #intro {
      position: fixed !important;
      inset: 0 !important;
      z-index: 99999 !important;
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      height: 100svh !important;
      overflow: hidden !important;
      background: #f4ded9 !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      isolation: isolate;
    }

    #luneOpening {
      position: absolute;
      inset: 0;
      overflow: hidden;
      isolation: isolate;
      background: radial-gradient(ellipse at center, #fcf2ec, #f4ded9);
    }

    .lune-opening__ambient,
    .lune-opening__photo,
    .lune-opening__canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .lune-opening__ambient {
      object-fit: cover;
      filter: blur(38px);
      opacity: 0;
    }

    .lune-opening__photo {
      object-fit: contain;
      opacity: 0;
    }

    .lune-opening__canvas {
      pointer-events: none;
      opacity: 0;
    }

    #intro.is-running .lune-opening__ambient {
      animation: luneAmbientReveal 3.8s cubic-bezier(.22,.61,.36,1) both;
    }

    #intro.is-running .lune-opening__photo {
      animation: lunePhotoReveal 4s cubic-bezier(.22,.61,.36,1) .15s both;
    }

    #intro.is-running .lune-opening__canvas {
      animation: lunePetalReveal 4.5s cubic-bezier(.22,.61,.36,1) .75s both;
    }

    @keyframes luneAmbientReveal {
      from { opacity: 0; }
      to { opacity: .6; }
    }

    @keyframes lunePhotoReveal {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes lunePetalReveal {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    #intro.is-out {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transition: opacity 1.05s cubic-bezier(.16,1,.3,1), visibility 0s linear 1.05s;
    }

    @media (prefers-reduced-motion: reduce) {
      #intro { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  function resize() {
    var oldW = w;
    var oldH = h;
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (oldW && oldH) {
      particles.forEach(function (p) {
        p.x *= w / oldW;
        p.y *= h / oldH;
      });
    }
  }

  function random(a, b) {
    return a + Math.random() * (b - a);
  }

  function makePetal(initial, cluster, extra) {
    var near = Math.random() > .82;
    return {
      x: cluster ? cluster.x + random(-w * .2, w * .2) : random(-100, w + 80),
      y: initial ? random(-120, h) : cluster ? random(-230, -40) : random(-180, -40),
      phase: random(0, Math.PI * 2),
      angle: random(0, Math.PI * 2),
      spin: random(-.65, .65),
      speed: near ? random(85, 135) : random(40, 88),
      size: near ? random(58, 94) : random(15, 43),
      drift: cluster ? cluster.drift + random(-8, 8) : random(5, 24),
      sway: random(9, 30),
      flutter: random(.45, .95),
      alpha: near ? random(.65, .86) : random(.45, .83),
      near: near,
      extra: !!extra,
      mirror: Math.random() < .5 ? -1 : 1
    };
  }

  function addWave() {
    var cluster = { x: random(w * .1, w * .85), drift: random(12, 35) };
    var baseCount = w < 600 ? 70 : 95;
    var count = Math.min(25, baseCount + 45 - particles.length);
    for (var i = 0; i < count; i++) particles.push(makePetal(false, cluster, true));
    nextWave = clock + random(3.3, 5.5);
  }

  function draw(dt) {
    clock += dt;
    ctx.clearRect(0, 0, w, h);
    if (!sprite) return;
    if (clock >= nextWave) addWave();

    var wind = Math.sin(clock * .38) * 13 + Math.sin(clock * .17) * 7;
    var fit = photo.naturalWidth ? Math.min(w / photo.naturalWidth, h / photo.naturalHeight) : 1;
    var imageW = photo.naturalWidth * fit;
    var imageH = photo.naturalHeight * fit;

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.y += p.speed * dt;
      p.x += (p.drift + wind * (p.near ? 1.3 : .7)) * dt;
      p.phase += dt * p.flutter;
      p.angle += dt * p.spin;

      if (p.y > h + 150 || p.x > w + 180 || p.x < -200) {
        if (p.extra) {
          particles.splice(i, 1);
          continue;
        }
        particles[i] = p = makePetal(false, null, false);
      }

      var x = p.x + Math.sin(p.phase) * p.sway;
      var dx = Math.abs(x - w * .5) / Math.max(1, imageW * .34);
      var dy = Math.abs(p.y - h * .5) / Math.max(1, imageH * .115);
      var distance = Math.max(dx, dy);
      var clearLogo = .06 + .94 * Math.min(1, Math.max(0, (distance - .65) / .6));
      var entry = Math.min(1, Math.max(0, (p.y + 65) / 100));
      var exit = Math.min(1, Math.max(0, (h + 65 - p.y) / 110));
      var ratio = sprite.naturalHeight / sprite.naturalWidth;

      ctx.save();
      ctx.translate(x, p.y);
      ctx.rotate(p.angle + Math.sin(p.phase) * .18);
      ctx.scale(p.mirror * (.28 + .72 * Math.abs(Math.cos(p.phase))), 1);
      ctx.globalAlpha = p.alpha * entry * exit * clearLogo;
      ctx.filter = p.near ? 'blur(1.4px)' : 'none';
      ctx.drawImage(sprite, -p.size / 2, -p.size * ratio / 2, p.size, p.size * ratio);
      ctx.restore();
    }
  }

  function tick(time) {
    var dt = last ? Math.min((time - last) / 1000, .04) : 0;
    last = time;
    draw(dt);
    frame = requestAnimationFrame(tick);
  }

  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(frame);
    root.classList.remove('intro-lock', 'intro-on');
    intro.classList.add('is-out');
    setTimeout(function () {
      if (intro.parentNode) intro.remove();
      if (style.parentNode) style.remove();
    }, 1100);
  }

  function start() {
    if (done || started || !photoReady) return;
    started = true;
    resize();
    clock = 0;
    nextWave = 2;
    particles = Array.from({ length: w < 600 ? 70 : 95 }, function () { return makePetal(true, null, false); });
    intro.classList.add('is-running');
    last = 0;
    frame = requestAnimationFrame(tick);

    setTimeout(function () {
      finish();
    }, 5400);
  }

  var petalImage = new Image();
  petalImage.onload = function () {
    sprite = petalImage;
    ready = true;
    if (photoReady) start();
  };
  petalImage.src = PETAL_URL;

  photo.onload = function () {
    ambient.src = photo.src;
    photoReady = true;
    start();
  };

  photo.onerror = function () {
    finish();
  };

  resize();
  photo.src = BACKGROUND_URL;

  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(canvas);
  } else {
    window.addEventListener('resize', resize);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (!done) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  });
})();
