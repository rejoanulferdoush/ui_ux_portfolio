/* ============================================================
   DCIM — Data Center Infrastructure Monitoring · case study
   "Five machines. Five logins. One screen." Runs after script.js.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = (id) => document.getElementById(id);

  /* ---------- section spy -> busbar rail ---------- */
  const beats = Array.from(document.querySelectorAll('.beat'));
  const railLinks = Array.from(document.querySelectorAll('.dc-rail a'));
  const beatSpy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      railLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  beats.forEach((b) => beatSpy.observe(b));

  /* ---------- exhibit 01: the renewal invoice ---------- */
  const range = q('dcCostRange');
  if (range) {
    const nOut = q('dcCostN');
    const l1 = q('dcCostL1'), l2 = q('dcCostL2'), l3 = q('dcCostL3');
    const total = q('dcCostTotal'), bar = q('dcCostBar'), proj3 = q('dcCostProj3');
    const PER = 38, MAX = 1600 * PER;
    const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
    const update = () => {
      const v = +range.value;
      const power = Math.round(v * 0.54);
      const cooling = Math.round(v * 0.16);
      const env = Math.max(0, v - power - cooling);
      nOut.textContent = v + ' points';
      l1.textContent = `${power} × $${PER} · ${money(power * PER)}`;
      l2.textContent = `${cooling} × $${PER} · ${money(cooling * PER)}`;
      l3.textContent = `${env} × $${PER} · ${money(env * PER)}`;
      const yr = v * PER;
      total.textContent = money(yr);
      bar.style.width = Math.min(100, (yr / MAX) * 100) + '%';
      proj3.textContent = money(yr * 3);
    };
    range.addEventListener('input', update);
    update();
  }

  /* ---------- exhibit 02: five consoles collapse into one ---------- */
  const consoles = q('dcConsoles');
  if (consoles && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => consoles.classList.add('is-merged'), reduceMotion ? 0 : 650);
          spy.disconnect();
        }
      });
    }, { threshold: 0.5 });
    spy.observe(consoles);
    /* let a hover un-merge so the point can be re-read */
    consoles.addEventListener('mouseenter', () => consoles.classList.remove('is-merged'));
    consoles.addEventListener('mouseleave', () => consoles.classList.add('is-merged'));
  }

  /* ---------- the power chain simulator ---------- */
  const chain = q('dcChain');
  if (chain) {
    const svg = q('chainSvg');
    const nodes = Array.from(svg.querySelectorAll('.chain-node'));
    const links = Array.from(svg.querySelectorAll('.chain__links line'));
    const btns = Array.from(chain.querySelectorAll('.chain__btns button'));
    const readout = q('chainReadout');
    const head = q('chainHead');
    const R = { source: q('chainSource'), ups: q('chainUps'), xfer: q('chainXfer'), racks: q('chainRacks') };
    const note = q('chainNote');
    const NODE_S = {
      grid: q('cnGrid'), gen: q('cnGen'), ats: q('cnAts'),
      ups: q('cnUps'), pdu: q('cnPdu'), rack: q('cnRack'), pac: q('cnPac')
    };
    let timers = [];
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

    const setNode = (name, cls, sub) => {
      const el = nodes.find((n) => n.dataset.node === name);
      el.classList.remove('is-ok', 'is-live', 'is-gen', 'is-warn', 'is-crit', 'is-cool');
      if (cls) cls.split(' ').forEach((c) => el.classList.add(c));
      if (sub != null && NODE_S[name]) NODE_S[name].textContent = sub;
    };
    const setLink = (id, cls) => {
      const el = links.find((l) => l.dataset.link === id);
      el.classList.remove('is-hot', 'is-gen', 'is-dead', 'is-cool');
      if (cls) el.classList.add(cls);
    };

    const SCENES = {
      reset: () => {
        setNode('grid', 'is-live', '415 V · live');
        setNode('gen', 'is-ok', 'standby');
        setNode('ats', 'is-ok', 'on GRID');
        setNode('ups', 'is-ok', 'double-conv');
        setNode('pdu', 'is-ok', '44% load');
        setNode('rack', 'is-cool', '318 protected');
        setNode('pac', 'is-cool', '18.0°C hold');
        setLink('grid-ats', 'is-hot'); setLink('gen-ats', 'is-dead');
        setLink('ats-ups', 'is-hot'); setLink('ups-pdu', 'is-hot');
        setLink('pdu-rack', 'is-hot'); setLink('ups-pac', 'is-cool');
        readout.dataset.state = 'ok';
        head.textContent = 'Utility feeding the whole load';
        R.source.textContent = 'Grid · 415 V';
        R.ups.textContent = 'Double conversion · 100% batt';
        R.xfer.textContent = '—';
        R.racks.textContent = 'Protected';
        note.textContent = 'Everything nominal. Inject a fault below and watch the path react.';
      },

      mains: () => {
        /* phase 1 — grid drops, UPS instantly carries */
        setNode('grid', 'is-crit', '0 V · lost');
        setLink('grid-ats', 'is-dead');
        setNode('ats', 'is-warn', 'no source');
        setNode('ups', 'is-live', 'ON BATTERY');
        setLink('ats-ups', 'is-dead');
        readout.dataset.state = 'batt';
        head.textContent = 'Grid lost — UPS carrying the load';
        R.source.textContent = 'Battery · discharging';
        R.ups.textContent = 'On battery · 100% → falling';
        R.xfer.textContent = 'GEN starting…';
        R.racks.textContent = 'Protected · zero drop';
        note.textContent = '00:00 — utility gone. Racks never saw it: the UPS took the load in <2 ms. Generator is cranking.';
        /* phase 2 — generator online, ATS transfers */
        timers.push(setTimeout(() => {
          setNode('gen', 'is-gen', 'running · 400 V');
          setLink('gen-ats', 'is-gen');
          setNode('ats', 'is-gen', 'on GEN');
          setLink('ats-ups', 'is-hot');
          setNode('ups', 'is-ok', 'double-conv');
          readout.dataset.state = 'gen';
          head.textContent = 'On generator — utility lost';
          R.source.textContent = 'Generator · 400 V';
          R.ups.textContent = 'Back to double conversion · 98% batt';
          R.xfer.textContent = 'ATS → GEN in 180 ms';
          R.racks.textContent = 'Protected · no drop';
          note.textContent = '00:11 — generator up to speed, ATS transferred in 180 ms, UPS back to charging. The room never noticed.';
        }, reduceMotion ? 0 : 2100));
      },

      ups: () => {
        setNode('ups', 'is-warn', '2/3 phase · N');
        setNode('pdu', 'is-ok', '44% load');
        readout.dataset.state = 'batt';
        head.textContent = 'UPS on reduced redundancy';
        R.source.textContent = 'Grid · 415 V';
        R.ups.textContent = 'One module lost · N+1 → N';
        R.xfer.textContent = 'Static bypass armed';
        R.racks.textContent = 'Protected · redundancy reduced';
        note.textContent = 'Load still clean, but the spare module is gone. Static bypass is armed as a fallback and the alarm is raised — not a drop, but a call to make tonight.';
      },

      gen: () => {
        /* grid gone AND generator fails to start — UPS is the only thing left */
        setNode('grid', 'is-crit', '0 V · lost');
        setLink('grid-ats', 'is-dead');
        setNode('gen', 'is-crit', 'START FAILED');
        setLink('gen-ats', 'is-dead');
        setNode('ats', 'is-crit', 'no source');
        setLink('ats-ups', 'is-dead');
        setNode('ups', 'is-live', 'ON BATTERY');
        setNode('rack', 'is-cool', '318 · on batt');
        readout.dataset.state = 'crit';
        head.textContent = 'Running on UPS battery only';
        R.source.textContent = 'Battery · ~54 min';
        R.ups.textContent = 'Discharging · 92% → falling';
        R.xfer.textContent = 'GEN start FAILED — retrying';
        R.racks.textContent = 'Protected — 54 min to act';
        note.textContent = 'The one that matters: grid down, generator won’t catch. DCIM puts the runtime clock front and centre — 54 minutes — and pages the on-call before the racks ever feel it.';
        if (!reduceMotion) {
          let mins = 54;
          const tick = () => {
            mins -= 1;
            if (mins < 40) return;
            R.source.textContent = `Battery · ~${mins} min`;
            R.racks.textContent = `Protected — ${mins} min to act`;
            timers.push(setTimeout(tick, 1400));
          };
          timers.push(setTimeout(tick, 1400));
        }
      }
    };

    const run = (fault) => {
      clearTimers();
      btns.forEach((x) => x.classList.toggle('is-on', x.dataset.fault === fault && fault !== 'reset'));
      (SCENES[fault] || SCENES.reset)();
    };
    btns.forEach((b) => b.addEventListener('click', () => run(b.dataset.fault)));
    SCENES.reset();
  }

  /* ---------- every box, one shape (device-class tabs) ---------- */
  const shape = q('dcShape');
  if (shape) {
    const tabs = Array.from(shape.querySelectorAll('.shape__tab'));
    const img = q('shapeImg');
    const shot = q('shapeShot');
    const tag = q('shapeTag'), title = q('shapeTitle'), desc = q('shapeDesc');
    const points = q('shapePoints');
    const strip = q('shapeStrip');
    const enc = (p) => p.replace(/&/g, '%26');
    const DATA = {
      ats: {
        tag: 'Transfer switch', title: 'ATS — APC AP7724',
        thumb: 'projects/dcim_system/thumbs/ATS1_Detail_Screen.webp',
        full: 'projects/dcim_system/ATS1_Detail_Screen.webp',
        cap: 'ATS-1 Overview — source status, transfer state, thresholds, electrical measurements, event log',
        desc: 'Source A and source B, the selected feed, phase sync, redundancy health and the overload ladder — then the same Alarms and Report tabs every other device has.',
        points: [
          'Two sources, one verdict: <b>Fully Redundant</b> or not.',
          'Transfer history in the event log, timestamped.',
          'Per-bank overload thresholds, reset to default in one tap.'
        ],
        strip: [
          ['ATS1_Screen/Alarms_Screen', 'ATS-1 — Alarms / Events / Log, filtered by severity', 'Alarms'],
          ['ATS1_Screen/Report&Export_Screen', 'ATS-1 — Report & Export, the same six report types', 'Report'],
          ['ATS1_Overview_Screen_GRID', 'ATS fleet — grid view, every transfer switch', 'Fleet']
        ]
      },
      ups: {
        tag: 'Uninterruptible power', title: 'UPS — APC Symmetra PX',
        thumb: 'projects/dcim_system/thumbs/UPS1_Detail_Screen.webp',
        full: 'projects/dcim_system/UPS1_Detail_Screen.webp',
        cap: 'UPS-01 Overview — load & headroom, battery health, live power-flow & operating mode, battery strings',
        desc: 'Load against capacity, available headroom, battery state of charge and health, the live power path through rectifier and inverter, and every string broken out — on the same three tabs.',
        points: [
          'Runtime remaining leads, in minutes, not a percentage.',
          'Each battery string flagged Good / Aging on its own.',
          'Self-test history and next scheduled test in view.'
        ],
        strip: [
          ['UPS1_Detail_Screen/Alarms_Screen', 'UPS-01 — Alarms / Events / Log', 'Alarms'],
          ['UPS1_Detail_Screen/Report&Export_Screen', 'UPS-01 — Report & Export', 'Report'],
          ['UPS_Overview_Screen-GRID', 'UPS fleet — grid view', 'Fleet']
        ]
      },
      pac: {
        tag: 'Precision cooling', title: 'PAC — Uniflair AM LE',
        thumb: 'projects/dcim_system/thumbs/PAC1_Detail_Screen.webp',
        full: 'projects/dcim_system/PAC1_Detail_Screen.webp',
        cap: 'PAC-1 Overview — room temp/humidity, compressor status, operating modes, refrigeration circuit, runtime & service',
        desc: 'Room temperature and humidity, per-compressor run hours, the operating-mode stack, the whole refrigeration circuit down to superheat and EXV steps, plus maintenance countdowns — three tabs, same order.',
        points: [
          'Setpoint and thresholds separated from live readings.',
          'Compressor run hours per unit, so wear is visible.',
          'Next-service date computed from work hours, not a guess.'
        ],
        strip: [
          ['PAC1_Screen/Alarms_Screen', 'PAC-1 — Alarms / Events / Log', 'Alarms'],
          ['PAC1_Screen/Report&Export_Screen', 'PAC-1 — Report & Export', 'Report'],
          ['PAC_Overview_Screen-GRID', 'PAC fleet — grid view', 'Fleet']
        ]
      },
      pdu: {
        tag: 'Rack power distribution', title: 'Rack PDU — APC NMC',
        thumb: 'projects/dcim_system/thumbs/RACKPDU_Detail_Screen.webp',
        full: 'projects/dcim_system/RACKPDU_Detail_Screen.webp',
        cap: 'Rack PDU Fleet — load distribution by rack, top consumers first, per-unit load and power',
        desc: '200 rack PDUs, the fleet donut, load distribution ranked by rack, and each unit as a card with load, power and position — then drill into one for the same Overview / Alarms / Report tabs.',
        points: [
          'Top-loaded racks surface first, not alphabetically.',
          'Fleet average, highest and lowest called out.',
          'Per-outlet detail one tap from the unit card.'
        ],
        strip: [
          ['RACKPDU/Alarms_Screen', 'Rack PDU — Alarms / Events / Log', 'Alarms'],
          ['RACKPDU/Report&Export_Screen', 'Rack PDU — Report & Export', 'Report'],
          ['RACKPDU_Overview_Screen-LIST', 'Rack PDU fleet — list view', 'Fleet']
        ]
      },
      netbotz: {
        tag: 'Environment monitor', title: 'NetBotz — APC 450',
        thumb: 'projects/dcim_system/thumbs/NETBOTZ_Detail_Screen.webp',
        full: 'projects/dcim_system/NETBOTZ_Detail_Screen.webp',
        cap: 'NetBotz-1 Overview — temp, humidity, dew point, smoke & leak sensors, thresholds, sensor ports, polling health',
        desc: 'Temperature, humidity and dew point, the safety-sensor status board (leak rope, smoke, beacon), threshold and alert limits, sensor-port map and polling health — the same page shape as a UPS or a PDU.',
        points: [
          'Safety sensors get their own status board, not a footnote.',
          'Every threshold editable, with a critical band above the warning.',
          'Poll success rate and data freshness shown as health.'
        ],
        strip: [
          ['NETBOTZ/Alarms_Screen', 'NetBotz — Alarms / Events / Log', 'Alarms'],
          ['NETBOTZ/Report&Export_Screen', 'NetBotz — Report & Export', 'Report'],
          ['NETBOTZ_Overview_Screen-LIST', 'NetBotz fleet — list view', 'Fleet']
        ]
      }
    };
    const pick = (key) => {
      const d = DATA[key];
      if (!d) return;
      img.src = d.thumb;
      shot.dataset.full = d.full;
      shot.dataset.cap = d.cap;
      img.alt = d.title + ' device page in DCIM';
      tag.textContent = d.tag;
      title.textContent = d.title;
      desc.textContent = d.desc;
      points.innerHTML = d.points.map((p) => `<li>${p}</li>`).join('');
      strip.innerHTML = d.strip.map(([f, cap, label]) =>
        `<figure class="noc-shot" data-full="projects/dcim_system/${enc(f)}.webp" data-cap="${cap.replace(/&/g, '&amp;')}">` +
        `<img src="projects/dcim_system/thumbs/${enc(f)}.webp" alt="${label}" decoding="async" loading="lazy">` +
        `<figcaption>${label}</figcaption></figure>`
      ).join('');
      if (window.__dcRebindShots) window.__dcRebindShots();
    };
    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabs.forEach((b) => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
        pick(btn.dataset.dev);
      });
    });
  }

  /* ---------- board filter ---------- */
  const filters = q('boardFilters');
  const grid = q('boardGrid');
  if (filters && grid) {
    const btns = Array.from(filters.querySelectorAll('.board__filter'));
    const items = Array.from(grid.querySelectorAll('.noc-shot'));
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.toggle('is-on', b === btn));
        const f = btn.dataset.f;
        items.forEach((it) => it.classList.toggle('is-hidden', f !== 'all' && !(' ' + it.dataset.cat + ' ').includes(' ' + f + ' ')));
      });
    });
  }

  /* ---------- lightbox (zoom + pan) — shared behaviour ---------- */
  const lb = q('nocLb');
  const lbImg = q('nocLbImg');
  const lbCap = q('nocLbCap');
  const getShots = () => Array.from(document.querySelectorAll('.noc-shot[data-full]'));

  if (lb && lbImg) {
    let idx = 0, lastFocus = null;
    const ZOOM_MIN = 1, DBL_ZOOM = 2.6;
    let scale = 1, tx = 0, ty = 0, baseW = 0, baseH = 0, maxScale = 5;
    let panning = false, panMoved = 0, sx = 0, sy = 0, sTx = 0, sTy = 0;
    let shots = getShots();

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
      const bw = baseW * scale, bh = baseH * scale;
      const ex = Math.max(0, (bw - window.innerWidth) / 2 + 40);
      const ey = Math.max(0, (bh - window.innerHeight) / 2 + 40);
      tx = Math.max(-ex, Math.min(ex, tx));
      ty = Math.max(-ey, Math.min(ey, ty));
    };
    const apply = () => {
      if (scale <= ZOOM_MIN) { scale = ZOOM_MIN; tx = 0; ty = 0; } else clampPan();
      /* width/height drive the zoom so the browser resamples the full-res
         source; transform only carries the pan offset */
      if (baseW) { lbImg.style.width = (baseW * scale) + 'px'; lbImg.style.height = (baseH * scale) + 'px'; }
      lbImg.style.transform = `translate(${tx}px, ${ty}px)`;
      lb.classList.toggle('is-zoomed', scale > ZOOM_MIN);
      lb.classList.toggle('is-panning', panning);
    };
    const resetZoom = () => { scale = 1; tx = 0; ty = 0; panning = false; apply(); };
    const zoomTo = (next, cx, cy) => {
      next = Math.max(ZOOM_MIN, Math.min(maxScale, next));
      const f = next / scale;
      tx = cx - (cx - tx) * f; ty = cy - (cy - ty) * f;
      scale = next; apply();
    };
    const show = (i) => {
      shots = getShots().filter((s) => !s.classList.contains('is-hidden'));
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
    const open = (shotEl) => {
      shots = getShots().filter((s) => !s.classList.contains('is-hidden'));
      const i = shots.indexOf(shotEl);
      lastFocus = document.activeElement;
      show(i < 0 ? 0 : i);
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      q('nocLbClose').focus();
    };
    const close = () => {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      resetZoom();
      setTimeout(() => { if (!lb.classList.contains('is-open')) lbImg.src = ''; }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    const bindShots = () => {
      getShots().forEach((shot) => {
        if (shot.dataset.lbBound) return;
        shot.dataset.lbBound = '1';
        shot.setAttribute('role', 'button');
        shot.setAttribute('tabindex', '0');
        shot.addEventListener('click', () => open(shot));
        shot.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(shot); } });
      });
    };
    window.__dcRebindShots = bindShots;
    bindShots();

    q('nocLbClose').addEventListener('click', close);
    q('nocLbPrev').addEventListener('click', () => show(idx - 1));
    q('nocLbNext').addEventListener('click', () => show(idx + 1));
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
    lb.addEventListener('wheel', (e) => {
      if (!lb.classList.contains('is-open')) return;
      e.preventDefault();
      const cx = e.clientX - window.innerWidth / 2, cy = e.clientY - window.innerHeight / 2;
      zoomTo(scale * (e.deltaY < 0 ? 1.18 : 1 / 1.18), cx, cy);
    }, { passive: false });
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
      tx = sTx + (e.clientX - sx); ty = sTy + (e.clientY - sy);
      apply();
    });
    const endPan = () => { if (panning) { panning = false; apply(); } };
    lbImg.addEventListener('pointerup', endPan);
    lbImg.addEventListener('pointercancel', endPan);
    lbImg.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panMoved > 6) { panMoved = 0; return; }
      if (scale > ZOOM_MIN) resetZoom();
      else zoomTo(DBL_ZOOM, e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2);
    });
    window.addEventListener('resize', () => { fitImg(); apply(); });
  }

  /* ---------- drag-to-scrub strips ---------- */
  document.querySelectorAll('.noc-strip, .shape__strip').forEach((strip) => {
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
      if (!dragging && moved > 8) { dragging = true; strip.classList.add('is-dragging'); strip.setPointerCapture?.(pid); }
      if (dragging) strip.scrollLeft = startScroll - dx;
    });
    const up = () => { down = false; dragging = false; strip.classList.remove('is-dragging'); };
    strip.addEventListener('pointerup', up);
    strip.addEventListener('pointercancel', up);
    strip.addEventListener('lostpointercapture', up);
    strip.addEventListener('click', (e) => { if (moved > 8) { e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
  });

  /* ---------- commissioning ledger: line printer ---------- */
  const ledger = q('dcLedger');
  if (ledger) {
    const rows = Array.from(ledger.querySelectorAll('[data-row]'));
    const led = ledger.querySelector('.ledger__led b');
    const finish = () => { ledger.classList.add('is-done'); if (led) led.textContent = 'filed'; };
    const run = () => {
      if (reduceMotion) { rows.forEach((r) => r.classList.add('is-in')); finish(); return; }
      let i = 0;
      const step = () => {
        if (i > 0) rows[i - 1].classList.remove('is-printing');
        if (i >= rows.length) { setTimeout(finish, 260); return; }
        rows[i].classList.add('is-in', 'is-printing');
        i += 1;
        setTimeout(step, 240 + Math.random() * 120);
      };
      step();
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((ents, obs) => {
        ents.forEach((en) => { if (en.isIntersecting) { obs.disconnect(); run(); } });
      }, { threshold: 0.3 });
      io.observe(ledger);
    } else { run(); }
  }

});
