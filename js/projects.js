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

    const matches = (el, filter) =>
      filter === 'all' || (el.dataset.cat || '').split(/\s+/).includes(filter);

    // Fill each chip's count
    chips.forEach((chip) => {
      const f = chip.dataset.filter;
      const n = items.filter((el) => matches(el, f)).length;
      const badge = chip.querySelector('.chip__count');
      if (badge) badge.textContent = n;
    });

    const apply = (filter) => {
      items.forEach((el) => {
        const show = matches(el, filter);
        el.classList.toggle('is-hidden', !show);
      });
    };

    filterBar.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));
      apply(chip.dataset.filter);
    });
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

    document.querySelectorAll('.proj-card__zoom').forEach((btn) => {
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
