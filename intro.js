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
  var blurredSprites = [];
  var done = false;
  var timers = [];
  var dpr = 1;
  var ending = false;
  var endingAt = 0;
  var siteReadyPromise = Promise.resolve();
  var revealStart = 0;
  var INTRO_DURATION = 8200;
  var EXIT_START = 6200;
  var TARGET_PARTICLES = 0;

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
    #intro{position:fixed!important;inset:0!important;z-index:99999!important;width:100%!important;height:100%!important;height:100svh!important;overflow:hidden!important;background:#f4ded9!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;isolation:isolate;transition:opacity 3.2s cubic-bezier(.16,1,.3,1),visibility 0s linear 3.2s}
    #luneOpening{position:absolute;inset:0;overflow:hidden;background:radial-gradient(ellipse at center,#fcf2ec,#f4ded9)}
    body.intro-site-pending .lune-mobile-app{opacity:0!important;transform:translate3d(0,24px,0) scale(.998)!important;transition:opacity 2.35s cubic-bezier(.16,1,.3,1),transform 2.35s cubic-bezier(.16,1,.3,1)!important}
    body.intro-site-ready .lune-mobile-app{opacity:1!important;transform:translate3d(0,0,0) scale(1)!important}
    .lune-opening__ambient,.lune-opening__photo,.lune-opening__canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
    .lune-opening__ambient{object-fit:cover;filter:blur(30px);opacity:0;transform:scale(1.045);filter:blur(18px);will-change:opacity,transform;transition:opacity 2.8s cubic-bezier(.22,1,.36,1),transform 4.6s cubic-bezier(.16,1,.3,1)}
    .lune-opening__photo{object-fit:contain;opacity:0;transform:scale(1.028);will-change:opacity,transform;transition:opacity 4.4s cubic-bezier(.22,1,.36,1),transform 6.2s cubic-bezier(.16,1,.3,1)}
    .lune-opening__canvas{pointer-events:none;opacity:0;will-change:opacity;transition:opacity 2.8s cubic-bezier(.22,1,.36,1)}
    #intro.is-running .lune-opening__ambient{opacity:.58;transform:scale(1)}
    #intro.is-running .lune-opening__photo{opacity:1;transform:scale(1)}
    #intro.is-running .lune-opening__canvas{opacity:1;transition-delay:.75s}
    #intro.is-out{opacity:0;visibility:hidden;pointer-events:none;transition-duration:3.2s}
    #intro.is-out .lune-opening__ambient{opacity:.12;transform:scale(1.02)}
    #intro.is-out .lune-opening__photo{opacity:.08;transform:scale(1.01)}
    #intro.is-out .lune-opening__canvas{opacity:0}
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
      sprite: sprite,
      blurSprite: blurredSprites[sprites.indexOf(sprite)] || sprite
    };
  }

  function addWave() {
    if (!sprites.length) return;
    var cluster = { x: random(w * .08, w * .88), drift: random(12, 35) };
    var count = Math.min(w < 600 ? 18 : 24, TARGET_PARTICLES - particles.length);
    for (var i = 0; i < count; i++) {
      particles.push(makePetal(false, cluster, true));
    }
    nextWave = clock + random(1.8, 3.1);
  }

  function draw(dt) {
    clock += dt;
    ctx.clearRect(0, 0, w, h);
    if (!ending) {
      var rampTarget = TARGET_PARTICLES;
      var ramp = Math.min(1, Math.max(0, clock / 2.4));
      ramp = ramp * ramp * (3 - 2 * ramp);
      var desired = Math.max(24, Math.floor(rampTarget * ramp));
      while (particles.length < desired) particles.push(makePetal(true, null, false));
      if (clock >= nextWave) addWave();
    }

    var wind = Math.sin(clock * .38) * 13 + Math.sin(clock * .17) * 7;
    var reveal = Math.min(1, Math.max(0, clock / 1.9));
    reveal = reveal * reveal * (3 - 2 * reveal);
    var exitProgress = ending ? Math.min(1, Math.max(0, (clock - endingAt) / 2.6)) : 0;
    var exitEase = 1 - (exitProgress * exitProgress * (3 - 2 * exitProgress));
    var exitFade = ending ? exitEase : 1;
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
      ctx.globalAlpha = p.alpha * entry * exit * clearLogo * reveal * exitFade;
      var drawSprite = p.near && p.blurSprite ? p.blurSprite : p.sprite;
      ctx.filter = 'none';
      ctx.drawImage(drawSprite, -p.size / 2, -p.size * ratio / 2, p.size, p.size * ratio);
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
      var settled = false;
      var doneLoad = function () {
        if (settled) return;
        settled = true;
        resolve(el);
      };
      el.onload = doneLoad;
      el.onerror = doneLoad;
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

  function waitForMobileImages() {
    var app = document.querySelector('.lune-mobile-app');
    if (!app) return Promise.resolve();
    var images = Array.prototype.slice.call(app.querySelectorAll('.lm-hero img,.lm-service img,.lm-avatar'));
    return Promise.all(images.map(function (img) {
      if (img.complete && img.naturalWidth) {
        return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      }
      return new Promise(function (resolve) {
        var done = function () {
          if (img.decode) img.decode().catch(function () {}).finally(resolve);
          else resolve();
        };
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
    }));
  }

  function startMobileSite() {
    document.body.classList.add('intro-site-pending');
    return load('mobile.css?v=20261004-mobile-polish5', 'link')
      .then(function () {
        return load('mobile.js?v=20261004-mobile-polish5', 'script');
      })
      .then(waitForMobileImages);
  }

  function beginExit() {
    if (ending || done) return;
    ending = true;
    endingAt = clock;

    // Keep the intro running while both layers crossfade.
    siteReadyPromise.then(function () {
      if (done) return;
      document.body.classList.remove('intro-site-pending');
      document.body.classList.add('intro-site-ready');
      requestAnimationFrame(function () {
        intro.classList.add('is-out');
      });
    });

    timers.push(setTimeout(function () {
      done = true;
      cancelAnimationFrame(frame);
      root.classList.remove('intro-lock', 'intro-on');
      if (intro.parentNode) intro.remove();
      if (style.parentNode) style.remove();
      document.body.classList.remove('intro-site-ready');
    }, 3350));
  }

  function start() {
    resize();
    clock = 0;
    ending = false;
    revealStart = performance.now();
    nextWave = 1.8;
    TARGET_PARTICLES = w < 600 ? 76 : 96;
    particles = Array.from({ length: w < 600 ? 24 : 30 }, function () {
      return makePetal(true, null, false);
    });
    intro.classList.add('is-running');
    last = 0;
    frame = requestAnimationFrame(tick);
    // Start loading the real mobile site after the first visual frames,
    // so its DOM work cannot block the first intro frames.
    timers.push(setTimeout(function () {
      siteReadyPromise = startMobileSite();
    }, 420));
    timers.push(setTimeout(beginExit, EXIT_START));
  }

  function decodeImage(img) {
    if (img.decode) return img.decode().catch(function () {});
    return Promise.resolve();
  }

  var petalLoads = PETALS.map(function (src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        decodeImage(img).then(function () { sprites.push(img); resolve(); });
      };
      img.onerror = resolve;
      img.src = src;
    });
  });

  var photoReady = new Promise(function (resolve) {
    photo.onload = function () {
      decodeImage(photo).then(resolve);
    };
    photo.onerror = resolve;
    photo.src = BACKGROUND_URL;
    ambient.src = BACKGROUND_URL;
  });

  resize();
  Promise.all([photoReady, Promise.all(petalLoads)]).then(function () {
    if (!sprites.length || !photo.naturalWidth) {
      return;
    }

    blurredSprites = sprites.map(function (img) {
      var c = document.createElement('canvas');
      var scale = Math.min(1, 220 / Math.max(img.naturalWidth, img.naturalHeight));
      c.width = Math.max(1, Math.round(img.naturalWidth * scale));
      c.height = Math.max(1, Math.round(img.naturalHeight * scale));
      var cctx = c.getContext('2d');
      cctx.filter = 'blur(1.4px)';
      cctx.drawImage(img, 0, 0, c.width, c.height);
      return c;
    });

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
