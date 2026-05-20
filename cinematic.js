// ─────────────────────────────────────────────
//  77scenarios — Cinematic Layer  v1.0
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
  `;
  document.head.appendChild(style);

  // ── INJECT DOM ELEMENTS ─────────────────────
  const canvas    = document.createElement('canvas');
  canvas.id       = 'cin-canvas';
  const scanlines = document.createElement('div');
  scanlines.id    = 'cin-scanlines';

  // Insert right after #t-overlay so z-index stacking stays intact
  const overlay = document.getElementById('t-overlay');
  const ref     = overlay ? overlay.nextSibling : document.body.firstChild;
  document.body.insertBefore(scanlines, ref);
  document.body.insertBefore(canvas,    ref);

  // ── PARTICLE SYSTEM ─────────────────────────
  const ctx = canvas.getContext('2d');
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
  function draw() {
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
    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  draw();
  setTimeout(() => canvas.classList.add('cin-visible'), 500);
  window.addEventListener('resize', () => { resize(); initParticles(); });

})();
