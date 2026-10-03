(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var body = document.body;

  /* ---------- Іконки ---------- */
  var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
  var ICONS = {
    gem: '<svg ' + S + '><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 6 3-6M12 21 9 9m3 12 3-12"/></svg>',
    users: '<svg ' + S + '><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.8 0 4.5 1.9 4.5 5"/></svg>',
    lotus: '<svg ' + S + '><path d="M12 4c2 2.5 2.5 5.5 0 9-2.5-3.5-2-6.5 0-9z"/><path d="M12 13c-1-3-4-5-8-5 0 5 3 8 8 8m0-3c1-3 4-5 8-5 0 5 3 8 8 8"/><path d="M5 19c4 2 10 2 14 0"/></svg>',
    pin: '<svg ' + S + '><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    phone: '<svg ' + S + '><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
    instagram: '<svg ' + S + '><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>',
    calendar: '<svg ' + S + '><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4m8-4v4"/></svg>'
  };

  $$('[data-icon]').forEach(function (el) {
    var svg = ICONS[el.getAttribute('data-icon')];
    if (svg) el.innerHTML = svg;
  });

  /* ---------- Modal ---------- */
  var openCount = 0;

  function openModal(id, detail) {
    var modal = document.getElementById(id);
    if (!modal) return;

    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add('is-open');

    openCount += 1;
    body.classList.add('is-locked');

    modal.dispatchEvent(new CustomEvent('modal:open', { detail: detail || {} }));
  }

  function closeModal(modal) {
    if (!modal || modal.hidden || !modal.classList.contains('is-open')) return;

    modal.classList.remove('is-open');
    openCount = Math.max(0, openCount - 1);

    if (openCount === 0) body.classList.remove('is-locked');

    window.setTimeout(function () {
      if (!modal.classList.contains('is-open')) modal.hidden = true;
    }, 360);

    modal.dispatchEvent(new CustomEvent('modal:close'));
  }

  window.LUNE = {
    openModal: openModal,
    closeModal: closeModal
  };

  /* ---------- Header ---------- */
  var header = $('#header');

  function onScroll() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Desktop active nav ---------- */
  var navLinks = $$('.nav__link');

  if ('IntersectionObserver' in window && navLinks.length) {
    var linkMap = {};

    navLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#') linkMap[href.slice(1)] = a;
    });

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = linkMap[entry.target.id];
        if (!link) return;

        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(linkMap).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) navObserver.observe(section);
    });
  }

  /* ---------- Mobile menu ---------- */
  var burger = $('#burger');
  var mmenu = $('#mobileMenu');
  var mmenuClose = $('#mmenuClose');

  function setMenu(open) {
    if (!mmenu || !burger) return;

    mmenu.hidden = !open;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.classList.toggle('is-locked', open || openCount > 0);
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
  }

  if (mmenuClose) {
    mmenuClose.addEventListener('click', function () {
      setMenu(false);
    });
  }

  if (mmenu) {
    mmenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }

  /* ---------- Hero steps ---------- */
  var heroSteps = $('#heroSteps');

  if (heroSteps) {
    heroSteps.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-slide]');
      if (!btn) return;

      $$('li', heroSteps).forEach(function (li) {
        li.classList.remove('is-active');
      });

      if (btn.parentElement) btn.parentElement.classList.add('is-active');
    });
  }

  /* ---------- Open / close events ---------- */
  document.addEventListener('click', function (e) {
    var openBooking = e.target.closest('[data-open-booking]');

    if (openBooking) {
      e.preventDefault();
      setMenu(false);
      openModal('bookingModal', {
        service: openBooking.getAttribute('data-service') || null
      });
      return;
    }

    var openVideo = e.target.closest('[data-open-video]');

    if (openVideo) {
      e.preventDefault();
      openModal('videoModal', {
        source: openVideo.getAttribute('data-open-video')
      });
      return;
    }

    var closer = e.target.closest('[data-close-modal]');

    if (closer) {
      closeModal(closer.closest('.modal'));
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;

    $$('.modal.is-open').forEach(closeModal);
    setMenu(false);
  });

  /* ---------- Video ---------- */
  var videoModal = $('#videoModal');
  var video = $('#modalVideo');

  if (videoModal && video) {
    videoModal.addEventListener('modal:open', function () {
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    });

    videoModal.addEventListener('modal:close', function () {
      video.pause();
      try { video.currentTime = 0; } catch (err) {}
    });
  }

  /* ---------- Generic carousel ---------- */
  function carousel(opts) {
    var track = $(opts.track);

    if (!track || !track.children.length) return;

    var prev = $(opts.prev);
    var next = $(opts.next);
    var dotsEl = opts.dots ? $(opts.dots) : null;
    var items = Array.prototype.slice.call(track.children);
    var idx = 0;

    function metrics() {
      var viewport = track.parentElement.clientWidth;
      var width = items[0].getBoundingClientRect().width;

      if (!viewport || !width) return null;

      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      var visible = Math.max(1, Math.round((viewport + gap) / (width + gap)));

      return {
        visible: visible,
        max: Math.max(0, items.length - visible)
      };
    }

    function render() {
      var m = metrics();
      if (!m) return;

      if (idx > m.max) idx = m.max;
      if (idx < 0) idx = 0;

      track.style.transform =
        'translateX(' + (-(items[idx].offsetLeft - items[0].offsetLeft)) + 'px)';

      if (prev) {
        prev.disabled = opts.loop ? m.max === 0 : idx === 0;
      }

      if (next) {
        next.disabled = opts.loop ? m.max === 0 : idx >= m.max;
      }

      if (dotsEl) {
        var count = m.max + 1;

        if (dotsEl.children.length !== count) {
          dotsEl.innerHTML = '';

          if (count > 1) {
            for (var i = 0; i < count; i++) {
              dotsEl.appendChild(document.createElement('span'));
            }
          }
        }

        Array.prototype.forEach.call(dotsEl.children, function (dot, i) {
          dot.classList.toggle('is-active', i === idx);
        });
      }
    }

    function go(direction) {
      var m = metrics();
      if (!m) return;

      var nextIndex = idx + direction;

      if (nextIndex > m.max) nextIndex = opts.loop ? 0 : m.max;
      if (nextIndex < 0) nextIndex = opts.loop ? m.max : 0;

      idx = nextIndex;
      render();
    }

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    var startX = null;

    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (startX === null) return;

      var dx = e.changedTouches[0].clientX - startX;
      startX = null;

      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    }, { passive: true });

    window.addEventListener('resize', render);
    window.addEventListener('load', render);

    render();
  }

  carousel({
    track: '#worksTrack',
    prev: '#worksPrev',
    next: '#worksNext',
    loop: false
  });

  carousel({
    track: '#revTrack',
    prev: '#revPrev',
    next: '#revNext',
    dots: '#revDots',
    loop: true
  });
})();
