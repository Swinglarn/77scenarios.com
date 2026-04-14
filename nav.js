(function() {
  // Google Analytics
  var _gas = document.createElement('script');
  _gas.async = true;
  _gas.src = 'https://www.googletagmanager.com/gtag/js?id=G-C0D86PRJJN';
  document.head.appendChild(_gas);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-C0D86PRJJN');

  var SUPA_URL = 'https://rttomfnfyjjssdqfzkaj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dG9tZm5meWpqc3NkcWZ6a2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODcwMjEsImV4cCI6MjA4ODU2MzAyMX0.0qBogK8xywL77IFYj4IywZIhHyKjbvbVmXYvG6wAZGw';
  var FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23252a30'/%3E%3Ccircle cx='40' cy='32' r='14' fill='%238a6d2e'/%3E%3Cellipse cx='40' cy='72' rx='24' ry='16' fill='%238a6d2e'/%3E%3C/svg%3E";

  // LIGHT MODE
  if (!document.getElementById('light-mode-css')) {
    var lmStyle = document.createElement('style');
    lmStyle.id = 'light-mode-css';
    lmStyle.textContent = [
      'body.light-mode{--bg:#f5f2ed;--cream:#1a1208;--muted:#6b5c3e;--border:#d9d0c0;--gold:#8a6d2e;--gold-dim:#6b4820;background:#f5f2ed!important;color:#1a1208!important;}',
      'body.light-mode header{background:#f5f2ed!important;border-bottom-color:#d9d0c0!important;}',
      'body.light-mode .logo,body.light-mode .nav-logo{color:#8a6d2e!important;}',
      'body.light-mode .nav-links a,body.light-mode nav a{color:#6b5c3e!important;}',
      'body.light-mode .nav-links a:hover,body.light-mode nav a:hover{color:#1a1208!important;}',
      'body.light-mode .nav-drawer{background:#ede8df!important;border-left-color:#d9d0c0!important;}',
      'body.light-mode .hamburger span{background:#1a1208!important;}',
      'body.light-mode footer{background:#f5f2ed!important;border-top-color:#d9d0c0!important;color:#6b5c3e!important;}',
      'body.light-mode #t-overlay{background:#f5f2ed!important;}',
      'body.light-mode #nav-user-dropdown{background:#ede8df!important;border-color:#d9d0c0!important;}',
      'body.light-mode #nav-user-dropdown a{color:#6b5c3e!important;border-bottom-color:#d9d0c0!important;}',
      'body.light-mode #nav-user-dropdown a:hover{color:#1a1208!important;background:rgba(0,0,0,0.04)!important;}',
      '#theme-toggle-wrap{padding:4px 0 0 0;}',
      '#theme-toggle{display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;padding:5px 0 5px 2rem;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#b5ada6;font-family:"DM Sans",sans-serif;opacity:0.6;transition:opacity 0.2s;}',
      '#theme-toggle:hover{opacity:1;}',
      'body.light-mode #theme-toggle{color:#6b5c3e;}'
    ].join('');
    document.head.appendChild(lmStyle);
  }

  function applyTheme(isLight) {
    document.body.classList.toggle('light-mode', isLight);
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.innerHTML = isLight
      ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark'
      : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Light';
  }

  function injectThemeToggle() {
    if (document.getElementById('theme-toggle-wrap')) return;
    var header = document.querySelector('header');
    if (!header) return;
    var wrap = document.createElement('div');
    wrap.id = 'theme-toggle-wrap';
    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle light/dark mode');
    btn.onclick = function() {
      var isLight = !document.body.classList.contains('light-mode');
      localStorage.setItem('77s-theme', isLight ? 'light' : 'dark');
      applyTheme(isLight);
    };
    wrap.appendChild(btn);
    header.insertAdjacentElement('afterend', wrap);
    applyTheme(localStorage.getItem('77s-theme') === 'light');
  }

  // Apply saved theme immediately to avoid flash
  if (typeof localStorage !== 'undefined' && localStorage.getItem('77s-theme') === 'light') {
    document.documentElement.classList.add('light-mode-pending');
    document.addEventListener('DOMContentLoaded', function() {
      document.body.classList.add('light-mode');
      document.documentElement.classList.remove('light-mode-pending');
    });
  }

  // NAV
  var path = window.location.pathname;
  var prefix = '';
  if (path.startsWith('/es')) prefix = '/es';
  else if (path.startsWith('/pt')) prefix = '/pt';

  var NAV_LINKS = {
    '': [
      { href: '/',                    label: 'Take the Test' },
      { href: '/types',               label: '16 Types'      },
      { href: '/letters',             label: '8 Letters'     },
      { href: '/cognitive-functions', label: 'Functions'     },
      { href: '/compatibility',       label: 'Compatibility' },
      { href: '/archive',             label: 'Archive'       },
      { href: '/store',               label: 'Store'         },
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

  function injectDesktopNav(nav) {
    Array.from(nav.querySelectorAll('a')).forEach(function(a) { a.remove(); });
    var ref = nav.firstChild;
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
  }

  if (!document.getElementById('nav-dropdown-css')) {
    var style = document.createElement('style');
    style.id = 'nav-dropdown-css';
    style.textContent = [
      '.nav-user-wrap{position:relative;display:inline-block;}',
      '.nav-user-btn{display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;padding:0;}',
      '#nav-user-dropdown{display:none;position:absolute;right:0;top:calc(100% + 8px);background:#13161a;border:1px solid #252a30;border-radius:10px;min-width:160px;z-index:9999;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);}',
      '#nav-user-dropdown a{display:block;padding:12px 18px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#b5ada6;text-decoration:none;border-bottom:1px solid #252a30;}',
      '#nav-user-dropdown a:hover{color:#ede8df;background:rgba(255,255,255,0.04);}',
      '#nav-user-dropdown button{display:block;width:100%;text-align:left;padding:12px 18px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#e07070;background:none;border:none;cursor:pointer;font-family:inherit;}',
      '#nav-user-dropdown button:hover{background:rgba(224,112,112,0.08);}'
    ].join('');
    document.head.appendChild(style);
  }

  document.addEventListener('click', function(e) {
    if (!e.target.closest || !e.target.closest('.nav-user-wrap')) {
      var d = document.getElementById('nav-user-dropdown');
      if (d) d.style.display = 'none';
    }
  });

  function buildPill(username, avatarSrc) {
    var wrap = document.createElement('div');
    wrap.className = 'nav-user-wrap';
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
    img.style.cssText = 'width:30px;height:30px;border-radius:50%;object-fit:cover;border:1.5px solid #8a6d2e;flex-shrink:0;';
    img.onerror = function() { this.src = FALLBACK; };
    var pill = document.createElement('span');
    pill.textContent = username || 'Profile';
    pill.style.cssText = 'background:#c9a84c;color:#0c0e10;padding:7px 16px;border-radius:60px;font-weight:500;font-size:0.82rem;letter-spacing:0.04em;white-space:nowrap;font-family:DM Sans,sans-serif;';
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
      var client = window._navSb || (function() {
        if (window.supabase && window.supabase.createClient) {
          return window.supabase.createClient(SUPA_URL, SUPA_KEY);
        }
        return null;
      })();
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
    a.style.cssText = 'border:1px solid #252a30;padding:7px 16px;border-radius:60px;font-size:0.82rem;color:#ede8df;text-decoration:none;font-family:DM Sans,sans-serif;white-space:nowrap;';
    return a;
  }

  function initNav() {
    var desktopNav = document.querySelector('.nav-links');
    var drawerNav = document.querySelector('.nav-drawer-links');
    if (!desktopNav || desktopNav.dataset.navReady) return;
    desktopNav.dataset.navReady = '1';
    injectDesktopNav(desktopNav);
    if (drawerNav) injectDrawerNav(drawerNav);
    injectThemeToggle();
    var sb = window._navSb;
    if (!sb && window.supabase && window.supabase.createClient) {
      sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
      window._navSb = sb;
    }
    if (!sb) {
      desktopNav.appendChild(buildSignIn());
      if (drawerNav) {
        var a = document.createElement('a'); a.href = prefix + '/login'; a.textContent = 'Sign in';
        drawerNav.appendChild(a);
      }
      return;
    }
    sb.auth.getSession().then(function(res) {
      var session = res.data && res.data.session;
      if (session) {
        sb.from('profiles').select('avatar_url,username').eq('id', session.user.id).single()
          .then(function(r) {
            var prof = r.data;
            desktopNav.appendChild(buildPill((prof && prof.username) || 'Profile', (prof && prof.avatar_url) || ''));
            if (drawerNav) {
              var a = document.createElement('a');
              a.href = prefix + '/profile';
              a.textContent = (prof && prof.username) || 'Profile';
              a.style.color = '#c9a84c';
              drawerNav.appendChild(a);
            }
          });
      } else {
        desktopNav.appendChild(buildSignIn());
        if (drawerNav) {
          var a = document.createElement('a'); a.href = prefix + '/login'; a.textContent = 'Sign in';
          drawerNav.appendChild(a);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
