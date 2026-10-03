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

/* ---------- Запуск ---------- */
initUI();
