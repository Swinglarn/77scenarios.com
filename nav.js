(function() {

  // ── GOOGLE ANALYTICS ────────────────────────────────────────────────────────
  var _gas = document.createElement('script');
  _gas.async = true;
  _gas.src = 'https://www.googletagmanager.com/gtag/js?id=G-C0D86PRJJN';
  document.head.appendChild(_gas);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-C0D86PRJJN');

  // ── CONSTANTS ────────────────────────────────────────────────────────────────
  var SUPA_URL = 'https://rttomfnfyjjssdqfzkaj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dG9tZm5meWpqc3NkcWZ6a2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODcwMjEsImV4cCI6MjA4ODU2MzAyMX0.0qBogK8xywL77IFYj4IywZIhHyKjbvbVmXYvG6wAZGw';
  var FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23252a30'/%3E%3Ccircle cx='40' cy='32' r='14' fill='%238a6d2e'/%3E%3Cellipse cx='40' cy='72' rx='24' ry='16' fill='%238a6d2e'/%3E%3C/svg%3E";
  var MOON_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SUN_SVG  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

  // ── NAV + GLOBAL CSS ─────────────────────────────────────────────────────────
  if (!document.getElementById('nav-design-css')) {
    var ds = document.createElement('style');
    ds.id = 'nav-design-css';
    ds.textContent = [
      // Nav links — DM Sans 500, bolder, mixed case
      '.nav-links a{font-family:"DM Sans",sans-serif !important;font-size:13px !important;font-weight:500 !important;letter-spacing:0.06em !important;text-transform:uppercase !important;color:#b5ada6 !important;transition:color 0.2s !important;}',
      '.nav-links a:hover,.nav-links a.active{color:#ede8df !important;}',
      // "Take the Test" — gold pill CTA via href attribute selector
      '.nav-links a[href="/"]{color:#c9a84c !important;border:1px solid #8a6d2e !important;padding:6px 14px !important;border-radius:60px !important;letter-spacing:0.08em !important;transition:background 0.2s,color 0.2s,border-color 0.2s !important;}',
      '.nav-links a[href="/"]:hover{background:rgba(201,168,76,0.12) !important;border-color:#c9a84c !important;}',
      '.nav-links a[href="/"].active{background:rgba(201,168,76,0.08) !important;}',
      // ES/PT CTA equivalents
      '.nav-links a[href="/es/"]{color:#c9a84c !important;border:1px solid #8a6d2e !important;padding:6px 14px !important;border-radius:60px !important;transition:background 0.2s,color 0.2s,border-color 0.2s !important;}',
      '.nav-links a[href="/pt/"]{color:#c9a84c !important;border:1px solid #8a6d2e !important;padding:6px 14px !important;border-radius:60px !important;transition:background 0.2s,color 0.2s,border-color 0.2s !important;}',
      // Auth dropdown
      '.nav-user-wrap{position:relative;display:inline-block;}',
      '.nav-user-btn{display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;padding:0;}',
      '#nav-user-dropdown{display:none;position:absolute;right:0;top:calc(100% + 8px);background:#13161a;border:1px solid #252a30;border-radius:10px;min-width:160px;z-index:9999;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);}',
      '#nav-user-dropdown a{display:block;padding:12px 18px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#b5ada6;text-decoration:none;border-bottom:1px solid #252a30;}',
      '#nav-user-dropdown a:hover{color:#ede8df;background:rgba(255,255,255,0.04);}',
      '#nav-user-dropdown button{display:block;width:100%;text-align:left;padding:12px 18px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#e07070;background:none;border:none;cursor:pointer;font-family:inherit;}',
      '#nav-user-dropdown button:hover{background:rgba(224,112,112,0.08);}',
      // Theme toggle buttons
      '#theme-toggle-desktop{display:inline-flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;padding:4px 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6358;font-family:"DM Sans",sans-serif;transition:color 0.2s;}',
      '#theme-toggle-desktop:hover{color:#b5ada6;}',
      '@media(max-width:480px){#theme-toggle-desktop{display:none !important;}}',
      '#theme-toggle-mobile{display:none !important;background:none;border:none;cursor:pointer;padding:6px;color:#b5ada6;line-height:1;}',
      '@media(max-width:480px){#theme-toggle-mobile{display:inline-flex !important;align-items:center;justify-content:center;width:36px;height:36px;}}',
      // Footer styles
      '#nav-footer{border-top:1px solid #252a30;padding:48px 32px;text-align:center;background:#0c0e10;}',
      '#nav-footer .footer-tagline{font-size:13px;color:#6b6358;line-height:1.7;max-width:480px;margin:0 auto 24px;}',
      '#nav-footer .footer-links{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:center;margin-bottom:24px;}',
      '#nav-footer .footer-links a{font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#4a4040;text-decoration:none;font-weight:500;transition:color 0.2s;}',
      '#nav-footer .footer-links a:hover{color:#b5ada6;}',
      '#nav-footer .footer-copy{font-size:12px;color:#3a3535;}',
      '@media(max-width:600px){#nav-footer{padding:36px 20px;}}'
    ].join('');
    document.head.appendChild(ds);
  }

  // ── LIGHT MODE CSS ───────────────────────────────────────────────────────────
  if (!document.getElementById('light-mode-css')) {
    var lmStyle = document.createElement('style');
    lmStyle.id = 'light-mode-css';
    lmStyle.textContent = [
      'body.light-mode{--bg:#f5f5f2;--surface:#ffffff;--surface2:#ebebeb;--gold:#c9a84c;--gold-dim:#a8893a;--cream:#0f0d0a;--muted:#4a4035;--border:#c8c0b4;background:#f5f5f2 !important;color:#0f0d0a !important;}',
      'body.light-mode nav,body.light-mode .site-nav{background:#ffffff !important;border-bottom:1px solid #d4ccc0 !important;box-shadow:0 2px 8px rgba(0,0,0,0.07) !important;}',
      'body.light-mode .nav-logo{color:#0f0d0a !important;font-weight:500 !important;}',
      'body.light-mode .nav-links a{color:#3a3228 !important;}',
      'body.light-mode .nav-links a:hover,body.light-mode .nav-links a.active{color:#0f0d0a !important;}',
      'body.light-mode .nav-links a[href="/"]{color:#8a6d2e !important;border-color:#c8b88a !important;}',
      'body.light-mode .nav-links a[href="/"]:hover{background:rgba(138,109,46,0.08) !important;border-color:#8a6d2e !important;}',
      'body.light-mode .nav-burger span{background:#0f0d0a !important;}',
      'body.light-mode .nav-drawer{background:#f0ede6 !important;border-left:1px solid #c8c0b4 !important;}',
      'body.light-mode .nav-drawer-links a{color:#3a3228 !important;border-bottom-color:#d4cdc6 !important;}',
      'body.light-mode .nav-drawer-links a:hover{color:#0f0d0a !important;}',
      'body.light-mode .nav-close{color:#3a3228 !important;}',
      'body.light-mode .nav-drawer-header{border-bottom:1px solid #c8c0b4 !important;background:#f0ede6 !important;}',
      'body.light-mode #t-overlay{background:#f5f5f2 !important;}',
      'body.light-mode #nav-user-dropdown{background:#ffffff !important;border:1px solid #c8c0b4 !important;box-shadow:0 8px 32px rgba(0,0,0,0.1) !important;}',
      'body.light-mode #nav-user-dropdown a{color:#3a3228 !important;border-bottom-color:#e0d8d0 !important;}',
      'body.light-mode #nav-user-dropdown a:hover{color:#0f0d0a !important;background:#f0ede6 !important;}',
      'body.light-mode a{color:inherit !important;text-decoration:none !important;}',
      'body.light-mode a:visited{color:inherit !important;}',
      'body.light-mode .type-card{background:#ffffff !important;border-color:#c8c0b4 !important;}',
      'body.light-mode .type-card *{color:#0f0d0a !important;}',
      'body.light-mode .type-card:hover{border-color:#c9a84c !important;box-shadow:0 12px 40px rgba(0,0,0,0.07) !important;}',
      'body.light-mode .card-name{color:#0f0d0a !important;font-weight:500 !important;}',
      'body.light-mode .card-tagline{color:#4a4035 !important;}',
      'body.light-mode .card-arrow{color:#c9a84c !important;}',
      'body.light-mode .hi{color:#c9a84c !important;}',
      'body.light-mode .mini-type{background:#ebebeb !important;border:1px solid #c8c0b4 !important;color:#3a3228 !important;}',
      'body.light-mode .lcard{background:#ffffff !important;border:1px solid #c8c0b4 !important;}',
      'body.light-mode .lcard:hover{border-color:#c9a84c !important;box-shadow:0 12px 40px rgba(0,0,0,0.07) !important;}',
      'body.light-mode .lcard-letter,.lcard-name{color:#0f0d0a !important;}',
      'body.light-mode .lcard-desc{color:#4a4035 !important;}',
      'body.light-mode .dim-desc{color:#4a4035 !important;}',
      'body.light-mode .page-sub{color:#4a4035 !important;}',
      'body.light-mode .page-eyebrow{color:#c9a84c !important;}',
      'body.light-mode .dim-num{color:#c9a84c !important;}',
      'body.light-mode .group-label,.group-name{color:#0f0d0a !important;}',
      'body.light-mode .group-desc{color:#4a4035 !important;}',
      'body.light-mode body::before{opacity:0 !important;}',
      'body.light-mode #theme-toggle-desktop{color:#9a8a7a;}',
      'body.light-mode #theme-toggle-mobile{color:#3a3228 !important;}',
      'body.light-mode #nav-footer{background:#ede8df !important;border-top-color:#c8c0b4 !important;}',
      'body.light-mode #nav-footer .footer-tagline{color:#6b5c3e !important;}',
      'body.light-mode #nav-footer .footer-links a{color:#8a7a68 !important;}',
      'body.light-mode #nav-footer .footer-links a:hover{color:#3a3228 !important;}',
      'body.light-mode #nav-footer .footer-copy{color:#a8987e !important;}'
    ].join('');
    document.head.appendChild(lmStyle);
  }

  // ── THEME ────────────────────────────────────────────────────────────────────
  function applyTheme(isLight) {
    document.body.classList.toggle('light-mode', isLight);
    var d = document.getElementById('theme-toggle-desktop');
    if (d) d.innerHTML = isLight ? MOON_SVG + ' Dark' : SUN_SVG + ' Light';
    var m = document.getElementById('theme-toggle-mobile');
    if (m) m.innerHTML = isLight ? MOON_SVG : SUN_SVG;
    var dr = document.getElementById('drawer-theme-toggle');
    if (dr) dr.innerHTML = isLight ? MOON_SVG + ' Dark mode' : SUN_SVG + ' Light mode';
  }

  // Apply saved theme before paint
  (function() {
    var saved = typeof localStorage !== 'undefined' ? localStorage.getItem('77s-theme') : null;
    if (saved === 'light') {
      if (document.body) {
        document.body.classList.add('light-mode');
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          document.body.classList.add('light-mode');
        });
      }
    }
  })();

  // ── LANGUAGE ─────────────────────────────────────────────────────────────────
  var path = window.location.pathname;
  var prefix = '';
  if (path.startsWith('/es')) prefix = '/es';
  else if (path.startsWith('/pt')) prefix = '/pt';

  // ── NAV LINKS ─────────────────────────────────────────────────────────────────
  // IMPORTANT: EN links must match static HTML exactly (same hrefs, same order)
  // so injectDesktopNav detects a match and skips rebuild — no flash.
  var NAV_LINKS = {
    '': [
      { href: '/',                    label: 'Take the Test' },
      { href: '/types',               label: '16 Types'      },
      { href: '/letters',             label: '8 Letters'     },
      { href: '/cognitive-functions', label: 'Functions'     },
      { href: '/compatibility',       label: 'Compatibility' },
      { href: '/archive',             label: 'Archive'       },
      { href: '/forum',               label: 'Forum'         },
      { href: '/about',               label: 'About'         }
    ],
    '/es': [
      { href: '/es/',                    label: 'Hacer el Test'  },
      { href: '/es/types',               label: '16 Tipos'       },
      { href: '/es/letters',             label: '8 Letras'       },
      { href: '/es/cognitive-functions', label: 'Funciones'      },
      { href: '/es/compatibility',       label: 'Compatibilidad' },
      { href: '/es/archive',             label: 'Archivo'        },
      { href: '/es/forum',               label: 'Foro'           },
      { href: '/es/about',               label: 'Acerca de'      }
    ],
    '/pt': [
      { href: '/pt/',                    label: 'Fazer o Teste'   },
      { href: '/pt/types',               label: '16 Tipos'        },
      { href: '/pt/letters',             label: '8 Letras'        },
      { href: '/pt/cognitive-functions', label: 'Funciones'       },
      { href: '/pt/compatibility',       label: 'Compatibilidade' },
      { href: '/pt/archive',             label: 'Arquivo'         },
      { href: '/pt/forum',               label: 'Fórum'           },
      { href: '/pt/about',               label: 'Sobre'           }
    ]
  };

  var links = NAV_LINKS[prefix] || NAV_LINKS[''];

  function isActive(href) {
    var p = window.location.pathname.replace(/\/$/, '') || '/';
    var h = href.replace(/\/$/, '') || '/';
    return p === h;
  }

  // ── INJECTION ─────────────────────────────────────────────────────────────────
  function injectDesktopNav(nav) {
    var existing = Array.from(nav.querySelectorAll('a'));
    var expectedHrefs = links.map(function(l) { return l.href; });
    var existingHrefs = existing.map(function(a) { return a.getAttribute('href'); });
    var match = expectedHrefs.length === existingHrefs.length &&
                expectedHrefs.every(function(h, i) { return h === existingHrefs[i]; });
    if (match) {
      // Links already correct — just update active states, no DOM change
      existing.forEach(function(a) {
        if (isActive(a.getAttribute('href'))) a.classList.add('active');
        else a.classList.remove('active');
      });
      return;
    }
    // Rebuild needed (ES/PT pages or mismatched static HTML)
    existing.forEach(function(a) { a.remove(); });
    var ref = nav.querySelector('.nav-burger') || null;
    links.forEach(function(item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (isActive(item.href)) a.classList.add('active');
      nav.insertBefore(a, ref);
    });
  }

  function injectDrawerNav(drawer) {
    drawer.innerHTML = '';
    links.forEach(function(item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (isActive(item.href)) a.classList.add('active');
      drawer.appendChild(a);
    });
    // Theme toggle at bottom
    var divider = document.createElement('div');
    divider.style.cssText = 'height:1px;background:var(--border,#252a30);margin:8px 0;';
    drawer.appendChild(divider);
    var themeBtn = document.createElement('button');
    themeBtn.id = 'drawer-theme-toggle';
    themeBtn.style.cssText = 'display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;padding:18px 24px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#b5ada6;font-family:"DM Sans",sans-serif;font-weight:500;width:100%;';
    themeBtn.onclick = function() {
      var isLight = !document.body.classList.contains('light-mode');
      localStorage.setItem('77s-theme', isLight ? 'light' : 'dark');
      applyTheme(isLight);
    };
    var isLt = localStorage.getItem('77s-theme') === 'light';
    themeBtn.innerHTML = isLt ? MOON_SVG + ' Dark mode' : SUN_SVG + ' Light mode';
    drawer.appendChild(themeBtn);
  }

  function injectThemeToggle(nav) {
    if (document.getElementById('theme-toggle-desktop')) return;
    var burger = nav.querySelector('.nav-burger');

    var desktopBtn = document.createElement('button');
    desktopBtn.id = 'theme-toggle-desktop';
    desktopBtn.setAttribute('aria-label', 'Toggle light/dark mode');
    desktopBtn.onclick = function() {
      var isLight = !document.body.classList.contains('light-mode');
      localStorage.setItem('77s-theme', isLight ? 'light' : 'dark');
      applyTheme(isLight);
    };

    var mobileBtn = document.createElement('button');
    mobileBtn.id = 'theme-toggle-mobile';
    mobileBtn.setAttribute('aria-label', 'Toggle light/dark mode');
    mobileBtn.onclick = function() {
      var isLight = !document.body.classList.contains('light-mode');
      localStorage.setItem('77s-theme', isLight ? 'light' : 'dark');
      applyTheme(isLight);
    };

    if (burger) {
      nav.insertBefore(desktopBtn, burger);
      nav.insertBefore(mobileBtn, burger);
    } else {
      nav.appendChild(desktopBtn);
      nav.appendChild(mobileBtn);
    }

    applyTheme(localStorage.getItem('77s-theme') === 'light');
  }

  function injectFooter() {
    if (document.getElementById('nav-footer')) return;
    // Don't inject on pages that already have a <footer>
    var existing = document.querySelector('footer');
    var target = existing || null;

    var footer = document.createElement('footer');
    footer.id = 'nav-footer';
    footer.innerHTML = [
      '<p class="footer-tagline">77 scenarios. No self-rating. No leading questions. Just situations and choices — and what they say about you.</p>',
      '<nav class="footer-links" aria-label="Footer navigation">',
      '  <a href="/types">16 Types</a>',
      '  <a href="/letters">8 Letters</a>',
      '  <a href="/cognitive-functions">Functions</a>',
      '  <a href="/compatibility">Compatibility</a>',
      '  <a href="/archive">Archive</a>',
      '  <a href="/forum">Forum</a>',
      '  <a href="/about">About</a>',
      '  <a href="/privacy">Privacy</a>',
      '</nav>',
      '<p class="footer-copy">&copy; 2025 77 Scenarios</p>'
    ].join('');

    if (existing) {
      // Replace existing footer content
      existing.id = 'nav-footer';
      existing.innerHTML = footer.innerHTML;
    } else {
      document.body.appendChild(footer);
    }
  }

  // ── AUTH ──────────────────────────────────────────────────────────────────────
  document.addEventListener('click', function(e) {
    if (!e.target.closest || !e.target.closest('.nav-user-wrap')) {
      var d = document.getElementById('nav-user-dropdown');
      if (d) d.style.display = 'none';
    }
  });

  function buildPill(username, avatarSrc) {
    var wrap = document.createElement('div');
    wrap.className = 'nav-user-wrap';
    wrap.style.cssText = 'opacity:0;transition:opacity 0.25s;';
    setTimeout(function() { wrap.style.opacity = '1'; }, 50);

    var btn = document.createElement('button');
    btn.className = 'nav-user-btn';
    btn.setAttribute('aria-label', 'Account menu');
    btn.onclick = function(e) {
      e.stopPropagation();
      var d = document.getElementById('nav-user-dropdown');
      if (d) d.style.display = d.style.display === 'block' ? 'none' : 'block';
    };

    var img = document.createElement('img');
    img.src = avatarSrc || FALLBACK;
    img.alt = 'User avatar';
    img.style.cssText = 'width:30px;height:30px;border-radius:50%;object-fit:cover;border:1.5px solid #8a6d2e;flex-shrink:0;';
    img.onerror = function() { this.src = FALLBACK; };

    var pill = document.createElement('span');
    pill.textContent = username || 'Profile';
    pill.style.cssText = 'background:#c9a84c;color:#0c0e10;padding:7px 16px;border-radius:60px;font-weight:500;font-size:0.82rem;letter-spacing:0.04em;white-space:nowrap;font-family:"DM Sans",sans-serif;';

    btn.appendChild(img);
    btn.appendChild(pill);
    wrap.appendChild(btn);

    var dd = document.createElement('div');
    dd.id = 'nav-user-dropdown';

    var profileLink = document.createElement('a');
    profileLink.href = prefix + '/profile';
    profileLink.textContent = 'Profile';

    var settingsLink = document.createElement('a');
    settingsLink.href = prefix + '/settings';
    settingsLink.textContent = 'Settings';

    var signOutBtn = document.createElement('button');
    signOutBtn.textContent = 'Sign out';
    signOutBtn.onclick = function() {
      var client = window._navSb || (window.supabase && window.supabase.createClient ? window.supabase.createClient(SUPA_URL, SUPA_KEY) : null);
      if (client) {
        client.auth.signOut().then(function() { window.location.href = prefix + '/'; });
      } else {
        window.location.href = prefix + '/';
      }
    };

    dd.appendChild(profileLink);
    dd.appendChild(settingsLink);
    dd.appendChild(signOutBtn);
    wrap.appendChild(dd);
    return wrap;
  }

  function buildSignIn() {
    var a = document.createElement('a');
    a.href = prefix + '/login';
    a.textContent = 'Sign in';
    a.style.cssText = 'border:1px solid #252a30;padding:7px 16px;border-radius:60px;font-size:0.82rem;color:#ede8df !important;text-decoration:none;font-family:"DM Sans",sans-serif;white-space:nowrap;opacity:0;transition:opacity 0.25s;';
    setTimeout(function() { a.style.opacity = '1'; }, 50);
    return a;
  }

  // ── INIT ──────────────────────────────────────────────────────────────────────
  function initNav() {
    var nav = document.querySelector('.site-nav, nav');
    var desktopNav = nav ? nav.querySelector('.nav-links') : null;
    var drawerNav = document.querySelector('.nav-drawer-links');

    if (!desktopNav || desktopNav.dataset.navReady) return;
    desktopNav.dataset.navReady = '1';

    // Inject nav (match check means EN pages skip rebuild entirely)
    injectDesktopNav(desktopNav);
    if (drawerNav) injectDrawerNav(drawerNav);
    injectThemeToggle(nav);
    injectFooter();

    // Auth
    var sb = window._navSb;
    if (!sb && window.supabase && window.supabase.createClient) {
      sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
      window._navSb = sb;
    }
    if (!sb) {
      desktopNav.appendChild(buildSignIn());
      return;
    }
    sb.auth.getSession().then(function(res) {
      var session = res.data && res.data.session;
      if (session) {
        sb.from('profiles').select('avatar_url,username').eq('id', session.user.id).single()
          .then(function(r) {
            var prof = r.data || {};
            desktopNav.appendChild(buildPill(prof.username || 'Profile', prof.avatar_url || ''));
            if (drawerNav) {
              var a = document.createElement('a');
              a.href = prefix + '/profile';
              a.textContent = prof.username || 'Profile';
              a.style.color = '#c9a84c';
              drawerNav.appendChild(a);
            }
          });
      } else {
        desktopNav.appendChild(buildSignIn());
        if (drawerNav) {
          var a = document.createElement('a');
          a.href = prefix + '/login';
          a.textContent = 'Sign in';
          drawerNav.appendChild(a);
        }
      }
    });
  }

  // Fix H1 spacing bug (types/letters/functions pages)
  function fixH1Spacing() {
    var h1 = document.querySelector('h1');
    if (!h1) return;
    var br = h1.querySelector('br');
    if (!br) return;
    var prev = br.previousSibling;
    if (prev && prev.nodeType === 3 && !prev.textContent.endsWith(' ')) {
      prev.textContent += ' ';
    } else if (prev && prev.nodeType === 1) {
      h1.insertBefore(document.createTextNode(' '), br);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initNav(); fixH1Spacing(); });
  } else {
    initNav();
    fixH1Spacing();
  }

})();

