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

  /* Header scroll state: only the pinned actions (résumé + burger) react */
  const headerActions = document.querySelector('.header__actions');
  const onScroll = () => headerActions.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Hero: portrait tilts toward the cursor. The title words and supporting
     lines are locked around the avatar by CSS, so nothing moves on scroll. */
  const hero = document.querySelector('.hero');
  const heroPortraitWrap = document.getElementById('heroPortraitWrap');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  const closeNav = () => {
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navBackdrop.classList.remove('is-open');
  };
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');
    navBackdrop.classList.toggle('is-open');
  });
  navBackdrop.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

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

  /* Contact: "catch me" email reveal.
     The real address never sits in the page source — it's assembled here on the
     fly, only once the button has been "caught". Doubles as a small anti-scraping
     measure and a bit of personality instead of a flat mailto link. */
  const emailGame = document.getElementById('emailGame');
  const emailBtn = document.getElementById('emailRevealBtn');
  if (emailGame && emailBtn) {
    const email = ['rejoanulferdoush', 'gmail.com'].join('@');
    const dodgeMessages = ['Nice try!', 'Almost!', 'So close!'];
    const maxDodges = 2;
    let dodges = 0;

    const placeRandomly = () => {
      const bounds = emailGame.getBoundingClientRect();
      const btnRect = emailBtn.getBoundingClientRect();
      const maxX = Math.max(bounds.width - btnRect.width, 0);
      const maxY = Math.max(bounds.height - btnRect.height, 0);
      emailBtn.style.transform = `translate(${Math.random() * maxX}px, ${Math.random() * maxY}px)`;
    };
    const centerButton = () => {
      const bounds = emailGame.getBoundingClientRect();
      const btnRect = emailBtn.getBoundingClientRect();
      emailBtn.style.transform = `translate(${(bounds.width - btnRect.width) / 2}px, ${(bounds.height - btnRect.height) / 2}px)`;
    };
    centerButton();

    const revealEmail = () => {
      emailGame.innerHTML = '';
      const link = document.createElement('a');
      link.href = `mailto:${email}`;
      link.className = 'contact__email';
      link.textContent = email;
      emailGame.appendChild(link);
      const hint = document.querySelector('.contact__email-hint');
      if (hint) hint.textContent = 'Got it — say hello!';
    };

    emailBtn.addEventListener('click', () => {
      dodges += 1;
      if (dodges > maxDodges) { revealEmail(); return; }
      emailBtn.innerHTML = `<i class='bx bxs-envelope'></i> ${dodgeMessages[(dodges - 1) % dodgeMessages.length]}`;
      placeRandomly();
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

});
