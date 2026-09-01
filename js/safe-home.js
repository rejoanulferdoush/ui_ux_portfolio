/* ============================================================
   SAFE — Home Security App · case study interactions
   Runs after script.js (shared preloader / nav / reveal / cursor).
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero state toggle: Calm <-> Alert ---------- */
  const cs = document.querySelector('.cs');
  const toggle = document.querySelector('.cs-toggle');
  const heroImgs = Array.from(document.querySelectorAll('.cs-phone__screen img'));

  if (cs && toggle && heroImgs.length) {
    const setMode = (mode) => {
      cs.dataset.mode = mode;
      heroImgs.forEach((img) => img.classList.toggle('is-live', img.dataset.mode === mode));
      toggle.querySelectorAll('button').forEach((b) =>
        b.classList.toggle('is-on', b.dataset.mode === mode));
    };
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) setMode(btn.dataset.mode);
    });

    /* auto-demo once, shortly after load, if the visitor hasn't touched it */
    if (!reduceMotion) {
      let touched = false;
      toggle.addEventListener('pointerdown', () => { touched = true; }, { once: true });
      setTimeout(() => {
        if (touched) return;
        setMode('danger');
        setTimeout(() => { if (!touched) setMode('safe'); }, 1900);
      }, 2600);
    }
  }

  /* ---------- Interactive gas threshold ---------- */
  const range = document.getElementById('thRange');
  const read = document.getElementById('thRead');
  const state = document.getElementById('thState');
  const note = document.getElementById('thNote');

  if (range && read && state && note) {
    const C = getComputedStyle(document.documentElement);
    const SAFE = '#34c77b', WARN = '#f0a63c', DANGER = '#ef4444';
    const bands = [
      { max: 100, name: 'Safe',   color: SAFE,
        note: 'Normal gas level is 0–100 PPM. SAFE sits quiet — the sensor tile stays green and nothing is sent.' },
      { max: 500, name: 'Risky',  color: WARN,
        note: 'Above 100 PPM the room card flips to amber and the family is notified. Time to open a window and check the stove.' },
      { max: 9999, name: 'Danger', color: DANGER,
        note: 'Past ~500 PPM it is an emergency: full-screen red, local siren, automatic SMS and calls down the contact list.' },
    ];
    const update = () => {
      const v = +range.value;
      const band = bands.find((b) => v <= b.max);
      read.innerHTML = v + '<small> PPM</small>';
      read.style.color = band.color;
      state.textContent = band.name;
      state.style.color = band.color;
      note.textContent = band.note;
    };
    range.addEventListener('input', update);
    update();
  }

  /* ---------- Alert-tier tabs ---------- */
  const tabBar = document.querySelector('.cs-tabs__bar');
  if (tabBar) {
    const tabs = Array.from(tabBar.querySelectorAll('.cs-tab'));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    tabBar.addEventListener('click', (e) => {
      const tab = e.target.closest('.cs-tab');
      if (!tab) return;
      tabs.forEach((t, i) => {
        const on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        if (panels[i]) panels[i].hidden = !on;
      });
    });
  }

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll('.cs-stat__num[data-count]');
  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const start = performance.now();
        const dur = 1100;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => io.observe(el));
  }

  /* ---------- Side rail scroll-spy ---------- */
  const rail = document.getElementById('csRail');
  if (rail) {
    const links = Array.from(rail.querySelectorAll('a'));
    const targets = links
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach((t) => spy.observe(t));
  }

  /* ---------- Lightbox across every .cs-shot ---------- */
  const lb = document.getElementById('csLb');
  const lbImg = document.getElementById('csLbImg');
  const lbCap = document.getElementById('csLbCap');
  const shots = Array.from(document.querySelectorAll('.cs-shot[data-full]'));

  if (lb && lbImg && shots.length) {
    let idx = 0;
    let lastFocus = null;

    const show = (i) => {
      idx = (i + shots.length) % shots.length;
      const shot = shots[idx];
      lbImg.src = shot.dataset.full;
      lbImg.alt = shot.dataset.cap || '';
      lbCap.textContent = shot.dataset.cap || '';
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.getElementById('csLbClose').focus();
    };
    const close = () => {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => { if (!lb.classList.contains('is-open')) lbImg.src = ''; }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    shots.forEach((shot, i) => {
      shot.setAttribute('role', 'button');
      shot.setAttribute('tabindex', '0');
      shot.addEventListener('click', () => open(i));
      shot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    document.getElementById('csLbClose').addEventListener('click', close);
    document.getElementById('csLbPrev').addEventListener('click', () => show(idx - 1));
    document.getElementById('csLbNext').addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- Filmstrip: drag to scrub (pointer) ---------- */
  document.querySelectorAll('.cs-strip').forEach((strip) => {
    let down = false, startX = 0, startScroll = 0, moved = 0;
    strip.addEventListener('pointerdown', (e) => {
      down = true; moved = 0;
      startX = e.clientX; startScroll = strip.scrollLeft;
      strip.setPointerCapture?.(e.pointerId);
    });
    strip.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      strip.scrollLeft = startScroll - dx;
    });
    const up = () => { down = false; };
    strip.addEventListener('pointerup', up);
    strip.addEventListener('pointercancel', up);
    /* swallow the click that follows a real drag so the lightbox doesn't open */
    strip.addEventListener('click', (e) => {
      if (moved > 6) { e.stopPropagation(); e.preventDefault(); }
    }, true);
  });

});
