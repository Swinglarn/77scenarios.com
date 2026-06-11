// ─────────────────────────────────────────────
//  77scenarios — Cinematic Layer  v2.0
//  Add one line before </body> on any page:
//  <script src="/cinematic.js" defer></script>
// ─────────────────────────────────────────────
(function () {

  // ── INJECT CSS ──────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #cin-canvas {
      position: fixed; inset: 0; z-index: 0;
      pointer-events: none; opacity: 0;
      transition: opacity 2.5s ease 0.4s;
    }
    #cin-canvas.cin-visible { opacity: 1; }

    #cin-scanlines {
      position: fixed; inset: 0; z-index: 1;
      pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(0,0,0,0.07) 3px,
        rgba(0,0,0,0.07) 4px
      );
      opacity: 0.6;
      animation: cinScanFlicker 11s ease-in-out infinite;
    }
    @keyframes cinScanFlicker {
      0%,100%  { opacity: 0.6; }
      46%      { opacity: 0.6; }
      47%      { opacity: 0.32; }
      48%      { opacity: 0.6; }
      71%      { opacity: 0.6; }
      71.4%    { opacity: 0.2;  }
      71.8%    { opacity: 0.55; }
      72%      { opacity: 0.6;  }
      88%      { opacity: 0.6;  }
      88.3%    { opacity: 0.38; }
      88.6%    { opacity: 0.6;  }
    }

    /* Gold em glow — applies to any h1 em or .splash-title em on the page */
    h1 em, .splash-title em {
      animation: cinEmGlow 3.5s ease-in-out infinite;
    }
    @keyframes cinEmGlow {
      0%, 100% {
        color: var(--gold, #c9a84c);
        text-shadow: none;
      }
      50% {
        color: #e8cc7a;
        text-shadow:
          0 0 20px rgba(201,168,76,0.55),
          0 0 50px rgba(201,168,76,0.25),
          0 0 90px rgba(201,168,76,0.10);
      }
    }

    /* ════════════════════════════════════════════
       CONTRAST & READABILITY — dark mode
       Primary fix: font-weight 300→400 on body copy
       Secondary:   brighten text and muted colours
    ════════════════════════════════════════════ */

    /* Brighten the cream token site-wide */
    :root {
      --cream: #f0ece6 !important;
      --muted: #ccc6be !important;
    }

    /* Body copy — weight is the single biggest lever */
    body {
      font-weight: 400 !important;
      color: #f0ece6 !important;
    }

    /* Every prose-like element gets 400 explicitly */
    p, li, dd, dt, td, th, caption, label, blockquote,
    .prose, .body-text, .section-body, .type-description,
    .pair-body, .char-bio, .about-body, .letter-body,
    .detail-text, .desc-text, .func-desc, .result-desc,
    .scenario-text, .answer-text, .splash-subtitle,
    .page-sub, .updated, .note, .warning-box p, .info-box p,
    .data-list li, .cc-desc, .submit-note, .section-label,
    .pair-eyebrow, .page-eyebrow, .meta-label {
      font-weight: 400 !important;
      color: #f0ece6 !important;
    }

    /* Headings: crisp and fully bright */
    h1, h2, h3, h4, h5, h6 {
      color: #f8f4ee !important;
      font-weight: 300 !important; /* keep Cormorant elegant */
    }

    /* Muted / secondary text: lift it so it's legible */
    .muted, [class*="muted"],
    .meta-item .meta-label,
    .answer-letter, .scenario-scene,
    .breadcrumb a, .breadcrumb span,
    footer, footer a,
    small {
      color: #ccc6be !important;
    }

    /* Nav links — current default is too dim */
    .nav-links a:not([href="/"]):not([href="/es/"]):not([href="/pt/"]) {
      color: #ddd8d0 !important;
    }
    .nav-links a.active {
      color: #f0ece6 !important;
    }

    /* Answer cards — question text must be sharp */
    .answer-text {
      color: #f0ece6 !important;
      font-weight: 400 !important;
    }

    /* Scenario question text */
    .scenario-text, .question-text, #question-text {
      color: #f8f4ee !important;
      font-weight: 400 !important;
    }

    /* Keep gold accents untouched */
    .gold, [style*="color:var(--gold)"],
    .section-label, .page-eyebrow,
    h1 em, h2 em, h3 em {
      /* gold overrides handled separately — don't touch */
    }

    /* ── NAVY & GOLD light mode ── */
    body.light-mode {
      background: #ffffff !important;
      color: #1e2d4a !important;
      --cream: #1e2d4a !important;
      --muted: #4a5568 !important;
    }
    body.light-mode p,
    body.light-mode li,
    body.light-mode dd,
    body.light-mode dt,
    body.light-mode td,
    body.light-mode th,
    body.light-mode blockquote,
    body.light-mode .prose,
    body.light-mode .body-text,
    body.light-mode .section-body,
    body.light-mode .type-description,
    body.light-mode .pair-body,
    body.light-mode .char-bio,
    body.light-mode .about-body,
    body.light-mode .letter-body,
    body.light-mode .detail-text,
    body.light-mode .desc-text,
    body.light-mode .func-desc,
    body.light-mode .result-desc,
    body.light-mode .scenario-text,
    body.light-mode .answer-text,
    body.light-mode .splash-subtitle,
    body.light-mode .page-sub,
    body.light-mode .updated,
    body.light-mode .note,
    body.light-mode .warning-box p,
    body.light-mode .info-box p,
    body.light-mode .data-list li,
    body.light-mode .cc-desc,
    body.light-mode .submit-note {
      color: #1e2d4a !important;
    }
    body.light-mode h1,
    body.light-mode h2,
    body.light-mode h3,
    body.light-mode h4,
    body.light-mode h5,
    body.light-mode h6 {
      color: #1e2d4a !important;
    }
    body.light-mode .muted,
    body.light-mode small,
    body.light-mode footer,
    body.light-mode .breadcrumb span {
      color: #4a5568 !important;
    }
    body.light-mode .nav-links a:not([href="/"]):not([href="/es/"]):not([href="/pt/"]) {
      color: #2d4168 !important;
    }
    body.light-mode .nav-links a.active {
      color: #1e2d4a !important;
    }

    /* Section labels — navy so they're legible and match the palette */
    body.light-mode .section-label,
    body.light-mode [class*="-label"]:not(label),
    body.light-mode .pair-eyebrow,
    body.light-mode .breadcrumb-cur {
      color: #2d4168 !important;
    }
    body.light-mode .section-label::after {
      background: #c8d4e4 !important;
    }

    /* Page eyebrows keep gold-dim — warm accent against white */
    body.light-mode .page-eyebrow,
    body.light-mode [class*="eyebrow"] {
      color: #8a6d2e !important;
    }
    body.light-mode .page-eyebrow::before {
      background: #8a6d2e !important;
    }

    /* Trait pills, badges — navy border and text */
    body.light-mode .trait-pill,
    body.light-mode .type-pill,
    body.light-mode [class*="pill"],
    body.light-mode [class*="-tag"],
    body.light-mode [class*="badge"] {
      color: #2d4168 !important;
      border-color: #c0cad8 !important;
    }

    /* Scenario / question text — deep navy for readability */
    body.light-mode .scenario-text,
    body.light-mode #question-text,
    body.light-mode .question-text {
      color: #1e2d4a !important;
    }

    /* Em glow in light mode — use navy instead of gold glow */
    body.light-mode h1 em,
    body.light-mode .splash-title em {
      animation: cinEmGlowLight 3.5s ease-in-out infinite !important;
    }
    @keyframes cinEmGlowLight {
      0%, 100% { color: #8a6d2e; text-shadow: none; }
      50%       { color: #c9a84c; text-shadow: none; }
    }

    /* Particles invisible in light mode */
    body.light-mode #cin-canvas { opacity: 0 !important; }

    /* Scan lines much more subtle in light mode */
    body.light-mode #cin-scanlines {
      background: repeating-linear-gradient(
        0deg, transparent, transparent 3px,
        rgba(30,45,74,0.02) 3px, rgba(30,45,74,0.02) 4px
      ) !important;
      opacity: 0.4 !important;
    }

    /* ════════════════════════════════════════════
       v2.0 — CINEMATIC UPGRADES
    ════════════════════════════════════════════ */

    /* ── Cross-document view transitions (native crossfade between pages) ── */
    @view-transition { navigation: auto; }
    ::view-transition-old(root),
    ::view-transition-new(root) { animation-duration: 0.25s; }

    /* ── Vignette — depth at the edges, behind content ── */
    #cin-vignette {
      position: fixed; inset: 0; z-index: 0;
      pointer-events: none;
      background: radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,0.38) 100%);
    }
    body.light-mode #cin-vignette { opacity: 0; }

    /* ── Scroll reveal ── */
    .cin-reveal {
      opacity: 0;
      transform: translateY(26px);
      transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1),
                  transform 0.7s cubic-bezier(0.22,1,0.36,1);
    }
    .cin-reveal.cin-in { opacity: 1; transform: none; }

    /* ── Staged splash entrance (test pages, all locales) ── */
    @keyframes cinRise {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cin-stagger > * { animation: cinRise 0.8s cubic-bezier(0.22,1,0.36,1) both; }
    .cin-stagger > *:nth-child(1) { animation-delay: 0.05s; }
    .cin-stagger > *:nth-child(2) { animation-delay: 0.18s; }
    .cin-stagger > *:nth-child(3) { animation-delay: 0.34s; }
    .cin-stagger > *:nth-child(4) { animation-delay: 0.5s; }
    .cin-stagger > *:nth-child(5) { animation-delay: 0.66s; }
    .cin-stagger > *:nth-child(n+6) { animation-delay: 0.78s; }

    /* ── Answer card press feedback ── */
    .answer-card:active { transform: translateX(6px) scale(0.985); }

    /* ── Gold text selection ── */
    ::selection { background: rgba(201,168,76,0.32); color: #fff; }
    body.light-mode ::selection { background: rgba(30,45,74,0.18); color: #1e2d4a; }

    /* ── Branded scrollbar ── */
    html { scrollbar-width: thin; scrollbar-color: #252a30 #0c0e10; }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: #0c0e10; }
    ::-webkit-scrollbar-thumb { background: #252a30; border-radius: 5px; border: 2px solid #0c0e10; }
    ::-webkit-scrollbar-thumb:hover { background: #8a6d2e; }
    html:has(body.light-mode) { scrollbar-color: #c0cad8 #ffffff; }
    html:has(body.light-mode)::-webkit-scrollbar-track { background: #ffffff; }
    html:has(body.light-mode)::-webkit-scrollbar-thumb { background: #c0cad8; border-color: #ffffff; }
    html:has(body.light-mode)::-webkit-scrollbar-thumb:hover { background: #8a6d2e; }

    /* ── Visible keyboard focus, on brand ── */
    a:focus-visible, button:focus-visible, [tabindex]:focus-visible,
    input:focus-visible, select:focus-visible, textarea:focus-visible {
      outline: 2px solid #c9a84c;
      outline-offset: 3px;
      border-radius: 4px;
    }
    body.light-mode a:focus-visible, body.light-mode button:focus-visible,
    body.light-mode [tabindex]:focus-visible, body.light-mode input:focus-visible,
    body.light-mode select:focus-visible, body.light-mode textarea:focus-visible {
      outline-color: #1e2d4a;
    }

    /* ── Reduced motion: stillness, not breakage ── */
    @media (prefers-reduced-motion: reduce) {
      #cin-scanlines { animation: none !important; }
      h1 em, .splash-title em { animation: none !important; }
      .cin-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
      .cin-stagger > * { animation: none !important; }
      ::view-transition-old(root),
      ::view-transition-new(root) { animation: none !important; }
      .glow-1, .glow-2 { animation: none !important; }
    }

  `;
  document.head.appendChild(style);

  // ── INJECT DOM ELEMENTS ─────────────────────
  const canvas    = document.createElement('canvas');
  canvas.id       = 'cin-canvas';
  const scanlines = document.createElement('div');
  scanlines.id    = 'cin-scanlines';
  const vignette  = document.createElement('div');
  vignette.id     = 'cin-vignette';

  // Insert right after #t-overlay so z-index stacking stays intact
  const overlay = document.getElementById('t-overlay');
  const ref     = overlay ? overlay.nextSibling : document.body.firstChild;
  document.body.insertBefore(scanlines, ref);
  document.body.insertBefore(canvas,    ref);
  document.body.insertBefore(vignette,  ref);

  // ── PARTICLE SYSTEM ─────────────────────────
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((W * H) / 9000), 140);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 1.1 + 0.15,
        alpha: Math.random() * 0.45 + 0.08,
        phase: Math.random() * Math.PI * 2,
        freq:  Math.random() * 0.007 + 0.002,
        dx:    (Math.random() - 0.5) * 0.08,
        dy:    (Math.random() - 0.5) * 0.04,
        rC:    Math.floor(195 + Math.random() * 25),
        gC:    Math.floor(155 + Math.random() * 25),
        bC:    Math.floor(60  + Math.random() * 30),
      });
    }
  }

  let t = 0;
  let rafId = null;
  const cinReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function shouldAnimate() {
    return !cinReduced && !document.hidden && !document.body.classList.contains('light-mode');
  }
  function draw() {
    if (!shouldAnimate()) { rafId = null; return; }
    ctx.clearRect(0, 0, W, H);
    t++;
    for (const p of particles) {
      p.x += p.dx; p.y += p.dy;
      if (p.x < -4)  p.x = W + 4;
      if (p.x > W+4) p.x = -4;
      if (p.y < -4)  p.y = H + 4;
      if (p.y > H+4) p.y = -4;
      const pulse = Math.sin(p.phase + t * p.freq) * 0.35 + 0.65;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.rC},${p.gC},${p.bC},${(p.alpha * pulse).toFixed(3)})`;
      ctx.fill();
    }
    rafId = requestAnimationFrame(draw);
  }
  function startDraw() { if (!rafId && shouldAnimate()) { rafId = requestAnimationFrame(draw); } }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) startDraw(); });
  new MutationObserver(() => { if (shouldAnimate()) startDraw(); else if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  resize();
  initParticles();
  startDraw();
  setTimeout(() => canvas.classList.add('cin-visible'), 500);
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { resize(); initParticles(); }, 250); });

})();

// ─────────────────────────────────────────────
//  v2.0 — Scroll reveals, splash stagger, count-up
// ─────────────────────────────────────────────
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── SCROLL REVEAL ───────────────────────────
  // Cards and content blocks below the fold rise in as they enter view.
  // Classes are removed after the reveal so existing hover transitions
  // (transition: all 0.2s on cards) are restored untouched.
  var REVEAL_SEL = [
    '.type-card', '.lcard', '.db-card', '.fncard', '.fn-card', '.vs-pair-card',
    '.type-pair-card', '.famous-card', '.similar-card', '.contact-card',
    '.thread-item', '.rb-block', '.box', '.intro-box', '.growth-box',
    '.opp-block', '.fd-box', '.cta-box', '.callout', '.score-block'
  ].join(',');

  function initReveals() {
    if (reduced || !('IntersectionObserver' in window)) return;
    var batch = 0, lastTime = 0;
    var io = new IntersectionObserver(function (entries) {
      var now = performance.now();
      if (now - lastTime > 200) batch = 0;   // new scroll batch → restart stagger
      lastTime = now;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var delay = Math.min(batch * 70, 280);
        batch++;
        el.style.transitionDelay = delay + 'ms';
        // Force a frame so the transition actually runs
        requestAnimationFrame(function () { el.classList.add('cin-in'); });
        setTimeout(function () {
          el.classList.remove('cin-reveal', 'cin-in');
          el.style.transitionDelay = '';
        }, 800 + delay);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    var seen = [];
    function arm() {
      document.querySelectorAll(REVEAL_SEL).forEach(function (el) {
        if (seen.indexOf(el) !== -1) return;
        seen.push(el);
        if (!el.offsetParent) return;                       // hidden screens: leave alone
        var r = el.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.92) return;     // above the fold: leave alone
        el.classList.add('cin-reveal');
        io.observe(el);
      });
    }
    arm();
    setTimeout(arm, 700);  // catch late-injected content
  }

  // ── SPLASH STAGGER + COUNT-UP ───────────────
  // Applies on the test homepage in every locale automatically.
  function initSplash() {
    var splash = document.getElementById('screen-splash');
    if (!splash || !splash.classList.contains('active') || reduced) return;
    splash.classList.add('cin-stagger');

    splash.querySelectorAll('.meta-num').forEach(function (el) {
      var m = (el.textContent || '').trim().match(/^([~≈]?)(\d+)$/);
      if (!m) return;
      var prefix = m[1], target = parseInt(m[2], 10);
      var start = null, DUR = 1100;
      function tick(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / DUR, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target;
      }
      setTimeout(function () { requestAnimationFrame(tick); }, 450);
    });
  }

  function boot() { initReveals(); initSplash(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
