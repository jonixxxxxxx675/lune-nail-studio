/* ============================================================
   LUNE Nail Studio — інтерфейс + 3D hero (Three.js r160)
   ============================================================ */

/* ---------- НАЛАШТУВАННЯ HERO ---------- */
const CONFIG = {
  mode: 'webgl',
  video: {
    src: 'assets/hero.mp4',
    poster: 'assets/hero-poster.jpg'
  },
  handModel: 'assets/hand.glb'
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   UI
   ============================================================ */
function initUI() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  $$('.ph > img').forEach((img) => {
    const mark = () => img.parentElement.classList.add('is-missing');
    if (img.complete && img.naturalWidth === 0) mark();
    img.addEventListener('error', mark);
  });

  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger');
  if (burger) {
    const setNav = (open) => {
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
    $$('.nav__link').forEach((a) => a.addEventListener('click', () => setNav(false)));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
  }

  const links = $$('.nav__link');
  const sections = links
    .map((a) => $(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => navIO.observe(s));
  }

  const reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const revIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          revIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => revIO.observe(el));
  }

  const track = $('#worksTrack');
  const prev = $('#worksPrev');
  const next = $('#worksNext');

  if (track && prev && next) {
    const step = (dir) => {
      const first = track.children[0];
      if (!first) return;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap) || 16;
      track.scrollBy({
        left: dir * (first.getBoundingClientRect().width + gap) * 2,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    };

    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
  }
}

/* ============================================================
   HERO
   ============================================================ */
async function initHero() {
  const hero = $('#hero');
  const media = $('#heroMedia');
  const canvas = $('#heroCanvas');
  if (!hero || !media || !canvas) return;

  if (CONFIG.mode === 'video') {
    initVideoBackground(hero, media, canvas);
    return;
  }

  if (!hasWebGL()) {
    hero.classList.add('no-webgl');
    return;
  }

  try {
    const THREE = await import('three');
    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');

    startScene({ THREE, RoomEnvironment, GLTFLoader, hero, media, canvas });
  } catch (err) {
    console.warn('[LUNE] 3D-сцену не запущено, показано статичний фон:', err);
    hero.classList.add('no-webgl');
  }
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    );
  } catch (e) {
    return false;
  }
}

/* ---------- Відеофон ---------- */
function initVideoBackground(hero, media, canvas) {
  canvas.style.display = 'none';

  const video = document.createElement('video');
  video.className = 'hero__video';
  video.src = CONFIG.video.src;
  video.poster = CONFIG.video.poster;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = !reduceMotion;
  video.preload = 'auto';

  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');

  video.addEventListener('error', () => {
    video.remove();
    hero.classList.add('no-webgl');
  });

  media.appendChild(video);

  if (!reduceMotion) {
    const p = video.play();
    if (p && p.catch) p.catch(() => {});

    let inView = true;

    const sync = () => {
      if (inView && !document.hidden) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      sync();
    }).observe(hero);

    document.addEventListener('visibilitychange', sync);
  }
}

/* ============================================================
   3D-СЦЕНА
   ============================================================ */
