(function () {
  'use strict';

  var root = document.documentElement;
  var intro = document.getElementById('intro');
  var mq = window.matchMedia('(max-width: 767px)');
  var KEY = 'lune-intro-seen';
  var done = false;
  var timers = [];

  var PETALS = [
    { x:'-8%', y:'5%',  w:'86px', file:1, dur:'5.8s', delay:'0s',   mx:'13vw',  ex:'28vw',  r0:'-18deg', rm:'38deg',  r1:'92deg',  o:'.72' },
    { x:'72%',  y:'-8%', w:'66px', file:2, dur:'6.6s', delay:'-.8s', mx:'-10vw', ex:'-22vw', r0:'20deg',  rm:'-42deg', r1:'-96deg', o:'.66' },
    { x:'34%',  y:'-12%',w:'54px', file:3, dur:'5.2s', delay:'-1.5s',mx:'16vw',  ex:'34vw',  r0:'-8deg', rm:'56deg',  r1:'120deg', o:'.52' },
    { x:'88%',  y:'16%', w:'72px', file:1, dur:'7.1s', delay:'-2.2s',mx:'-15vw', ex:'-31vw', r0:'28deg', rm:'-24deg', r1:'-84deg', o:'.62' },
    { x:'12%',  y:'29%', w:'58px', file:2, dur:'6.2s', delay:'-3.1s',mx:'11vw',  ex:'24vw',  r0:'-35deg',rm:'28deg',  r1:'84deg',  o:'.55' },
    { x:'57%',  y:'24%', w:'44px', file:3, dur:'5.7s', delay:'-4.1s',mx:'-12vw', ex:'-25vw', r0:'12deg', rm:'-48deg', r1:'-108deg',o:'.58' },
    { x:'-4%',  y:'52%', w:'78px', file:1, dur:'7.5s', delay:'-5.0s',mx:'20vw',  ex:'39vw',  r0:'-24deg',rm:'44deg',  r1:'110deg', o:'.50' },
    { x:'78%',  y:'48%', w:'52px', file:2, dur:'5.9s', delay:'-5.7s',mx:'-18vw', ex:'-35vw', r0:'18deg', rm:'-54deg', r1:'-116deg',o:'.64' },
    { x:'26%',  y:'62%', w:'64px', file:3, dur:'6.9s', delay:'-6.2s',mx:'12vw',  ex:'27vw',  r0:'-16deg',rm:'36deg',  r1:'96deg',  o:'.48' },
    { x:'64%',  y:'72%', w:'46px', file:1, dur:'6.1s', delay:'-7.0s',mx:'-10vw', ex:'-21vw', r0:'22deg', rm:'-40deg', r1:'-90deg', o:'.56' }
  ];

  function remove() {
    root.classList.remove('intro-on', 'intro-lock');
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
  }

  if (!intro || !root.classList.contains('intro-on') || !mq.matches) {
    remove();
    return;
  }

  try { sessionStorage.setItem(KEY, '1'); } catch (e) {}

  function wait(ms) {
    return new Promise(function (resolve) {
      timers.push(setTimeout(resolve, ms));
    });
  }

  function finish(instant) {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    root.classList.remove('intro-lock');
    if (instant) {
      remove();
      return;
    }
    intro.classList.add('is-out');
    timers.push(setTimeout(remove, 780));
  }

  function addPetals() {
    var box = document.getElementById('introPetals');
    if (!box) return;

    PETALS.forEach(function (p) {
      var img = new Image();
      img.className = 'intro__petal';
      img.alt = '';
      img.decoding = 'async';
      img.style.cssText =
        '--x:' + p.x + ';--y:' + p.y + ';--w:' + p.w + ';' +
        '--dur:' + p.dur + ';--delay:' + p.delay + ';--mx:' + p.mx + ';--ex:' + p.ex + ';' +
        '--r0:' + p.r0 + ';--rm:' + p.rm + ';--r1:' + p.r1 + ';--o:' + p.o + ';';
      img.src = 'assets/intro/petal-' + p.file + '.webp';
      img.onerror = function () { img.remove(); };
      box.appendChild(img);
    });
  }

  function showScene(n) {
    var scenes = intro.querySelectorAll('.intro__scene');
    for (var i = 0; i < scenes.length; i++) {
      scenes[i].classList.toggle('is-active', i === n - 1);
    }
    intro.dataset.scene = String(n);
    intro.classList.add('s' + n);
  }

  intro.querySelector('.intro__skip').addEventListener('click', function () {
    finish(false);
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') finish(false);
  });

  var onChange = function (e) {
    if (!e.matches) finish(true);
  };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);

  addPetals();

  // Hard safety limit: intro never blocks the page.
  timers.push(setTimeout(function () { finish(true); }, 11500));

  async function run() {
    await new Promise(function (resolve) {
      requestAnimationFrame(function () {
        requestAnimationFrame(resolve);
      });
    });
    if (done) return;

    // 1. Start / logo.
    showScene(1);
    await wait(1250); if (done) return;

    // 2. Petals appear and begin falling.
    showScene(2);
    await wait(1750); if (done) return;

    // 3. Close-up manicure scene.
    showScene(3);
    await wait(1850); if (done) return;

    // 4. Text reveal scene.
    showScene(4);
    await wait(1900); if (done) return;

    // 5. Same hero scene + live 3D CTA.
    showScene(5);
    await wait(1750); if (done) return;

    finish(false);
  }

  run();
})();
