/* ============================================================
   Prime Bank — Digital Token · case study interactions
   Runs after script.js (shared preloader / nav / reveal / cursor).
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Split-flap helper ---------- */
  const buildFlap = (el) => {
    const text = (el.dataset.flap || el.textContent || '').trim();
    el.textContent = '';
    el._chars = [];
    for (const ch of text) {
      const s = document.createElement('span');
      s.className = 'pb-flap__c';
      s.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(s);
      el._chars.push(s);
    }
  };
  const setFlap = (el, val) => {
    const chars = String(val).split('');
    if (!el._chars || el._chars.length !== chars.length) {
      el.dataset.flap = val;
      buildFlap(el);
      return;
    }
    chars.forEach((ch, i) => {
      const s = el._chars[i];
      const disp = ch === ' ' ? ' ' : ch;
      if (s.textContent === disp) return;
      if (reduceMotion) { s.textContent = disp; return; }
      s.classList.remove('is-flip');
      void s.offsetWidth;
      s.classList.add('is-flip');
      setTimeout(() => { s.textContent = disp; }, 190);
    });
  };
  document.querySelectorAll('.pb-flap').forEach(buildFlap);

  /* ---------- Hero board: advance the queue ---------- */
  const board = document.getElementById('pbBoard');
  if (board) {
    const servingEl = board.querySelector('[data-flap="A-045"]');
    const aheadEl = document.getElementById('pbAhead');
    const advBtn = document.getElementById('pbAdvance');
    let serving = 45;
    const YOU = 74;
    const render = () => {
      setFlap(servingEl, 'A-0' + serving);
      const ahead = Math.max(0, YOU - serving);
      aheadEl.textContent = ahead === 0 ? 'now serving your token' : ahead + ' ahead of you';
      if (ahead === 0) { advBtn.disabled = true; advBtn.textContent = "you're up"; }
    };

    // gentle self-advance so the board feels alive; hands over to the
    // visitor once the queue is close, and stops the moment they engage.
    let auto = null;
    const stopAuto = () => { if (auto) { clearInterval(auto); auto = null; } };
    if (!reduceMotion) {
      auto = setInterval(() => {
        if (serving < YOU - 4) { serving += 1; render(); } else { stopAuto(); }
      }, 3000);
    }

    advBtn.addEventListener('click', () => {
      stopAuto();
      if (serving < YOU) { serving += 1 + Math.floor(Math.random() * 3); if (serving > YOU) serving = YOU; render(); }
    });
    render();
  }

  /* ---------- Check-in wizard ---------- */
  const wizard = document.getElementById('pbWizard');
  if (wizard) {
    const steps = Array.from(wizard.querySelectorAll('.pb-wstep'));
    const stepLabel = document.getElementById('pbStepLabel');
    const pct = document.getElementById('pbPct');
    const backBtn = document.getElementById('pbBack');
    const crumbs = document.getElementById('pbCrumbs');
    const ticket = document.getElementById('pbTicket');
    const genBtn = document.getElementById('pbGenerate');

    const pick = { branch: null, eta: 0, visitor: null, service: null };
    let cur = 1;

    const AVG = { Deposit: 4, Loan: 9, 'Foreign Remittance': 8, FDR: 6, 'Account Opening': 11, 'Customer Services': 5 };

    const show = (n) => {
      cur = n;
      wizard.dataset.step = n;
      steps.forEach((s) => s.classList.toggle('is-live', +s.dataset.step === n));
      stepLabel.textContent = `Step ${n} of 4`;
      pct.textContent = `${n * 25}% complete`;
      backBtn.disabled = n === 1;
      const parts = [];
      if (pick.branch) parts.push(`<b>${pick.branch}</b>`);
      if (pick.visitor) parts.push(pick.visitor);
      if (pick.service) parts.push(pick.service);
      crumbs.innerHTML = parts.join(' &middot; ');
    };

    wizard.querySelectorAll('.pb-choices').forEach((group) => {
      const key = group.dataset.group;
      group.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        group.querySelectorAll('button').forEach((b) => b.classList.toggle('is-picked', b === btn));
        if (key === 'branch') { pick.branch = btn.dataset.value; pick.eta = +btn.dataset.eta; }
        else pick[key] = btn.dataset.value;
        setTimeout(() => { if (cur < 4) show(cur + 1); }, 260);
      });
    });

    backBtn.addEventListener('click', () => { if (cur > 1) show(cur - 1); });

    const sparks = () => {
      if (reduceMotion) return;
      for (let i = 0; i < 16; i += 1) {
        const dot = document.createElement('span');
        dot.className = 'pb-spark';
        const a = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
        const d = 60 + Math.random() * 90;
        dot.style.setProperty('--sx', `${Math.cos(a) * d}px`);
        dot.style.setProperty('--sy', `${Math.sin(a) * d}px`);
        dot.style.setProperty('--sd', `${520 + Math.random() * 420}ms`);
        if (i % 2) dot.style.background = 'var(--pb-serve)';
        ticket.appendChild(dot);
        dot.addEventListener('animationend', () => dot.remove());
      }
    };

    genBtn.addEventListener('click', () => {
      if (!pick.branch) { show(1); return; }
      if (!pick.visitor) { show(2); return; }
      if (!pick.service) { show(3); return; }

      const name = (document.getElementById('pbName').value || '').trim();
      const num = 60 + Math.floor(Math.random() * 40);
      const ahead = 3 + Math.floor(Math.random() * 8);
      const per = AVG[pick.service] || 5;
      const eta = ahead * per + Math.round(pick.eta / 2);

      document.getElementById('pbTkBranch').textContent = `${pick.branch} Branch · ${pick.service}`;
      document.getElementById('pbTkAhead').textContent = ahead;
      document.getElementById('pbTkEta').textContent = `~${eta} min`;
      document.getElementById('pbTkName').textContent = name ? `${name} · ${pick.visitor}` : pick.visitor;

      ticket.hidden = false;
      wizard.classList.add('is-done');
      // restart the "print" animation on repeat runs
      ticket.style.animation = 'none';
      void ticket.offsetWidth;
      ticket.style.animation = '';
      const tkNum = document.getElementById('pbTkNum');
      buildFlap(tkNum);
      requestAnimationFrame(() => { setFlap(tkNum, 'A-0' + num); sparks(); });
    });

    document.getElementById('pbReset').addEventListener('click', () => {
      ticket.hidden = true;
      wizard.classList.remove('is-done');
      pick.branch = pick.visitor = pick.service = null;
      pick.eta = 0;
      wizard.querySelectorAll('.pb-choices button').forEach((b) => b.classList.remove('is-picked'));
      const p = document.getElementById('pbPhone'); const nm = document.getElementById('pbName');
      if (p) p.value = ''; if (nm) nm.value = '';
      show(1);
    });

    show(1);
  }

  /* ---------- Design-integrity board: stress-test the rules ---------- */
  const integrity = document.getElementById('pbIntegrity');
  if (integrity) {
    const rows = Array.from(integrity.querySelectorAll('.pb-rulerow'));
    const countEl = document.getElementById('pbIntCount');
    const allBtn = document.getElementById('pbIntAll');

    const sync = () => {
      const held = rows.filter((r) => !r.classList.contains('is-fault')).length;
      countEl.textContent = held;
      integrity.classList.toggle('is-faulted', held < rows.length);
      allBtn.textContent = held === 0 ? 'Reset all' : 'Stress-test all';
    };

    const setFault = (row, on) => {
      row.classList.toggle('is-fault', on);
      const btn = row.querySelector('.pb-rulerow__toggle');
      const status = row.querySelector('.pb-rulerow__status');
      const action = row.querySelector('.pb-rulerow__action');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      status.textContent = status.dataset[on ? 'fault' : 'hold'];
      action.textContent = on ? 'Restore' : 'Stress-test';
      if (on && !reduceMotion) {
        row.classList.remove('is-shake');
        void row.offsetWidth;
        row.classList.add('is-shake');
      }
    };

    rows.forEach((row) => {
      row.querySelector('.pb-rulerow__toggle').addEventListener('click', () => {
        setFault(row, !row.classList.contains('is-fault'));
        sync();
      });
    });

    allBtn.addEventListener('click', () => {
      const anyHeld = rows.some((r) => !r.classList.contains('is-fault'));
      rows.forEach((row, i) => {
        if (reduceMotion) { setFault(row, anyHeld); }
        else setTimeout(() => { setFault(row, anyHeld); sync(); }, i * 90);
      });
      if (reduceMotion) sync();
    });

    sync();
  }

  /* ---------- People-ahead nudge slider ---------- */
  const nudge = document.getElementById('pbNudgeRange');
  if (nudge) {
    const n = document.getElementById('pbNudgeN');
    const state = document.getElementById('pbNudgeState');
    const note = document.getElementById('pbNudgeNote');
    const bands = [
      { max: 0, name: 'Your turn', color: 'var(--pb-serve)',
        note: 'Now serving your token. Walk to the counter shown on your screen — the branch is holding your place for a few minutes.' },
      { max: 2, name: "You're next", color: 'var(--pb-wait)',
        note: 'One or two people to go. Please be inside the branch now so you don’t lose the slot.' },
      { max: 5, name: 'Head over', color: 'var(--pb-wait)',
        note: 'The heads-up SMS just went out. Start making your way to the branch — you’ve got roughly ten minutes.' },
      { max: 99, name: 'Relax', color: 'var(--pb-serve)',
        note: 'Plenty of time. We’ll send the first SMS when three people are ahead of you — until then the app can sit in your pocket.' },
    ];
    const viz = document.getElementById('pbQueueViz');
    const MAX = +nudge.max || 20;
    if (viz) {
      for (let i = 0; i < MAX + 5; i += 1) viz.appendChild(document.createElement('i'));
    }
    const paintViz = (v, band) => {
      if (!viz) return;
      viz.style.setProperty('--qv', band.color);
      Array.from(viz.children).forEach((dot, i) => {
        dot.className = i < v ? 'is-ahead' : i === v ? 'is-you' : 'is-behind';
        if (i === v && v === 0) dot.classList.add('is-turn');
      });
    };

    const update = () => {
      const v = +nudge.value;
      const band = bands.find((b) => v <= b.max);
      n.textContent = v;
      state.textContent = band.name;
      state.style.color = band.color;
      note.textContent = band.note;
      paintViz(v, band);
    };
    nudge.addEventListener('input', update);
    update();
  }

  /* ---------- Trust-screen tabs ---------- */
  const tabs = document.getElementById('pbTabs');
  if (tabs) {
    const btns = Array.from(tabs.querySelectorAll('.pb-tab'));
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => {
          const on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
          const panel = document.getElementById(b.dataset.panel);
          if (panel) { panel.classList.toggle('is-on', on); panel.hidden = !on; }
        });
      });
    });
  }

  /* ---------- White-label toggle ---------- */
  const wl = document.getElementById('pbWL');
  if (wl) {
    const brands = {
      prime: { name: 'Prime Bank', sub: 'Token Management', cta: '+ Create New Token', care: '16207' },
      city: { name: 'City Trust Bank', sub: 'Queue Management', cta: '+ Get a Token', care: '16345' },
    };
    wl.querySelector('.pb-wl__toggle').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const b = btn.dataset.brand;
      if (b === wl.dataset.brand) return;
      wl.dataset.brand = b;
      if (!reduceMotion) {
        wl.classList.add('is-morphing');
        setTimeout(() => wl.classList.remove('is-morphing'), 600);
      }
      wl.querySelectorAll('.pb-wl__toggle button').forEach((x) => x.classList.toggle('is-on', x === btn));
      document.getElementById('pbWLName').textContent = brands[b].name;
      document.getElementById('pbWLSub').textContent = brands[b].sub;
      document.getElementById('pbWLCta').textContent = brands[b].cta;
      document.getElementById('pbWLCare').textContent = brands[b].care;
    });
  }

  /* ---------- Side rail scroll-spy ---------- */
  const rail = document.getElementById('pbRail');
  if (rail) {
    const links = Array.from(rail.querySelectorAll('a'));
    const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach((t) => spy.observe(t));
  }

  /* ---------- Lightbox across every .pb-shot ---------- */
  const lb = document.getElementById('pbLb');
  const lbImg = document.getElementById('pbLbImg');
  const lbCap = document.getElementById('pbLbCap');
  const shots = Array.from(document.querySelectorAll('.pb-shot[data-full]'));

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
      document.getElementById('pbLbClose').focus();
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

    document.getElementById('pbLbClose').addEventListener('click', close);
    document.getElementById('pbLbPrev').addEventListener('click', () => show(idx - 1));
    document.getElementById('pbLbNext').addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- Drag-to-scrub strips ---------- */
  document.querySelectorAll('.pb-proofstrip, .pb-strip, .pb-recut__steps').forEach((strip) => {
    let down = false, dragging = false, startX = 0, startScroll = 0, moved = 0, pid = null;
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
    strip.addEventListener('click', (e) => {
      if (moved > 8) { e.stopPropagation(); e.preventDefault(); moved = 0; }
    }, true);
  });

});
