(function () {
  'use strict';

  var root = document.documentElement;
  var intro = document.getElementById('intro');
  var mobile = window.matchMedia('(max-width: 767px)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('luneCanvas');
  var photo = document.getElementById('lunePhoto');
  var ambient = document.getElementById('luneAmbient');
  var ctx = canvas && canvas.getContext('2d');
  var frame = 0;
  var last = 0;
  var clock = 0;
  var nextWave = 1.9;
  var w = 0;
  var h = 0;
  var particles = [];
  var sprites = [];
  var done = false;
  var timers = [];
  var dpr = 1;

  if (!intro || !mobile || reduced || !canvas || !ctx) {
    if (intro) intro.remove();
    root.classList.remove('intro-on', 'intro-lock');
    return;
  }

  var BACKGROUND_URL = './assets/intro/lune-background.png';
  var PETALS = [
    './assets/intro/petal-1.webp',
    './assets/intro/petal-2.webp',
    './assets/intro/petal-3.webp'
  ];

  var style = document.createElement('style');
  style.textContent = `
    html.intro-lock,html.intro-lock body{overflow:hidden!important;height:100%!important;overscroll-behavior:none}
    #intro{position:fixed!important;inset:0!important;z-index:99999!important;width:100%!important;height:100%!important;height:100svh!important;overflow:hidden!important;background:#f4ded9!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;isolation:isolate;transition:opacity 1.05s cubic-bezier(.16,1,.3,1),visibility 0s linear 1.05s}
    #luneOpening{position:absolute;inset:0;overflow:hidden;background:radial-gradient(ellipse at center,#fcf2ec,#f4ded9)}
    .lune-opening__ambient,.lune-opening__photo,.lune-opening__canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
    .lune-opening__ambient{object-fit:cover;filter:blur(38px);opacity:0;transform:scale(1.08);transition:opacity 1.6s cubic-bezier(.22,.61,.36,1)}
    .lune-opening__photo{object-fit:contain;opacity:0;transform:scale(1.025);transition:opacity 2.8s cubic-bezier(.22,.61,.36,1),transform 4.6s cubic-bezier(.16,1,.3,1)}
    .lune-opening__canvas{pointer-events:none;opacity:0;transition:opacity 1.4s cubic-bezier(.22,.61,.36,1)}
    #intro.is-running .lune-opening__ambient{opacity:.62}
    #intro.is-running .lune-opening__photo{opacity:1;transform:scale(1)}
    #intro.is-running .lune-opening__canvas{opacity:1}
    #intro.is-out{opacity:0;visibility:hidden;pointer-events:none}
    @media (prefers-reduced-motion:reduce){#intro{display:none!important}}
  `;
  document.head.appendChild(style);

  function wait(ms) {
    return new Promise(function (resolve) {
      var id = setTimeout(resolve, ms);
      timers.push(id);
    });
  }

  function resize() {
    var oldW = w;
    var oldH = h;
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
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
    var near = Math.random() > .78;
    var sprite = sprites[Math.floor(Math.random() * sprites.length)];
    return {
      x: cluster ? cluster.x + random(-w * .2, w * .2) : random(-90, w + 90),
      y: initial ? random(-140, h) : cluster ? random(-230, -40) : random(-180, -40),
      phase: random(0, Math.PI * 2),
      angle: random(0, Math.PI * 2),
      spin: random(-.72, .72),
      speed: near ? random(85, 135) : random(42, 88),
      size: near ? random(56, 92) : random(16, 44),
      drift: cluster ? cluster.drift + random(-8, 8) : random(5, 24),
      sway: random(9, 30),
      flutter: random(.45, .95),
      alpha: near ? random(.66, .88) : random(.46, .82),
      near: near,
      extra: !!extra,
      mirror: Math.random() < .5 ? -1 : 1,
      sprite: sprite
    };
  }

  function addWave() {
    if (!sprites.length) return;
    var cluster = { x: random(w * .08, w * .88), drift: random(12, 35) };
    var count = Math.min(w < 600 ? 26 : 36, 110 - particles.length);
    for (var i = 0; i < count; i++) {
      particles.push(makePetal(false, cluster, true));
    }
    nextWave = clock + random(1.8, 3.1);
  }

  function draw(dt) {
    clock += dt;
    ctx.clearRect(0, 0, w, h);
    if (clock >= nextWave) addWave();

    var wind = Math.sin(clock * .38) * 13 + Math.sin(clock * .17) * 7;
    var fit = photo.naturalWidth
      ? Math.min(w / photo.naturalWidth, h / photo.naturalHeight)
      : 1;
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
      var ratio = p.sprite.naturalHeight / p.sprite.naturalWidth;

      ctx.save();
      ctx.translate(x, p.y);
      ctx.rotate(p.angle + Math.sin(p.phase) * .18);
      ctx.scale(p.mirror * (.28 + .72 * Math.abs(Math.cos(p.phase))), 1);
      ctx.globalAlpha = p.alpha * entry * exit * clearLogo;
      ctx.filter = p.near ? 'blur(1.4px)' : 'none';
      ctx.drawImage(p.sprite, -p.size / 2, -p.size * ratio / 2, p.size, p.size * ratio);
      ctx.restore();
    }
  }

  function tick(time) {
    if (done) return;
    var dt = last ? Math.min((time - last) / 1000, .04) : 0;
    last = time;
    draw(dt);
    frame = requestAnimationFrame(tick);
  }

  function load(path, tag) {
    return new Promise(function (resolve) {
      var el = document.createElement(tag);
      el.onload = resolve;
      el.onerror = resolve;
      if (tag === 'link') {
        el.rel = 'stylesheet';
        el.href = path;
      } else {
        el.src = path;
        el.defer = true;
      }
      document.head.appendChild(el);
    });
  }

  function startMobileSite() {
    load('mobile.css?v=20261003-mobile', 'link');
    load('mobile.js?v=20261003-mobile', 'script');
  }

  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(frame);
    timers.forEach(clearTimeout);
    root.classList.remove('intro-lock', 'intro-on');
    intro.classList.add('is-out');
    setTimeout(function () {
      if (intro.parentNode) intro.remove();
      if (style.parentNode) style.remove();
    }, 1100);
  }

  function start() {
    resize();
    clock = 0;
    nextWave = 1.6;
    particles = Array.from({ length: w < 600 ? 76 : 96 }, function () {
      return makePetal(true, null, false);
    });
    intro.classList.add('is-running');
    last = 0;
    frame = requestAnimationFrame(tick);
    timers.push(setTimeout(finish, 5400));
  }

  var petalLoads = PETALS.map(function (src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () { sprites.push(img); resolve(); };
      img.onerror = resolve;
      img.src = src;
    });
  });

  var photoReady = new Promise(function (resolve) {
    photo.onload = resolve;
    photo.onerror = resolve;
    photo.src = BACKGROUND_URL;
    ambient.src = BACKGROUND_URL;
  });

  resize();
  startMobileSite();

  Promise.all([photoReady, Promise.all(petalLoads)]).then(function () {
    if (!sprites.length || !photo.naturalWidth) {
      finish();
      return;
    }
    start();
  });

  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(canvas);
  } else {
    window.addEventListener('resize', resize);
  }

  window.addEventListener('pagehide', function () {
    cancelAnimationFrame(frame);
  }, { once: true });
})();
