/* ============================================================================
   protect.js — keyboard + selection policy for the portfolio
   ----------------------------------------------------------------------------
   On a normal page (nothing open) the ONLY things the keyboard can do are:
     • Arrow keys / PageUp / PageDown / Home / End / Space  → glide the page
     • Ctrl/Cmd + C                                         → copy
     • Tab / Shift+Tab / Enter / Escape                     → focus & dismiss
   Every other key outside a text field is swallowed.

   Text selection is off everywhere EXCEPT the few things worth copying:
     • the name  • the contact email + phone  • work-experience company names
     • the chat assistant's replies  • real form fields (the chat box)

   While a lightbox, the intro-video modal or the mobile menu is open, this
   file gets out of the way completely so those components keep their own
   keys (Esc to close, ← → to move, + − 0 to zoom).

   Also: no right-click menu, no image drag-out, page prints blank.
   NOTE: a website still cannot block OS screenshot tools or screen recorders —
   nothing here changes that.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- selection whitelist ---------- */
  var SELECTABLE = [
    'input', 'textarea', '[contenteditable="true"]', '[contenteditable=""]',
    '.hero__intro--who',              // "Hi, I'm Rejoanul Ferdoush"
    '.logo__name', '.footer__name',   // name in header / footer
    '.experience-item__meta span',    // company names in Experience
    '.contact__email', '.contact__phone',
    '.rf-msg__bubble', '.rf-msg__bubble *'  // assistant replies (email/phone live here too)
  ].join(',');

  var css = [
    'html,body{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;',
    'user-select:none;-webkit-touch-callout:none;}',
    SELECTABLE + '{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;',
    'user-select:text;-webkit-touch-callout:default;}',
    'img,svg,video,canvas,picture{-webkit-user-drag:none;-khtml-user-drag:none;',
    '-moz-user-drag:none;-o-user-drag:none;user-drag:none;}',
    '@media print{html{display:none !important;}}'
  ].join('');
  var style = document.createElement('style');
  style.setAttribute('data-protect', '');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  /* ---------- helpers ---------- */
  function inField(el) {
    if (!el) return false;
    var tag = (el.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || el.isContentEditable;
  }

  function isInteractive(el) {
    if (!el) return false;
    if (/^(a|button|select|summary)$/i.test(el.tagName || '')) return true;
    var r = el.getAttribute && el.getAttribute('role');
    return r === 'button' || r === 'link' || r === 'tab';
  }

  // true while a modal / lightbox / menu owns the screen (scroll is locked)
  function scrollLocked() {
    var de = document.documentElement;
    if (de.classList.contains('nav-open')) return true;
    try {
      if (getComputedStyle(de).overflowY === 'hidden') return true;
      if (getComputedStyle(document.body).overflowY === 'hidden') return true;
    } catch (err) {}
    return false;
  }

  /* ---------- smooth page scrolling for the nav keys ---------- */
  function scrollBy(delta) {
    var L = window.__lenis;
    if (L && typeof L.scrollTo === 'function') {
      var from = (typeof L.targetScroll === 'number') ? L.targetScroll : window.scrollY;
      L.scrollTo(from + delta, { duration: prefersReduced ? 0 : 0.55 });
    } else {
      window.scrollBy({ top: delta, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  }
  function scrollTo(y) {
    var L = window.__lenis;
    if (L && typeof L.scrollTo === 'function') {
      L.scrollTo(y, { duration: prefersReduced ? 0 : 0.7 });
    } else {
      window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  }

  var NAV_KEYS = {
    ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1,
    PageUp: 1, PageDown: 1, Home: 1, End: 1,
    Tab: 1, Escape: 1, Enter: 1, ' ': 1, Spacebar: 1
  };

  function handleNavKey(e) {
    if (scrollLocked()) return;             // a component owns the keyboard right now
    var k = e.key;
    var vh = window.innerHeight || 800;
    var ae = document.activeElement;
    var delta = null, abs = null;

    switch (k) {
      case 'ArrowDown': delta = 96; break;
      case 'ArrowUp': delta = -96; break;
      case 'PageDown': delta = vh * 0.9; break;
      case 'PageUp': delta = -vh * 0.9; break;
      case 'Home': abs = 0; break;
      case 'End': abs = document.documentElement.scrollHeight; break;
      case ' ':
      case 'Spacebar':
        if (inField(ae) || isInteractive(ae)) return;   // let Space click / type
        delta = e.shiftKey ? -vh * 0.9 : vh * 0.9;
        break;
      default:
        // Tab / Escape / Enter / ArrowLeft / ArrowRight — let them through untouched
        return;
    }
    e.preventDefault();
    if (abs !== null) scrollTo(abs); else scrollBy(delta);
  }

  /* ---------- the keyboard gate ---------- */
  document.addEventListener('keydown', function (e) {
    if (inField(e.target)) return;                       // full typing in form fields

    var k = e.key;
    var mod = e.ctrlKey || e.metaKey;

    // Ctrl/Cmd+C — copy (selection is already limited to the whitelist)
    if (mod && !e.altKey && !e.shiftKey && (k === 'c' || k === 'C')) return;

    // pure navigation / focus / activation keys
    if (!mod && !e.altKey && NAV_KEYS[k]) {
      handleNavKey(e);
      return;
    }

    // when a lightbox / modal is open, let it have every other key too
    if (scrollLocked()) return;

    // everything else on a normal page: blocked
    e.preventDefault();
    e.stopPropagation();
  }, true);

  /* ---------- right-click + drag ---------- */
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, true);
  document.addEventListener('dragstart', function (e) { e.preventDefault(); }, true);
})();
