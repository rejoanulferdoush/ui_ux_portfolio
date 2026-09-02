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

  /* ---------- Information-architecture map ---------- */
  const iaMap = document.querySelector('.cs-ia__map');
  if (iaMap) {
    const branches = Array.from(iaMap.querySelectorAll('.cs-iabranch'));
    const mqMobile = window.matchMedia('(max-width: 620px)');
    const canHover = window.matchMedia('(hover: hover)').matches;

    const syncCollapse = () => {
      branches.forEach((b) => {
        const open = !mqMobile.matches;
        b.classList.toggle('is-open', open);
        b.querySelector('.cs-iabranch__head').setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    };
    syncCollapse();
    mqMobile.addEventListener('change', syncCollapse);

    const clearSpot = () => {
      iaMap.classList.remove('has-spot', 'is-preview');
      branches.forEach((b) => b.classList.remove('is-spot'));
    };
    const spot = (branch) => {
      iaMap.classList.add('has-spot');
      iaMap.classList.remove('is-preview');
      branches.forEach((b) => b.classList.toggle('is-spot', b === branch));
    };

    branches.forEach((branch) => {
      const head = branch.querySelector('.cs-iabranch__head');

      head.addEventListener('click', () => {
        if (mqMobile.matches) {
          const open = branch.classList.toggle('is-open');
          head.setAttribute('aria-expanded', open ? 'true' : 'false');
          return;
        }
        if (branch.classList.contains('is-spot') && !iaMap.classList.contains('is-preview')) {
          clearSpot();
        } else {
          spot(branch);
        }
      });

      if (canHover && !reduceMotion) {
        branch.addEventListener('pointerenter', () => {
          if (iaMap.classList.contains('has-spot') && !iaMap.classList.contains('is-preview')) return;
          iaMap.classList.add('has-spot', 'is-preview');
          branches.forEach((b) => b.classList.toggle('is-spot', b === branch));
        });
        branch.addEventListener('pointerleave', () => {
          if (iaMap.classList.contains('is-preview')) clearSpot();
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && iaMap.classList.contains('has-spot')) clearSpot();
    });
  }

  /* ---------- IA stat counters ---------- */
  const iaStats = document.querySelectorAll('.cs-ia__stats dt[data-count]');
  if (iaStats.length) {
    const iaIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        if (reduceMotion) { el.textContent = target; iaIo.unobserve(el); return; }
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / 900, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        iaIo.unobserve(el);
      });
    }, { threshold: 0.6 });
    iaStats.forEach((el) => iaIo.observe(el));
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

  /* ---------- Lightbox across every .cs-shot (with zoom + pan) ---------- */
  const lb = document.getElementById('csLb');
  const lbImg = document.getElementById('csLbImg');
  const lbCap = document.getElementById('csLbCap');
  const shots = Array.from(document.querySelectorAll('.cs-shot[data-full]'));

  if (lb && lbImg && shots.length) {
    let idx = 0;
    let lastFocus = null;

    /* zoom state */
    const ZOOM_MIN = 1, DBL_ZOOM = 2.6;
    let scale = 1, tx = 0, ty = 0, baseW = 0, baseH = 0, maxScale = 5;
    let panning = false, panMoved = 0, sx = 0, sy = 0, sTx = 0, sTy = 0;

    /* fitted (scale-1) size of the current image inside the 90vw x 90vh stage,
       plus how far it can zoom before it runs past its own pixels and smears */
    const fitImg = () => {
      const availW = window.innerWidth * 0.9, availH = window.innerHeight * 0.9;
      const nw = lbImg.naturalWidth || availW, nh = lbImg.naturalHeight || availH;
      const r = Math.min(availW / nw, availH / nh, 1);
      baseW = Math.round(nw * r); baseH = Math.round(nh * r);
      maxScale = Math.max(2, Math.min(6, (nw / (baseW || 1)) * 1.05));
    };
    const clampPan = () => {
      /* keep the image roughly within view once zoomed */
      const bw = baseW * scale, bh = baseH * scale;
      const ex = Math.max(0, (bw - window.innerWidth) / 2 + 40);
      const ey = Math.max(0, (bh - window.innerHeight) / 2 + 40);
      tx = Math.max(-ex, Math.min(ex, tx));
      ty = Math.max(-ey, Math.min(ey, ty));
    };
    const apply = () => {
      if (scale <= ZOOM_MIN) { scale = ZOOM_MIN; tx = 0; ty = 0; }
      else clampPan();
      /* width/height drive the zoom so the browser resamples the full-res
         source; transform only carries the pan offset */
      if (baseW) { lbImg.style.width = (baseW * scale) + 'px'; lbImg.style.height = (baseH * scale) + 'px'; }
      lbImg.style.transform = `translate(${tx}px, ${ty}px)`;
      lb.classList.toggle('is-zoomed', scale > ZOOM_MIN);
      lb.classList.toggle('is-panning', panning);
    };
    const resetZoom = () => { scale = 1; tx = 0; ty = 0; panning = false; apply(); };

    /* zoom toward a screen point (cx, cy measured from viewport centre) */
    const zoomTo = (next, cx, cy) => {
      next = Math.max(ZOOM_MIN, Math.min(maxScale, next));
      const f = next / scale;
      tx = cx - (cx - tx) * f;
      ty = cy - (cy - ty) * f;
      scale = next;
      apply();
    };

    const show = (i) => {
      idx = (i + shots.length) % shots.length;
      const shot = shots[idx];
      lbImg.style.width = ''; lbImg.style.height = ''; baseW = 0; baseH = 0;
      lbImg.src = shot.dataset.full;
      lbImg.alt = shot.dataset.cap || '';
      lbCap.textContent = shot.dataset.cap || '';
      const ready = () => { fitImg(); resetZoom(); };
      if (lbImg.complete && lbImg.naturalWidth) ready();
      else lbImg.addEventListener('load', ready, { once: true });
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
      resetZoom();
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
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === '+' || e.key === '=') zoomTo(scale + 0.5, 0, 0);
      else if (e.key === '-' || e.key === '_') zoomTo(scale - 0.5, 0, 0);
      else if (e.key === '0') resetZoom();
    });

    /* wheel = zoom toward the cursor */
    lb.addEventListener('wheel', (e) => {
      if (!lb.classList.contains('is-open')) return;
      e.preventDefault();
      const cx = e.clientX - window.innerWidth / 2;
      const cy = e.clientY - window.innerHeight / 2;
      zoomTo(scale * (e.deltaY < 0 ? 1.18 : 1 / 1.18), cx, cy);
    }, { passive: false });

    /* drag to pan while zoomed */
    lbImg.setAttribute('draggable', 'false');
    lbImg.addEventListener('dragstart', (e) => e.preventDefault());
    lbImg.addEventListener('pointerdown', (e) => {
      if (scale <= ZOOM_MIN) return;
      e.preventDefault();
      panning = true; panMoved = 0;
      sx = e.clientX; sy = e.clientY; sTx = tx; sTy = ty;
      lbImg.setPointerCapture?.(e.pointerId);
      apply();
    });
    lbImg.addEventListener('pointermove', (e) => {
      if (!panning) return;
      panMoved = Math.max(panMoved, Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy));
      tx = sTx + (e.clientX - sx);
      ty = sTy + (e.clientY - sy);
      apply();
    });
    const endPan = () => { if (panning) { panning = false; apply(); } };
    lbImg.addEventListener('pointerup', endPan);
    lbImg.addEventListener('pointercancel', endPan);
    /* click the image to toggle zoom (a pan-release must not count as a click) */
    lbImg.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panMoved > 6) { panMoved = 0; return; }
      if (scale > ZOOM_MIN) resetZoom();
      else zoomTo(DBL_ZOOM, e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2);
    });

    window.addEventListener('resize', () => { fitImg(); apply(); });
  }

  /* ---------- Filmstrip: drag to scrub (pointer) ---------- */
  document.querySelectorAll('.cs-strip').forEach((strip) => {
    let down = false, dragging = false, startX = 0, startScroll = 0, moved = 0, pid = null;

    /* kill the browser's native image ghost-drag — it cancels the pointer stream */
    strip.querySelectorAll('img').forEach((img) => {
      img.setAttribute('draggable', 'false');
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    strip.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      down = true; dragging = false; moved = 0; pid = e.pointerId;
      startX = e.clientX; startScroll = strip.scrollLeft;
    });
    strip.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      /* only hijack the pointer once it's clearly a drag — keeps plain clicks
         reaching the thumbnail so the lightbox still opens */
      if (!dragging && moved > 8) {
        dragging = true;
        strip.classList.add('is-dragging');
        strip.setPointerCapture?.(pid);
      }
      if (dragging) strip.scrollLeft = startScroll - dx;
    });
    const up = () => { down = false; dragging = false; strip.classList.remove('is-dragging'); };
    strip.addEventListener('pointerup', up);
    strip.addEventListener('pointercancel', up);
    strip.addEventListener('lostpointercapture', up);
    /* swallow the click that follows a real drag so the lightbox doesn't open */
    strip.addEventListener('click', (e) => {
      if (moved > 8) { e.stopPropagation(); e.preventDefault(); moved = 0; }
    }, true);
  });

});
