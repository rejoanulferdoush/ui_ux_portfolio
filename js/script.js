document.addEventListener('DOMContentLoaded', () => {

  /* Preloader */
  const preloader = document.getElementById('preloader');
  const preloaderStage = document.getElementById('preloaderStage');
  const MIN_PRELOADER_MS = 1400;
  const loadedAt = performance.now();

  window.addEventListener('load', () => {
    const remaining = MIN_PRELOADER_MS - (performance.now() - loadedAt);
    setTimeout(() => preloader.classList.add('is-hidden'), Math.max(remaining, 0));
  });

  /* Preloader avatar parallax tilt */
  if (preloaderStage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('mousemove', (e) => {
      if (preloader.classList.contains('is-hidden')) return;
      const relX = (e.clientX / window.innerWidth - 0.5) * 2;
      const relY = (e.clientY / window.innerHeight - 0.5) * 2;
      preloaderStage.style.transform = `rotateY(${relX * 14}deg) rotateX(${relY * -14}deg)`;
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Creative scroll: ease the whole page with Lenis so wheel / trackpad
     input glides with inertia instead of the browser's stepped jump.
     Lenis keeps the native scrollbar and keyboard working and dispatches
     regular scroll events, so every scroll-linked effect below is unchanged.
     Anchor links are routed through lenis.scrollTo for a matching glide.
     Skipped entirely when the visitor asks for reduced motion. */
  let lenis = null;
  if (!reduceMotion && typeof Lenis === 'function') {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      smoothWheel: true,
    });

    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#' || id === '#top') {
          e.preventDefault();
          lenis.scrollTo(0, { force: true });
          return;
        }
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0, force: true });
        }
      });
    });
  }

  /* Header scroll state: only the pinned actions (résumé + burger) react */
  const headerActions = document.querySelector('.header__actions');
  const onScroll = () => {
    const scrolled = window.scrollY > 20;
    headerActions.classList.toggle('is-scrolled', scrolled);
    /* Mobile: Resume sits in the slide-out nav at the top, then hands back to
       the pinned capsule once the page is scrolled */
    document.documentElement.classList.toggle('is-scrolled', scrolled);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Hero: portrait tilts toward the cursor. The title words and supporting
     lines are locked around the avatar by CSS, so nothing moves on scroll. */
  const hero = document.querySelector('.hero');
  const heroPortraitWrap = document.getElementById('heroPortraitWrap');

  if (hero && heroPortraitWrap && !reduceMotion) {
    let tiltX = 0, tiltY = 0, ticking = false;

    const render = () => {
      heroPortraitWrap.style.transform =
        `rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
      ticking = false;
    };
    const queueRender = () => {
      if (!ticking) { requestAnimationFrame(render); ticking = true; }
    };

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      tiltX = relX * 10;
      tiltY = relY * -10;
      queueRender();
    });
    hero.addEventListener('mouseleave', () => { tiltX = 0; tiltY = 0; queueRender(); });
  }

  /* Hero skills strip: drifts left on its own, but you can grab it and drag
     left / right to scrub through the skills. Follows the pointer 1:1 while
     held, keeps momentum on release, then eases back into the idle drift;
     pauses the drift while hovered. The markup lists the skill set twice, so
     the offset wraps by one set-width and the loop is seamless both ways. */
  const skillsStrip = document.getElementById('skillsTicker');
  const skillsTrack = document.getElementById('skillsTrack');

  if (skillsStrip && skillsTrack && !reduceMotion) {
    let unit = 0;
    const measure = () => {
      const kids = skillsTrack.children;
      const half = Math.floor(kids.length / 2);
      unit = half ? kids[half].offsetLeft - kids[0].offsetLeft
                  : skillsTrack.scrollWidth / 2;
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    const IDLE_SPEED = 0.4;            // px/frame leftward drift when untouched
    let offset = 0, vel = 0, dragging = false, hovering = false, lastX = 0;

    const wrap = () => {
      if (unit <= 0) return;
      while (offset <= -unit) offset += unit;
      while (offset > 0) offset -= unit;
    };

    const frame = () => {
      if (!dragging) {
        if (Math.abs(vel) > 0.06) { offset += vel; vel *= 0.92; }
        else { vel = 0; if (!hovering) offset -= IDLE_SPEED; }
      }
      wrap();
      skillsTrack.style.setProperty('--tx', offset.toFixed(2) + 'px');
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    skillsStrip.addEventListener('pointerenter', () => { hovering = true; });
    skillsStrip.addEventListener('pointerleave', () => { hovering = false; });

    skillsStrip.addEventListener('pointerdown', (e) => {
      dragging = true; lastX = e.clientX; vel = 0;
      try { skillsStrip.setPointerCapture(e.pointerId); } catch (err) { /* no-op */ }
      skillsStrip.classList.add('is-grabbing');
    });
    skillsStrip.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      offset += dx;
      vel = Math.max(-55, Math.min(55, dx));
      wrap();
    });
    const release = (e) => {
      if (!dragging) return;
      dragging = false;
      skillsStrip.classList.remove('is-grabbing');
      if (e && e.pointerId != null && skillsStrip.hasPointerCapture(e.pointerId)) {
        skillsStrip.releasePointerCapture(e.pointerId);
      }
    };
    skillsStrip.addEventListener('pointerup', release);
    skillsStrip.addEventListener('pointercancel', release);
  }

  /* Header identity: type the role line out like a terminal prompt, cycling roles */
  const roleEl = document.querySelector('.logo__role-text');
  if (roleEl) {
    const roles = (roleEl.dataset.roles || '')
      .split('|').map(s => s.trim()).filter(Boolean);
    if (roles.length > 1 && !reduceMotion) {
      let ri = 0, ci = roles[0].length, deleting = true;
      const tick = () => {
        const word = roles[ri];
        ci += deleting ? -1 : 1;
        roleEl.textContent = word.slice(0, ci);
        let delay = deleting ? 45 : 95;
        if (!deleting && ci === word.length) { deleting = true; delay = 1800; }
        else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 380; }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 2400);
    }
  }

  /* Featured Work: scroll-driven "wormhole" intensity.
     Bell curve (0 → 1 → 0) mapped to the section's pass through the viewport, so the
     effect builds as the visitor scrolls into the projects, peaks while centered, and
     releases back to normal by the time the next section takes over. */
  const workWarp = document.querySelector('.work-warp');
  const workWarpVideo = workWarp ? workWarp.querySelector('.work-warp__video') : null;
  if (workWarp && !reduceMotion) {
    let warpTicking = false;
    const renderWarp = () => {
      const rect = workWarp.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const scrolled = window.innerHeight - rect.top;
      const progress = Math.min(Math.max(scrolled / total, 0), 1);
      const intensity = Math.sin(progress * Math.PI);
      workWarp.style.setProperty('--warp-intensity', intensity.toFixed(3));
      warpTicking = false;
    };
    const queueWarp = () => { if (!warpTicking) { requestAnimationFrame(renderWarp); warpTicking = true; } };
    window.addEventListener('scroll', queueWarp, { passive: true });
    window.addEventListener('resize', queueWarp, { passive: true });
    queueWarp();

    // Only decode/play the background video while the section is actually on screen.
    if (workWarpVideo) {
      const warpVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) workWarpVideo.play().catch(() => {});
          else workWarpVideo.pause();
        });
      }, { threshold: 0 });
      warpVideoObserver.observe(workWarp);
    }
  }

  /* Featured Work: pointer-follow spotlight on each card (--mx/--my → CSS radial). */
  document.querySelectorAll('.work-card').forEach((card) => {
    let spotTicking = false;
    let px = 0, py = 0;
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      px = ((e.clientX - rect.left) / rect.width) * 100;
      py = ((e.clientY - rect.top) / rect.height) * 100;
      if (!spotTicking) {
        requestAnimationFrame(() => {
          card.style.setProperty('--mx', px.toFixed(1) + '%');
          card.style.setProperty('--my', py.toFixed(1) + '%');
          spotTicking = false;
        });
        spotTicking = true;
      }
    });
  });

  /* Off-canvas nav */
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navBackdrop = document.getElementById('navBackdrop');
  const navPinned = document.querySelector('.header__actions');

  /* Keep the slide-out menu clear of the pinned Resume + close (X) capsule and
     let it scroll inside itself when the links don't fit. Everything is measured
     live from the capsule's real bottom edge, so any number of menu items — at
     any capsule size, viewport height, or scroll position — auto-adjusts: the
     gap below the capsule always holds and an overflowing menu scrolls cleanly
     instead of sliding under the capsule. */
  const NAV_GAP_BELOW_CAPSULE = 28;
  const fitNav = () => {
    if (!nav || !nav.classList.contains('is-open')) return;
    const capsuleBottom = navPinned ? navPinned.getBoundingClientRect().bottom : 0;
    nav.style.setProperty(
      '--nav-pad-top',
      Math.max(0, Math.round(capsuleBottom + NAV_GAP_BELOW_CAPSULE)) + 'px'
    );
    nav.classList.toggle('is-scrollable', nav.scrollHeight > nav.clientHeight + 1);
  };
  let navFitRaf = 0;
  const queueFitNav = () => {
    if (navFitRaf) return;
    navFitRaf = requestAnimationFrame(() => { navFitRaf = 0; fitNav(); });
  };

  /* While the menu is open the page behind it is frozen: Lenis is paused, the
     document gets `overflow:hidden`, and wheel / touch over the backdrop is
     swallowed. Only the menu itself scrolls — and only when its links overflow
     (`.nav` keeps `overflow-y:auto` + `overscroll-behavior:contain`). */
  const blockScroll = (e) => { e.preventDefault(); };
  const openNav = () => {
    nav.classList.add('is-open');
    navToggle.classList.add('is-active');
    navBackdrop.classList.add('is-open');
    document.documentElement.classList.add('nav-open');
    if (lenis) lenis.stop();
    navBackdrop.addEventListener('wheel', blockScroll, { passive: false });
    navBackdrop.addEventListener('touchmove', blockScroll, { passive: false });
    fitNav();
    /* re-measure once the capsule's open-state transition has settled */
    setTimeout(fitNav, 400);
  };
  const closeNav = () => {
    nav.classList.remove('is-open', 'is-scrollable');
    navToggle.classList.remove('is-active');
    navBackdrop.classList.remove('is-open');
    document.documentElement.classList.remove('nav-open');
    if (lenis) lenis.start();
    navBackdrop.removeEventListener('wheel', blockScroll, { passive: false });
    navBackdrop.removeEventListener('touchmove', blockScroll, { passive: false });
  };
  navToggle.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) closeNav();
    else openNav();
  });
  navBackdrop.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      closeNav();
      /* closeNav() restarts Lenis, and Lenis.start() runs reset() which snaps
         targetScroll back to the current position — that cancels the glide the
         global a[href^="#"] handler just kicked off. Re-issue it on the next
         frame, once Lenis is live again, so in-page menu links actually land. */
      if (lenis && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) requestAnimationFrame(() => lenis.scrollTo(target, { offset: 0, force: true }));
      }
    });
  });
  window.addEventListener('resize', queueFitNav, { passive: true });
  window.addEventListener('scroll', queueFitNav, { passive: true });
  if (window.ResizeObserver && navPinned) {
    new ResizeObserver(queueFitNav).observe(navPinned);
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* Counters */
  const counters = document.querySelectorAll('.stat__number, .experience__stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));

  /* Contact: the email "vault".
     The real address never sits in the page source — it's assembled here on the
     fly, and only once the button has been cracked open with three clicks. The
     button never moves: each click lands a satisfying jolt in place, fills one of
     three progress pips, and swaps the label. Doubles as a small anti-scraping
     measure and a bit of personality instead of a flat mailto link. */
  const emailGame = document.getElementById('emailGame');
  const emailBtn = document.getElementById('emailRevealBtn');
  if (emailGame && emailBtn) {
    const email = ['rejoanulferdoush', 'gmail.com'].join('@');
    const phoneRaw = '+8801627647942';
    const phonePretty = '+880 1627-647942';
    const label = document.getElementById('emailRevealLabel');
    const icon = document.getElementById('emailRevealIcon');
    const hint = document.getElementById('emailHint');
    const pips = Array.from(document.querySelectorAll('#emailProgress span'));
    const steps = [
      { label: 'Almost…',   icon: 'bxs-lock-alt' },
      { label: 'One more…',  icon: 'bxs-lock-open-alt' },
    ];
    const maxClicks = 3;
    let clicks = 0;
    let done = false;

    if (!reduceMotion) {
      emailBtn.addEventListener('pointermove', (e) => {
        const r = emailBtn.getBoundingClientRect();
        emailBtn.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
        emailBtn.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    }

    const jolt = () => {
      emailBtn.classList.remove('is-jolt');
      void emailBtn.offsetWidth; // restart the animation
      emailBtn.classList.add('is-jolt');
    };

    const sparkle = () => {
      if (reduceMotion) return;
      for (let i = 0; i < 14; i += 1) {
        const dot = document.createElement('span');
        dot.className = 'contact__spark';
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
        const dist = 46 + Math.random() * 60;
        dot.style.setProperty('--sx', `${Math.cos(angle) * dist}px`);
        dot.style.setProperty('--sy', `${Math.sin(angle) * dist}px`);
        dot.style.setProperty('--sd', `${420 + Math.random() * 360}ms`);
        emailGame.appendChild(dot);
        dot.addEventListener('animationend', () => dot.remove());
      }
    };

    const revealEmail = () => {
      done = true;
      sparkle();
      emailBtn.classList.add('is-cracked');
      window.setTimeout(() => {
        emailGame.innerHTML = '';
        const link = document.createElement('a');
        link.href = `mailto:${email}`;
        link.className = 'contact__email';
        link.textContent = email;

        const copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'contact__email-copy';
        copy.innerHTML = "<i class='bx bx-copy'></i><span>Copy email</span>";
        copy.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(email);
            copy.classList.add('is-done');
            copy.innerHTML = "<i class='bx bx-check'></i><span>Copied</span>";
            window.setTimeout(() => {
              copy.classList.remove('is-done');
              copy.innerHTML = "<i class='bx bx-copy'></i><span>Copy email</span>";
            }, 2000);
          } catch (err) {
            copy.querySelector('span').textContent = 'Press Ctrl+C';
          }
        });

        const phone = document.createElement('a');
        phone.href = `tel:${phoneRaw}`;
        phone.className = 'contact__phone';
        phone.innerHTML = `<i class='bx bx-phone'></i>${phonePretty}`;

        emailGame.appendChild(link);
        emailGame.appendChild(phone);
        emailGame.appendChild(copy);
        requestAnimationFrame(() => emailGame.classList.add('is-revealed'));
        if (hint) hint.textContent = "the vault's open — email or call, I reply fast.";
      }, reduceMotion ? 0 : 480);
    };

    emailBtn.addEventListener('click', () => {
      if (done) return;
      clicks += 1;
      jolt();
      if (pips[clicks - 1]) pips[clicks - 1].classList.add('is-on');

      if (clicks >= maxClicks) {
        if (label) label.textContent = 'Unlocked!';
        if (icon) icon.className = 'bx bxs-lock-open-alt';
        revealEmail();
        return;
      }

      const step = steps[clicks - 1];
      if (step) {
        if (label) label.textContent = step.label;
        if (icon) icon.className = `bx ${step.icon}`;
      }
    });
  }

  /* Decorative shapes: gentle scroll parallax.
     CSS owns each shape's idle float (on the inner <img>); here we only nudge the
     wrapper's --deco-py based on how far the shape sits from the viewport centre,
     so shapes at different data-speed values drift past each other for depth. */
  const decos = document.querySelectorAll('.deco');
  if (decos.length && !reduceMotion) {
    let decoTicking = false;
    const renderDecos = () => {
      const vh = window.innerHeight;
      decos.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const rel = (rect.top + rect.height / 2 - vh / 2) / vh;
        const speed = parseFloat(el.dataset.speed) || 20;
        el.style.setProperty('--deco-py', (-rel * speed).toFixed(1) + 'px');
      });
      decoTicking = false;
    };
    const queueDecos = () => {
      if (!decoTicking) { requestAnimationFrame(renderDecos); decoTicking = true; }
    };
    window.addEventListener('scroll', queueDecos, { passive: true });
    window.addEventListener('resize', queueDecos, { passive: true });
    queueDecos();
  }

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Cursor aura.
     The native OS cursor is left visible and untouched, so it is always
     clear where a click will land. We only add a soft accent glow that
     eases a beat behind the pointer, swelling into a halo over anything
     clickable. Skipped on touch pointers and with reduced motion. */
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reduceMotion) {
    const root = document.documentElement;
    const aura = document.createElement('div');
    aura.className = 'cursor-aura';
    document.body.appendChild(aura);

    const interactiveSel = 'a, button, [role="button"], input, textarea, select, label, summary, .work-card, [data-cursor="hover"]';

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;   // target
    let ax = mx, ay = my;                                          // eased aura
    let ready = false;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!ready) { ready = true; ax = mx; ay = my; root.classList.add('cursor-ready'); }
      root.classList.remove('cursor-out');

      const el = e.target instanceof Element ? e.target.closest(interactiveSel) : null;
      root.classList.toggle('cursor-hover', !!el);
    }, { passive: true });

    document.addEventListener('mousedown', () => root.classList.add('cursor-down'));
    document.addEventListener('mouseup', () => root.classList.remove('cursor-down'));
    document.addEventListener('mouseleave', () => root.classList.add('cursor-out'));
    document.addEventListener('mouseenter', () => root.classList.remove('cursor-out'));

    const follow = () => {
      ax += (mx - ax) * 0.16;
      ay += (my - ay) * 0.16;
      aura.style.transform = `translate(${ax}px, ${ay}px)`;
      requestAnimationFrame(follow);
    };
    requestAnimationFrame(follow);
  }

});