function startScene({ THREE, RoomEnvironment, GLTFLoader, hero, media, canvas }) {
  const isNarrow = () => window.innerWidth < 900;
  const lite = isNarrow() || navigator.hardwareConcurrency <= 4;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !lite,
    powerPreference: 'high-performance'
  });

  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const maxDpr = lite ? 1.25 : 1.75;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
  camera.position.set(0, 0, 9);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap;

  scene.add(new THREE.AmbientLight(0xffe6dc, 0.35));

  const key = new THREE.DirectionalLight(0xffd9c4, 2.2);
  key.position.set(-3, 5, 6);
  scene.add(key);

  const rim = new THREE.PointLight(0xf2b8ad, 28, 22, 2);
  rim.position.set(5, 2, 3);
  scene.add(rim);

  const root = new THREE.Group();
  scene.add(root);

  /* ---- Хвилеподібна глянцева поверхня ---- */
  const segX = lite ? 44 : 110;
  const segY = lite ? 30 : 70;

  const silkGeo = new THREE.PlaneGeometry(17, 10, segX, segY);

  const silkMat = new THREE.MeshPhysicalMaterial({
    color: 0xd49c90,
    roughness: 0.28,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    sheen: 0.6,
    sheenColor: new THREE.Color(0xf5cfc4),
    side: THREE.DoubleSide,
    envMapIntensity: 1.1
  });

  const silk = new THREE.Mesh(silkGeo, silkMat);
  silk.rotation.x = -0.95;
  silk.position.set(0.5, -1.0, -1.6);
  root.add(silk);

  const silkPos = silkGeo.attributes.position;
  const silkBase = Float32Array.from(silkPos.array);

  function updateSilk(t) {
    const arr = silkPos.array;

    for (let i = 0; i < arr.length; i += 3) {
      const x = silkBase[i];
      const y = silkBase[i + 1];

      arr[i + 2] =
        Math.sin(x * 0.55 + t * 0.55) * 0.42 +
        Math.sin(y * 0.9 - t * 0.4) * 0.28 +
        Math.sin((x + y) * 0.35 + t * 0.3) * 0.3;
    }

    silkPos.needsUpdate = true;
    silkGeo.computeVertexNormals();
  }

  /* ---- Краплі ---- */
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: 0xe9b9ad,
    roughness: 0.05,
    metalness: 0.0,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.6
  });

  const dropGeo = new THREE.SphereGeometry(
    1,
    lite ? 18 : 36,
    lite ? 14 : 28
  );

  const drops = [];
  const dropCount = lite ? 6 : 14;

  for (let i = 0; i < dropCount; i++) {
    const m = new THREE.Mesh(dropGeo, dropMat);
    const s = 0.08 + Math.random() * 0.2;

    const d = {
      mesh: m,
      s,
      x: -1.5 + Math.random() * 6,
      y: -1.5 + Math.random() * 3.6,
      z: -0.5 + Math.random() * 2.2,
      speed: 0.25 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2
    };

    m.scale.set(s, s * (1.1 + Math.random() * 0.35), s);
    m.position.set(d.x, d.y, d.z);
    root.add(m);
    drops.push(d);
  }

  /* ---- Пелюстки ---- */
  function petalGeometry() {
    const sh = new THREE.Shape();

    sh.moveTo(0, 0);
    sh.bezierCurveTo(0.38, 0.12, 0.44, 0.72, 0, 1);
    sh.bezierCurveTo(-0.44, 0.72, -0.38, 0.12, 0, 0);

    const g = new THREE.ShapeGeometry(sh, lite ? 4 : 10);
    const p = g.attributes.position;

    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      p.setZ(i, x * x * 0.9 + y * y * 0.12);
    }

    g.computeVertexNormals();
    return g;
  }

  const petalGeo = petalGeometry();
  const petalColors = [0xf0c4bb, 0xe3a89d, 0xf6d8d0, 0xd99488];
  const petals = [];
  const petalCount = lite ? 7 : 18;

  for (let i = 0; i < petalCount; i++) {
    const mat = new THREE.MeshPhysicalMaterial({
      color: petalColors[i % petalColors.length],
      roughness: 0.38,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      side: THREE.DoubleSide,
      envMapIntensity: 1.0
    });

    const m = new THREE.Mesh(petalGeo, mat);
    const s = 0.35 + Math.random() * 0.45;

    m.scale.setScalar(s);

    const p = {
      mesh: m,
      x: -2 + Math.random() * 8,
      y: -3 + Math.random() * 6.5,
      z: -0.8 + Math.random() * 3,
      fall: 0.08 + Math.random() * 0.12,
      sway: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      rx: (Math.random() - 0.5) * 0.25,
      ry: (Math.random() - 0.5) * 0.25,
      rz: (Math.random() - 0.5) * 0.2
    };

    m.position.set(p.x, p.y, p.z);
    m.rotation.set(
      Math.random() * 3,
      Math.random() * 3,
      Math.random() * 3
    );

    root.add(m);
    petals.push(p);
  }

  loadHand(THREE, GLTFLoader, root, CONFIG.handModel);

  /* ---- Курсор ---- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  window.addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ---- Розмір і композиція ---- */
  function layout() {
    const w = media.clientWidth || window.innerWidth;
    const h = media.clientHeight || window.innerHeight;

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, maxDpr)
    );

    renderer.setSize(w, h, false);

    camera.aspect = w / h;

    if (camera.aspect >= 1.1) {
      root.position.set(2.4, 0, 0);
      root.scale.setScalar(1);
      camera.position.z = 9;
    } else {
      root.position.set(0, 1.4, 0);
      root.scale.setScalar(0.8);
      camera.position.z = 10.5;
    }

    camera.updateProjectionMatrix();
  }

  layout();

  let running = false;

  new ResizeObserver(() => {
    layout();
    if (!running) frame(0);
  }).observe(media);

  /* ---- Анімація ---- */
  let time = 0;

  function frame(dt) {
    time += dt;
    const t = time;

    updateSilk(t);

    for (const d of drops) {
      d.mesh.position.set(
        d.x + Math.sin(t * d.speed + d.phase) * 0.18,
        d.y + Math.sin(t * d.speed * 0.8 + d.phase) * 0.28,
        d.z
      );
    }

    for (const p of petals) {
      p.y -= p.fall * dt;

      if (p.y < -3.4) p.y = 3.4;

      p.mesh.position.set(
        p.x + Math.sin(t * 0.3 + p.phase) * p.sway,
        p.y,
        p.z
      );

      p.mesh.rotation.x += p.rx * dt;
      p.mesh.rotation.y += p.ry * dt;
      p.mesh.rotation.z += p.rz * dt;
    }

    pointer.x += (pointer.tx - pointer.x) *
      Math.min(1, dt * 2.5 + 0.02);

    pointer.y += (pointer.ty - pointer.y) *
      Math.min(1, dt * 2.5 + 0.02);

    root.rotation.y = pointer.x * 0.12;
    root.rotation.x = pointer.y * 0.06;

    rim.position.x = 5 + pointer.x * 1.5;
    rim.position.y = 2 - pointer.y * 1.0;

    renderer.render(scene, camera);
  }

  /* ---- Цикл ---- */
  let rafId = 0;
  let last = 0;
  let heroVisible = true;

  function loop(now) {
    if (!running) return;

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    frame(dt);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running || reduceMotion) return;

    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  function sync() {
    if (heroVisible && !document.hidden) {
      start();
    } else {
      stop();
    }
  }

  new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
    sync();
  }).observe(hero);

  document.addEventListener('visibilitychange', sync);

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    stop();
    hero.classList.add('no-webgl');
  });

  frame(0);
  sync();
}

/* ---------- 3D-модель руки ---------- */
async function loadHand(THREE, GLTFLoader, parent, url) {
  try {
    const head = await fetch(url, { method: 'HEAD' });
    if (!head.ok) return;

    const gltf = await new GLTFLoader().loadAsync(url);
    const model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const k = 4 / (Math.max(size.x, size.y, size.z) || 1);

    model.scale.setScalar(k);
    model.position.sub(center.multiplyScalar(k));
    model.position.z += 1;

    parent.add(model);
  } catch (err) {
    console.info('[LUNE] assets/hand.glb не знайдено або не завантажено. Сайт працює без нього.');
  }
}

/* ---------- Запуск ---------- */
initUI();
initHero();
