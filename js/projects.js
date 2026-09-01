/* ============================================================
   All Projects — filtering + lightbox
   Runs after script.js (shared preloader / nav / reveal / cursor).
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Filter chips ---------- */
  const filterBar = document.getElementById('filters');
  const cards = Array.from(document.querySelectorAll('#projGrid .proj-card'));
  const ndaTiles = Array.from(document.querySelectorAll('#ndaGrid .nda-tile'));

  if (filterBar) {
    const chips = Array.from(filterBar.querySelectorAll('.chip'));
    const items = cards.concat(ndaTiles);
    const ndaSection = document.querySelector('.vault');

    const catsOf = (el) => (el.dataset.cat || '').trim().split(/\s+/).filter(Boolean);
    const matches = (el, filter) => filter === 'all' || catsOf(el).includes(filter);

    /* ---- Dynamic per-category counts --------------------------------------
       Every badge — and the "All" total — is counted from the project cards in
       the DOM at load time. Drop in a new <article class="proj-card"
       data-cat="mobile fintech …"> and the numbers update themselves; no edit
       needed here. */
    const refreshCounts = () => {
      chips.forEach((chip) => {
        const f = chip.dataset.filter;
        const n = cards.filter((el) => matches(el, f)).length;
        const badge = chip.querySelector('.chip__count');
        if (badge) badge.textContent = n;
        // A category with no projects can't be filtered to — dim + disable it.
        const empty = n === 0 && f !== 'all';
        chip.classList.toggle('is-empty', empty);
        chip.disabled = empty;
      });
    };
    refreshCounts();

    const apply = (filter) => {
      items.forEach((el) => el.classList.toggle('is-hidden', !matches(el, filter)));
      // Fold the whole "Under wraps" block away if the filter empties it.
      if (ndaSection) {
        const anyNda = ndaTiles.some((el) => !el.classList.contains('is-hidden'));
        ndaSection.classList.toggle('is-hidden', !anyNda);
      }
    };

    filterBar.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip || chip.disabled) return;
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));
      apply(chip.dataset.filter);
    });

    /* Shift the bar left only once it's genuinely pinned to the top — i.e.
       sharing the row with the sticky Resume / menu capsule. A 1px sentinel
       just above the bar flips .is-stuck the moment the bar would stick. */
    const stickyTop = parseInt(getComputedStyle(filterBar).top, 10) || 14;
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:relative;height:1px;margin-bottom:-1px;pointer-events:none;';
    filterBar.parentNode.insertBefore(sentinel, filterBar);

    new IntersectionObserver(([entry]) => {
      // Stuck only when the sentinel has scrolled ABOVE the sticky line —
      // not when it's simply still below the fold on load.
      const rootTop = entry.rootBounds ? entry.rootBounds.top : stickyTop;
      const stuck = !entry.isIntersecting && entry.boundingClientRect.top <= rootTop;
      filterBar.classList.toggle('is-stuck', stuck);
    }, { rootMargin: `-${stickyTop + 1}px 0px 0px 0px`, threshold: [0] }).observe(sentinel);
  }

  /* ---------- Hero preview deck -------------------------------------------
     The pile is generated straight from the project cards in #projGrid. Add
     another <article class="proj-card" id="…"> with a .proj-card__img and it
     drops into the pile on its own; the "N case studies below" count follows. */
  const deckStack = document.querySelector('.archive__deck-stack');
  const deckCount = document.querySelector('.archive__deck-count');
  if (deckCount) deckCount.textContent = cards.length;

  /* Featured-section subtitle counts itself from the cards in the DOM, so
     dropping in another <article class="proj-card"> updates the number and
     the "project / projects" wording with no edit here. */
  const featCount = document.querySelector('.feat-head__count');
  if (featCount) featCount.textContent = cards.length;
  const featNoun = document.querySelector('.feat-head__noun');
  if (featNoun) featNoun.textContent = cards.length === 1 ? 'project' : 'projects';

  if (deckStack) {
    // Hand-tuned scatter presets, cycled through for however many cards exist.
    // Index 0 is the top card (nearly straight); later ones peek out behind it.
    const RESTING = [
      { rot: -2, tx:  -4, ty: -10 },
      { rot:  6, tx:  18, ty:   5 },
      { rot: -7, tx: -16, ty:   3 },
      { rot:  4, tx:  12, ty:  -6 },
      { rot: -9, tx: -22, ty:   9 },
    ];
    const SCATTER = [
      { rot: -3, tx: -52, ty: -56 },
      { rot:  9, tx:  80, ty:  52 },
      { rot: -8, tx: -84, ty:  42 },
      { rot:  7, tx:  66, ty: -60 },
      { rot: -5, tx: -42, ty:  68 },
    ];

    const picks = cards.slice(0, 5);
    deckStack.innerHTML = '';
    picks.forEach((card, i) => {
      const img = card.querySelector('.proj-card__img');
      if (!img) return;
      const r = RESTING[i % RESTING.length];
      const s = SCATTER[i % SCATTER.length];

      const a = document.createElement('a');
      a.className = 'archive__deck-card';
      a.href = card.id ? '#' + card.id : '#projGrid';
      a.style.zIndex = picks.length - i;
      a.style.setProperty('--rot', r.rot + 'deg');
      a.style.setProperty('--tx', r.tx + 'px');
      a.style.setProperty('--ty', r.ty + 'px');
      a.style.setProperty('--hrot', s.rot + 'deg');
      a.style.setProperty('--htx', s.tx + 'px');
      a.style.setProperty('--hty', s.ty + 'px');

      const im = document.createElement('img');
      im.src = img.getAttribute('src');
      im.alt = (card.querySelector('.proj-card__title') || {}).textContent || img.alt || '';
      im.loading = 'lazy';
      im.decoding = 'async';
      a.appendChild(im);
      deckStack.appendChild(a);
    });
  }

  /* ---------- Client wall: kinetic, drag-to-scrub marquee ---------------
     One rAF loop owns a single scroll offset. Left alone it eases the strip
     leftward; while you drag it follows the pointer 1:1 and remembers the
     last-frame velocity, so on release the strip keeps gliding and settles
     back into the idle drift. The item row is duplicated enough times to
     cover 2x the frame, and the offset wraps by one original-set width so
     the loop is seamless in both directions. */
  const cwall = document.getElementById('clientTicker');
  const cwallTrack = document.getElementById('clientTrack');

  if (cwall && cwallTrack && !reduceMotion) {
    const originals = Array.from(cwallTrack.children);

    const cloneSet = () => originals.forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      cwallTrack.appendChild(c);
    });
    cloneSet();
    let guard = 0;
    while (cwallTrack.scrollWidth < cwall.offsetWidth * 2 + 200 && guard++ < 4) cloneSet();

    // Exact advance for one full loop = distance from item[0] to the first clone.
    let unit = 0;
    const measure = () => {
      const first = cwallTrack.children[0];
      const wrapPoint = cwallTrack.children[originals.length];
      unit = wrapPoint ? wrapPoint.offsetLeft - first.offsetLeft : cwallTrack.scrollWidth / 2;
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    const IDLE_SPEED = 0.45;          // px/frame drift when untouched
    let offset = 0;
    let vel = 0;
    let dragging = false;
    let hovering = false;
    let lastX = 0;

    const wrap = () => {
      if (unit <= 0) return;
      while (offset <= -unit) offset += unit;
      while (offset > 0) offset -= unit;
    };

    const frame = () => {
      if (!dragging) {
        if (Math.abs(vel) > 0.06) {
          offset += vel;
          vel *= 0.93;                // momentum decay
        } else {
          vel = 0;
          if (!hovering) offset -= IDLE_SPEED;
        }
      }
      wrap();
      cwallTrack.style.setProperty('--tx', offset.toFixed(2) + 'px');
      cwallTrack.style.setProperty('--v', (dragging || Math.abs(vel) > 0.06 ? vel : 0).toFixed(2));
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    cwall.addEventListener('pointerdown', (e) => {
      dragging = true; lastX = e.clientX; vel = 0;
      try { cwall.setPointerCapture(e.pointerId); } catch (err) { /* no-op */ }
      cwall.classList.add('is-grabbing');
    });

    cwall.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      offset += dx;
      vel = Math.max(-55, Math.min(55, dx));
      if (Math.abs(dx) > 2) cwall.classList.add('has-dragged');
      wrap();
    });

    const release = (e) => {
      if (!dragging) return;
      dragging = false;
      cwall.classList.remove('is-grabbing');
      if (e && e.pointerId != null && cwall.hasPointerCapture(e.pointerId)) {
        cwall.releasePointerCapture(e.pointerId);
      }
    };
    cwall.addEventListener('pointerup', release);
    cwall.addEventListener('pointercancel', release);

    cwall.addEventListener('pointerenter', () => { hovering = true; });
    cwall.addEventListener('pointerleave', () => { hovering = false; });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCap');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg) {
    let lastFocused = null;

    const open = (src, cap) => {
      lastFocused = document.activeElement;
      lightboxImg.src = src;
      lightboxImg.alt = cap || '';
      if (lightboxCap) lightboxCap.textContent = cap || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    };

    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // release the big image so it isn't kept decoded
      window.setTimeout(() => { if (!lightbox.classList.contains('is-open')) lightboxImg.src = ''; }, 350);
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };

    /* A CTA that carries data-full opens the lightbox; a CTA that's a real
       link (e.g. the SAFE case study) is left alone to navigate. */
    document.querySelectorAll('.proj-card__zoom, .proj-card__cta[data-full]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        open(btn.dataset.full, btn.dataset.cap);
      });
    });

    lightboxClose.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
    });
  }

  /* ---------- Card pointer-follow spotlight (reuse the home-page feel) ---------- */
  if (!reduceMotion) {
    cards.forEach((card) => {
      let ticking = false;
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        if (!ticking) {
          requestAnimationFrame(() => {
            card.style.setProperty('--mx', px.toFixed(1) + '%');
            card.style.setProperty('--my', py.toFixed(1) + '%');
            ticking = false;
          });
          ticking = true;
        }
      });
    });
  }

});
