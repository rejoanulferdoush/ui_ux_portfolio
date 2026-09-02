/* ============================================================
   NMS — Network Monitoring System · case study
   "One night on the NOC floor." Runs after script.js.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = (id) => document.getElementById(id);
  const noc = document.querySelector('.noc');

  /* ---------- section state -> alarm colour + rail ---------- */
  const beats = Array.from(document.querySelectorAll('.beat'));
  const railLinks = Array.from(document.querySelectorAll('.noc-rail a'));

  const setActive = (beat) => {
    const state = beat.dataset.state || 'ok';
    if (noc) noc.dataset.alarm = state;

    const id = '#' + beat.id;
    railLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
  };

  const beatSpy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  beats.forEach((b) => beatSpy.observe(b));

  /* ---------- briefing · exhibit A: the renewal invoice ---------- */
  const briefRange = q('briefRange');
  if (briefRange) {
    const nOut = q('briefN');
    const l1 = q('briefL1'), l2 = q('briefL2'), l3 = q('briefL3');
    const total = q('briefFigSaas');
    const barSaas = q('briefBarSaas');
    const proj3 = q('briefProj3');
    const PER = 42, MAX = 600 * PER;
    const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
    const update = () => {
      const v = +briefRange.value;
      const ports = Math.round(v * 0.62);
      const sensors = Math.round(v * 0.28);
      const tunnels = Math.max(0, v - ports - sensors);
      nOut.textContent = v + ' elements';
      l1.textContent = `${ports} × $42 · ${money(ports * PER)}`;
      l2.textContent = `${sensors} × $42 · ${money(sensors * PER)}`;
      l3.textContent = `${tunnels} × $42 · ${money(tunnels * PER)}`;
      const saas = v * PER;
      total.textContent = money(saas);
      barSaas.style.width = Math.min(100, (saas / MAX) * 100) + '%';
      if (proj3) proj3.textContent = money(saas * 3);
    };
    briefRange.addEventListener('input', update);
    update();
  }

  /* ---------- briefing · exhibit B: walk the crossing once, on view ---------- */
  const crossingWrap = document.querySelector('.crossing-wrap');
  if (crossingWrap && !reduceMotion && 'IntersectionObserver' in window) {
    crossingWrap.classList.add('is-armed');
    const walkSpy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          crossingWrap.classList.add('is-walked');
          walkSpy.disconnect();
        }
      });
    }, { threshold: 0.45 });
    walkSpy.observe(crossingWrap);
  }

  /* ---------- incident console (playable triage) ---------- */
  const ic = q('incidentConsole');
  if (ic) {
    const steps = Array.from(ic.querySelectorAll('.ic-step'));
    const icStep = q('icStep');
    const icLabel = q('icLabel');
    const term = q('icTerm');
    const pingStats = q('icPingStats');
    const pingNext = q('icPingNext');
    const pingHint = q('icPingHint');
    const LABELS = ['Alert received', 'Device open', 'Reachability check', 'Acknowledged'];
    let cur = 1, pinged = false;
    const startedAt = Date.now();

    const show = (n) => {
      cur = n;
      ic.dataset.step = n;
      steps.forEach((s) => s.classList.toggle('is-live', +s.dataset.step === n));
      icStep.textContent = `Step ${n} / 4`;
      icLabel.textContent = LABELS[n - 1];
      if (n === 3 && !pinged) runPing();
      if (n === 4) {
        const secs = Math.round((Date.now() - startedAt) / 1000);
        const el = q('icAckTime');
        if (el) el.textContent = secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m ${secs % 60}s`;
      }
    };

    const PING_LINES = [
      { t: '$ ping 10.0.1.19', c: '' },
      { t: 'Request timed out', c: 'bad' },
      { t: 'Request timed out', c: 'bad' },
      { t: 'Reply from 10.0.1.19: bytes=32 time=7ms TTL=64', c: '' },
      { t: 'Reply from 10.0.1.19: bytes=32 time=46ms TTL=64', c: '' },
      { t: '--- 4 packets transmitted, 2 received, 50% loss ---', c: 'dim' },
    ];
    const runPing = () => {
      pinged = true;
      term.innerHTML = '';
      pingStats.hidden = true;
      pingHint.textContent = 'Probing…';
      const write = (i) => {
        if (i >= PING_LINES.length) {
          pingStats.hidden = false;
          pingNext.disabled = false;
          pingHint.textContent = 'Two of four replies — it’s flapping, not dead. Acknowledge and watch, don’t roll the truck.';
          return;
        }
        const line = document.createElement('span');
        line.className = 'ic-term__line' + (PING_LINES[i].c ? ' ic-term__line--' + PING_LINES[i].c : '');
        line.textContent = PING_LINES[i].t;
        term.appendChild(line);
        setTimeout(() => write(i + 1), reduceMotion ? 0 : 470);
      };
      write(0);
    };

    ic.querySelectorAll('[data-next]').forEach((btn) => {
      btn.addEventListener('click', () => { if (cur < 4) show(cur + 1); });
    });
    q('icReset').addEventListener('click', () => {
      pinged = false;
      pingNext.disabled = true;
      pingStats.hidden = true;
      term.innerHTML = '<span class="ic-term__line">$ ping 10.0.1.19</span>';
      show(1);
    });
    show(1);
  }

  /* ---------- threshold ladder ---------- */
  const ladder = q('ladder');
  if (ladder) {
    const rungs = Array.from(ladder.querySelectorAll('.ladder__rung'));
    const stateEl = q('ladderState');
    const trigEl = q('ladderTrigger');
    const youEl = q('ladderYou');
    const mapEl = q('ladderMap');
    const DATA = [
      { name: 'Online', state: 'ok',
        trigger: 'Polling succeeds; nothing is out of range.',
        you: 'Nothing — a green dot and a row in the healthy count.',
        map: 'Solid green node, solid green links.' },
      { name: 'Warning', state: 'warn',
        trigger: 'One metric crosses a soft threshold — latency 45ms, CPU 80%.',
        you: 'An amber row in Active Alerts. No siren.',
        map: 'Node turns amber; the link to it turns amber.' },
      { name: 'Degraded', state: 'warn',
        trigger: 'The condition holds, or a second metric slips.',
        you: 'A Degraded badge on the device page; it leaves the “all operational” count.',
        map: 'Node amber with a heavier outline; still reachable.' },
      { name: 'Critical', state: 'crit',
        trigger: 'A hard threshold breaks — ICMP timeout, uptime under 50%.',
        you: 'A red card at the top of the list: cause and device spelled out.',
        map: 'Node pulses red; the link to it dashes red.' },
      { name: 'Offline', state: 'off',
        trigger: 'Five consecutive probes miss over 30 seconds.',
        you: 'The device moves to the Offline count; the alert stays Active until acknowledged.',
        map: 'Node greys out; everything downstream greys with it.' },
    ];
    const pick = (i) => {
      rungs.forEach((r, j) => r.classList.toggle('is-on', j === i));
      const d = DATA[i];
      stateEl.textContent = d.name;
      stateEl.dataset.state = d.state;
      trigEl.textContent = d.trigger;
      youEl.textContent = d.you;
      mapEl.textContent = d.map;
    };
    let cur = 0;
    const show = (i) => { cur = i; pick(i); };

    /* auto-advance through the ladder; hover / focus takes over */
    let timer = null, running = false;
    const STEP = 2200;
    const tick = () => { show((cur + 1) % rungs.length); };
    const play = () => {
      if (running || reduceMotion) return;
      running = true;
      ladder.classList.add('is-auto');
      timer = setInterval(tick, STEP);
    };
    const pause = () => {
      running = false;
      ladder.classList.remove('is-auto');
      if (timer) { clearInterval(timer); timer = null; }
    };

    rungs.forEach((r, i) => {
      r.addEventListener('mouseenter', () => { pause(); show(i); });
      r.addEventListener('click', () => { pause(); show(i); });
      r.addEventListener('focus', () => { pause(); show(i); });
      r.setAttribute('tabindex', '0');
    });
    ladder.addEventListener('mouseleave', play);
    ladder.addEventListener('focusout', (e) => {
      if (!ladder.contains(e.relatedTarget)) play();
    });

    show(0);

    if ('IntersectionObserver' in window && !reduceMotion) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((en) => { en.isIntersecting ? play() : pause(); });
      }, { threshold: 0.4 });
      spy.observe(ladder);
    }
  }

  /* ---------- live map: node inspector + fault injection ---------- */
  const lm = q('liveMap');
  if (lm) {
    const svg = q('lmSvg');
    const nodes = Array.from(svg.querySelectorAll('.lm-node'));
    const links = Array.from(svg.querySelectorAll('.livemap__links line'));
    const d = { name: q('lmDName'), sev: q('lmDSev'), type: q('lmDType'), ip: q('lmDIp'), lat: q('lmDLat'), up: q('lmDUp'), note: q('lmDNote') };
    const banner = q('lmBanner'), bannerText = q('lmBannerText');
    const c = { active: q('lmActive'), warn: q('lmWarn'), crit: q('lmCrit'), off: q('lmOff') };
    const btns = Array.from(lm.querySelectorAll('.livemap__btns button'));

    const KIND = { RTR: 'Router', FW: 'Firewall', SW: 'Switch', SRV: 'Server', PC: 'Workstation' };
    const IPS = { isp: '10.0.0.1', fw: '10.0.1.30', rtr: '10.0.1.19', sw: '10.0.1.25', srv: '10.0.2.10', a1: '10.0.4.1', a2: '10.0.4.2', a3: '10.0.4.3', w1: '192.168.4.11', w2: '192.168.4.12', w3: '192.168.4.13', w4: '192.168.4.14', w5: '10.0.2.22' };
    const SEV_TXT = { ok: 'operational', warn: 'warning · elevated latency', crit: 'critical · needs attention', off: 'offline · unreachable' };
    const LAT = { ok: () => (2 + Math.floor(Math.random() * 12)) + 'ms', warn: () => (40 + Math.floor(Math.random() * 15)) + 'ms', crit: () => (200 + Math.floor(Math.random() * 80)) + 'ms', off: () => '—' };
    const UP = { ok: '99.9%', warn: '98.4%', crit: '45.2%', off: '0%' };

    let state = {}; nodes.forEach((n) => { state[n.dataset.node] = 'ok'; });
    const BASE = { ...state };
    let selected = null;

    const applyState = () => {
      nodes.forEach((n) => {
        const s = state[n.dataset.node];
        n.classList.toggle('is-warn', s === 'warn');
        n.classList.toggle('is-crit', s === 'crit');
        n.classList.toggle('is-off', s === 'off');
      });
      const rank = { ok: 0, warn: 1, crit: 2, off: 3 };
      links.forEach((l) => {
        const [a, b] = l.dataset.link.split('-');
        const sa = state[a] || 'ok', sb = state[b] || 'ok';
        const worse = rank[sa] >= rank[sb] ? sa : sb;
        l.classList.toggle('is-warn', worse === 'warn');
        l.classList.toggle('is-crit', worse === 'crit');
        l.classList.toggle('is-off', worse === 'off');
      });
      const t = { ok: 0, warn: 0, crit: 0, off: 0 };
      Object.values(state).forEach((s) => { t[s] += 1; });
      c.active.textContent = 30 + t.ok;
      c.warn.textContent = 2 + t.warn;
      c.crit.textContent = t.crit;
      c.off.textContent = 4 + t.off;
    };
    const renderDetail = (id) => {
      const s = state[id];
      const el = nodes.find((n) => n.dataset.node === id);
      d.name.textContent = el.querySelector('text').textContent.trim();
      d.sev.textContent = SEV_TXT[s];
      d.sev.dataset.sev = s;
      d.type.textContent = KIND[el.dataset.kind] || 'Device';
      d.ip.textContent = IPS[id] || '—';
      d.lat.textContent = LAT[s]();
      d.up.textContent = UP[s];
      d.note.textContent = s === 'ok'
        ? 'Healthy. Ping and SSH are one tap further — the same panel the operator works from.'
        : s === 'off'
          ? 'No response. Everything downstream of it greys out until it’s back.'
          : 'Flagged on the map and in the alert count. Tap through to the terminal to check it.';
    };
    const select = (n) => {
      nodes.forEach((x) => x.classList.remove('is-selected'));
      n.classList.add('is-selected');
      selected = n.dataset.node;
      renderDetail(selected);
    };
    nodes.forEach((n) => {
      n.setAttribute('tabindex', '0');
      n.setAttribute('role', 'button');
      n.addEventListener('click', () => select(n));
      n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(n); } });
    });
    const setBanner = (text, crit) => {
      if (!text) { banner.hidden = true; return; }
      bannerText.textContent = text;
      banner.classList.toggle('is-crit', !!crit);
      banner.hidden = false;
    };
    const FAULTS = {
      latency: () => { state = { ...BASE, a3: 'warn', w4: 'warn', w5: 'warn' }; setBanner('ACC-SW-A3 — high latency detected (48ms) · 3 devices affected', false); },
      critical: () => { state = { ...BASE, w4: 'crit' }; setBanner('PC-04 — 250ms latency, 45% uptime · CRITICAL', true); },
      offline: () => { state = { ...BASE, rtr: 'off', sw: 'off', srv: 'off', a1: 'off', a2: 'off', a3: 'off', w1: 'off', w2: 'off', w3: 'off', w4: 'off', w5: 'off' }; setBanner('RTR MikroTik uplink lost — branch isolated, 11 devices unreachable', true); },
      reset: () => { state = { ...BASE }; setBanner(null); },
    };
    btns.forEach((b) => {
      b.addEventListener('click', () => {
        const f = b.dataset.fault;
        btns.forEach((x) => x.classList.toggle('is-on', x === b && f !== 'reset'));
        if (f === 'reset') btns.forEach((x) => x.classList.remove('is-on'));
        FAULTS[f]();
        applyState();
        if (selected) renderDetail(selected);
      });
    });
    applyState();
  }

  /* ---------- drawer tabs ---------- */
  const drawer = q('drawer');
  if (drawer) {
    const tabs = Array.from(drawer.querySelectorAll('.drawer__tab'));
    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabs.forEach((b) => {
          const on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
          const panel = q(b.dataset.panel);
          if (panel) { panel.classList.toggle('is-on', on); panel.hidden = !on; }
        });
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
        items.forEach((it) => it.classList.toggle('is-hidden', f !== 'all' && it.dataset.cat !== f));
      });
    });
  }

  /* ---------- lightbox (zoom + pan) — shared behaviour ---------- */
  const lb = q('nocLb');
  const lbImg = q('nocLbImg');
  const lbCap = q('nocLbCap');
  const getShots = () => Array.from(document.querySelectorAll('.noc-shot[data-full]'));
  let shots = getShots();

  if (lb && lbImg && shots.length) {
    let idx = 0, lastFocus = null;
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
    getShots().forEach((shot) => {
      shot.setAttribute('role', 'button');
      shot.setAttribute('tabindex', '0');
      shot.addEventListener('click', () => open(shot));
      shot.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(shot); } });
    });
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
  document.querySelectorAll('.noc-strip').forEach((strip) => {
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

  /* ---------- shift report: tractor-feed line printer ---------- */
  const sr = q('shiftReport');
  if (sr) {
    const rows = Array.from(sr.querySelectorAll('[data-row]'));
    const led = sr.querySelector('.shift-report__led b');
    const finish = () => {
      sr.classList.add('is-done');
      if (led) led.textContent = 'filed';
    };
    const run = () => {
      sr.classList.add('is-live');
      if (reduceMotion) {
        rows.forEach((r) => r.classList.add('is-in'));
        finish();
        return;
      }
      let i = 0;
      const step = () => {
        if (i > 0) rows[i - 1].classList.remove('is-printing');
        if (i >= rows.length) { setTimeout(finish, 260); return; }
        rows[i].classList.add('is-in', 'is-printing');
        i += 1;
        setTimeout(step, 250 + Math.random() * 110);
      };
      step();
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((ents, obs) => {
        ents.forEach((en) => { if (en.isIntersecting) { obs.disconnect(); run(); } });
      }, { threshold: 0.35 });
      io.observe(sr);
    } else {
      run();
    }
  }

});