// ── SMOOTH NAVIGATION ────────────────────────────────────────────────────────
(function() {

  // 1. Cancel entry overlay IMMEDIATELY — kills the black fade-in on page load
  function cancelOverlay() {
    var ov = document.getElementById('t-overlay');
    if (!ov) return;
    ov.getAnimations().forEach(function(a) { a.cancel(); });
    ov.style.transition = 'none';
    ov.style.opacity = '0';
    ov.style.pointerEvents = 'none';
  }

  // Run now, and again after DOMContentLoaded catches any race
  cancelOverlay();
  document.addEventListener('DOMContentLoaded', cancelOverlay);

  // Also cancel on bfcache restore (back/forward)
  window.addEventListener('pageshow', function(e) {
    cancelOverlay();
  });

  // 2. Prefetch pages on hover — page is already cached by click time
  var prefetched = {};
  document.addEventListener('mouseover', function(e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        href.startsWith('javascript') || a.target) return;
    if (prefetched[href]) return;
    prefetched[href] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }, { passive: true });

  // 3. Intercept exit clicks — stop the black overlay exit animation
  // capture:true fires BEFORE the page's own bubble-phase listener
  document.addEventListener('click', function(e) {
    if (e.defaultPrevented) return;
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        href.startsWith('javascript') || a.target ||
        a.hasAttribute('download')) return;
    // Stop the page's overlay animation handler from firing
    e.stopImmediatePropagation();
    e.preventDefault();
    // Navigate cleanly — no black overlay
    window.location.href = href;
  }, true); // capture phase

})();
