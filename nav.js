(function() {

  // ── CANONICAL TAG ────────────────────────────────────────────────────────────
  // Injected immediately so it's in <head> before any other scripts run
  (function() {
    var BASE = 'https://77scenarios.com';
    var path = window.location.pathname;
    var search = window.location.search;
    // Build canonical — keep query string for type/letter pages, strip all else
    var keepQuery = /^\/(type|letter|compatibility)(\?.*)?$/.test(path + search);
    var canonical = BASE + path + (keepQuery ? search : '');
    // Remove trailing slash except root
    if (canonical !== BASE + '/' && canonical.slice(-1) === '/') {
      canonical = canonical.slice(0, -1);
    }
    var link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonical;
    document.head.appendChild(link);
  })();

  // ── SITEWIDE SCHEMA (WebSite + Organization) ─────────────────────────────────
  // Injected once on every page — establishes entity identity for Google
  (function() {
    var schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://77scenarios.com/#website',
          'url': 'https://77scenarios.com',
          'name': '77 Scenarios',
          'description': 'Scenario-based MBTI personality test and in-depth analysis of 700+ real and fictional people.',
          'inLanguage': 'en',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': {
              '@type': 'EntryPoint',
              'urlTemplate': 'https://77scenarios.com/archive?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'Organization',
          '@id': 'https://77scenarios.com/#organization',
          'name': '77 Scenarios',
          'url': 'https://77scenarios.com',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://77scenarios.com/og-image.png'
          },
          'description': 'Personality type analysis using cognitive function frameworks. Covers historical figures, fictional characters, public figures, and MBTI type comparisons.',
          'knowsAbout': ['MBTI', 'personality types', 'cognitive functions', 'Jungian typology'],
          'publisher': { '@id': 'https://77scenarios.com/#organization' }
        }
      ]
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
  })();

  // ── BREADCRUMB SCHEMA ────────────────────────────────────────────────────────
  // Auto-generated for character, vs, type, letter, cognitive-function pages
  (function() {
    var BASE = 'https://77scenarios.com';
    var path = window.location.pathname;
    var search = window.location.search;
    var crumbs = null;

    if (/^\/character\//.test(path)) {
      var slug = path.replace('/character/', '');
      var name = slug.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
      crumbs = [
        { pos: 1, name: 'Home', item: BASE + '/' },
        { pos: 2, name: 'Archive', item: BASE + '/archive' },
        { pos: 3, name: name, item: BASE + path }
      ];
    } else if (/^\/vs\//.test(path)) {
      var pair = path.replace('/vs/', '').toUpperCase().replace('-', ' vs ');
      crumbs = [
        { pos: 1, name: 'Home', item: BASE + '/' },
        { pos: 2, name: 'Type Comparisons', item: BASE + '/vs' },
        { pos: 3, name: pair, item: BASE + path }
      ];
    } else if (path === '/type' && search) {
      var t = (search.match(/t=([A-Z]{4})/) || [])[1];
      if (t) crumbs = [
        { pos: 1, name: 'Home', item: BASE + '/' },
        { pos: 2, name: '16 Types', item: BASE + '/types' },
        { pos: 3, name: t, item: BASE + path + search }
      ];
    } else if (path === '/letter' && search) {
      var l = (search.match(/l=([A-Z])/) || [])[1];
      if (l) crumbs = [
        { pos: 1, name: 'Home', item: BASE + '/' },
        { pos: 2, name: '8 Letters', item: BASE + '/letters' },
        { pos: 3, name: l + ' — ' + ({ E:'Extroversion',I:'Introversion',S:'Sensing',N:'Intuition',T:'Thinking',F:'Feeling',J:'Judging',P:'Perceiving' }[l] || l), item: BASE + path + search }
      ];
    } else if (path === '/cognitive-functions') {
      crumbs = [
        { pos: 1, name: 'Home', item: BASE + '/' },
        { pos: 2, name: 'Cognitive Functions', item: BASE + '/cognitive-functions' }
      ];
    }

    if (!crumbs) return;
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': crumbs.map(function(c) {
        return { '@type': 'ListItem', 'position': c.pos, 'name': c.name, 'item': c.item };
      })
    };
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
  })();

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

  if (!document.getElementById('nav-design-css')) {
    var ds = document.createElement('style');
    ds.id = 'nav-design-css';
    ds.textContent = [
      // Fixed nav — works on all pages regardless of parent overflow/height
      'nav.site-nav,.site-nav{position:fixed !important;top:0 !important;left:0 !important;right:0 !important;width:100% !important;z-index:200 !important;}',
      // Compensate for fixed nav taking element out of flow
      'body{padding-top:56px !important;}',
      // Nav links - DM Sans 500, bolder, mixed case
      // Reserve space on right for fixed auth+toggle container
      '.nav-links{position:absolute !important;left:50% !important;transform:translateX(-50%) !important;display:flex !important;align-items:center !important;}',
      '@media(max-width:480px){.nav-links{display:none !important;}}',
      '.nav-drawer-links{overflow-y:auto !important;-webkit-overflow-scrolling:touch !important;flex:1 !important;min-height:0 !important;}',
      '.nav-drawer{overflow:hidden !important;}',
      '.nav-drawer-header{flex-shrink:0 !important;}',
      '@media(max-width:480px){.nav-drawer-links{max-height:calc(100vh - 56px) !important;}}',
      '.nav-links a{font-family:"DM Sans",sans-serif !important;font-size:13px !important;font-weight:500 !important;letter-spacing:0.06em !important;text-transform:uppercase !important;color:#ccc6bf !important;transition:color 0.2s !important;}',
      '.nav-links a:hover,.nav-links a.active{color:#ede8df !important;}',
      // "Take the Test" - underline accent with slow pulse
      '@keyframes navUnderlinePulse{0%,100%{opacity:0.3;}50%{opacity:1;}}',
      '.nav-links a[href="/"]{color:#c9a84c !important;border:none !important;padding:0 !important;border-radius:0 !important;letter-spacing:0.08em !important;font-weight:500 !important;background:transparent !important;position:relative !important;transition:color 0.2s !important;}',
      '.nav-links a[href="/"]::after{content:"" !important;position:absolute !important;left:0 !important;right:0 !important;bottom:-4px !important;height:1px !important;background:#c9a84c !important;display:block !important;animation:navUnderlinePulse 3.5s ease-in-out infinite !important;}',
      '.nav-links a[href="/"]:hover{color:#e8cc7a !important;}',
      '.nav-links a[href="/"]:hover::after,.nav-links a[href="/"].active::after{opacity:1 !important;animation:none !important;}',
      // ES/PT CTA equivalents
      '.nav-links a[href="/es/"]{color:#c9a84c !important;border:none !important;padding:0 !important;border-radius:0 !important;font-weight:500 !important;background:transparent !important;position:relative !important;transition:color 0.2s !important;}',
      '.nav-links a[href="/es/"]::after{content:"" !important;position:absolute !important;left:0 !important;right:0 !important;bottom:-4px !important;height:1px !important;background:#c9a84c !important;display:block !important;animation:navUnderlinePulse 3.5s ease-in-out infinite !important;}',
      '.nav-links a[href="/pt/"]{color:#c9a84c !important;border:none !important;padding:0 !important;border-radius:0 !important;font-weight:500 !important;background:transparent !important;position:relative !important;transition:color 0.2s !important;}',
      '.nav-links a[href="/pt/"]::after{content:"" !important;position:absolute !important;left:0 !important;right:0 !important;bottom:-4px !important;height:1px !important;background:#c9a84c !important;display:block !important;animation:navUnderlinePulse 3.5s ease-in-out infinite !important;}',
      // Auth dropdown
      '.nav-user-wrap{position:relative;display:inline-block;}',
      '.nav-user-btn{display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;padding:0;}',
      '#nav-user-dropdown{display:none;position:absolute;right:0;top:calc(100% + 8px);background:#13161a;border:1px solid #252a30;border-radius:10px;min-width:160px;z-index:9999;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);}',
      '#nav-user-dropdown a{display:block;padding:12px 18px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#ccc6bf;text-decoration:none;border-bottom:1px solid #252a30;}',
      '#nav-user-dropdown a:hover{color:#ede8df;background:rgba(255,255,255,0.04);}',
      '#nav-user-dropdown button{display:block;width:100%;text-align:left;padding:12px 18px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#e07070;background:none;border:none;cursor:pointer;font-family:inherit;}',
      '#nav-user-dropdown button:hover{background:rgba(224,112,112,0.08);}',
      // Theme toggle buttons
      '#theme-toggle-desktop{display:inline-flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;padding:4px 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6358;font-family:"DM Sans",sans-serif;transition:color 0.2s;}',
      '#theme-toggle-desktop:hover{color:#ccc6bf;}',
      '@media(max-width:480px){#theme-toggle-desktop{display:none !important;}}',
      '#theme-toggle-mobile{display:none !important;background:none;border:none;cursor:pointer;padding:6px;color:#ccc6bf;line-height:1;}',
      '@media(max-width:480px){#theme-toggle-mobile{display:inline-flex !important;align-items:center;justify-content:center;width:36px;height:36px;}}',
      // Nav right slot - lives inside sticky nav, never overlaps scrollbar
      '.nav-right-slot{display:flex;align-items:center;gap:12px;margin-left:auto;flex-shrink:0;}',
      '@media(max-width:480px){.nav-right-slot{display:none;}}',
      // Logo redesign
      '.nav-logo{font-family:\"Cormorant Garamond\",serif !important;font-size:22px !important;font-weight:300 !important;text-decoration:none !important;display:inline-flex !important;align-items:baseline !important;gap:3px !important;letter-spacing:0 !important;}',
      '.logo-77{color:#c9a84c !important;font-weight:600 !important;font-size:38px !important;font-style:italic !important;line-height:1 !important;letter-spacing:-0.03em !important;}',
      '.logo-scenarios{color:#ede8df !important;font-weight:300 !important;font-size:26px !important;letter-spacing:0.1em !important;text-transform:lowercase !important;}',
      'body.light-mode .logo-scenarios{color:#141210 !important;}',
      'body.light-mode .logo-77{color:#c9a84c !important;}',
      // Footer styles
      '#nav-footer{border-top:1px solid #252a30;padding:60px 32px 0;background:#0d0f12;}',
      '#nav-footer .footer-inner{display:flex;gap:48px;max-width:1100px;margin:0 auto 48px;flex-wrap:wrap;}',
      '#nav-footer .footer-brand{flex:0 0 260px;min-width:200px;}',
      '#nav-footer .footer-logo{display:flex;align-items:baseline;gap:4px;margin-bottom:14px;}',
      '#nav-footer .footer-logo-text{font-family:\'Cormorant Garamond\',serif;font-size:18px;font-weight:300;letter-spacing:0.1em;color:#7a7268;text-transform:lowercase;}',
      '#nav-footer .footer-tagline{font-size:13px;color:#7a7268;line-height:1.7;margin:0 0 18px;font-style:italic;}',
      '#nav-footer .footer-cta{font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#c9a84c;text-decoration:none;border:1px solid rgba(201,168,76,0.3);border-radius:20px;padding:7px 16px;display:inline-block;transition:border-color 0.2s,color 0.2s;}',
      '#nav-footer .footer-cta:hover{border-color:#c9a84c;color:#e0c070;}',
      '#nav-footer .footer-cols{flex:1;display:flex;gap:40px;flex-wrap:wrap;min-width:200px;}',
      '#nav-footer .footer-col{flex:1;min-width:120px;display:flex;flex-direction:column;gap:10px;}',
      '#nav-footer .footer-col-head{font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#5a5550;margin-bottom:2px;}',
      '#nav-footer .footer-col a{font-size:13px;color:#9a9088;text-decoration:none;transition:color 0.2s;width:fit-content;}',
      '#nav-footer .footer-col a:hover{color:#ede8df;}',
      '#nav-footer .footer-bottom{border-top:1px solid #1e2126;padding:20px 0;max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;}',
      '#nav-footer .footer-copy{font-size:11px;color:#5a5550;letter-spacing:0.06em;}',
      '#nav-footer .footer-bottom-links{font-size:11px;color:#5a5550;letter-spacing:0.06em;}',
      '#nav-footer .footer-bottom-links a{color:#5a5550;text-decoration:none;transition:color 0.2s;}',
      '#nav-footer .footer-bottom-links a:hover{color:#9a9088;}',
      '@media(max-width:700px){#nav-footer{padding:40px 20px 0;}#nav-footer .footer-brand{flex:0 0 100%;}#nav-footer .footer-cols{gap:24px;}}'
    ].join('');
    document.head.appendChild(ds);
  }

  // ── LIGHT MODE CSS ───────────────────────────────────────────────────────────
  if (!document.getElementById('light-mode-css')) {
    var lmStyle = document.createElement('style');
    lmStyle.id = 'light-mode-css';
    lmStyle.textContent = [
      /* ── Core palette ── */
      /* Barely-warm neutral gray surfaces, not yellow/orange, just "light gray with a hint of warmth" */
      /* Gold pops cleanly against neutral gray the same way it pops against dark charcoal */
      'body.light-mode{--bg:#ffffff;--surface:#f2f1ef;--surface2:#e7e5e2;--gold:#c9a84c;--gold-dim:#a8893a;--cream:#141210;--muted:#504840;--border:#dcdad5;background:#ffffff !important;color:#141210 !important;}',
      /* ── Nav bar ── */
      'body.light-mode nav,body.light-mode .site-nav{background:rgba(255,255,255,0.96) !important;border-bottom:1px solid #dcdad5 !important;box-shadow:0 2px 10px rgba(0,0,0,0.06) !important;}',
      'body.light-mode .nav-logo{color:#141210 !important;font-weight:500 !important;}',
      'body.light-mode .nav-links a{color:#38302a !important;}',
      'body.light-mode .nav-links a:hover,body.light-mode .nav-links a.active{color:#141210 !important;}',
      'body.light-mode .nav-links a[href="/"]{color:#8a6d2e !important;border:none !important;background:transparent !important;}',
      'body.light-mode .nav-links a[href="/"]::after{background:#8a6d2e !important;}',
      'body.light-mode .nav-links a[href="/"]:hover{color:#6b5020 !important;}',
      'body.light-mode .nav-links a[href="/es/"]{color:#8a6d2e !important;border:none !important;background:transparent !important;}',
      'body.light-mode .nav-links a[href="/es/"]::after{background:#8a6d2e !important;}',
      'body.light-mode .nav-links a[href="/pt/"]{color:#8a6d2e !important;border:none !important;background:transparent !important;}',
      'body.light-mode .nav-links a[href="/pt/"]::after{background:#8a6d2e !important;}',
      'body.light-mode .nav-burger span{background:#141210 !important;}',
      /* ── Mobile drawer ── */
      'body.light-mode .nav-drawer{background:#f2f1ef !important;border-left:1px solid #dcdad5 !important;}',
      'body.light-mode .nav-drawer-links a{color:#38302a !important;border-bottom-color:#dcdad5 !important;}',
      'body.light-mode .nav-drawer-links a:hover{color:#141210 !important;}',
      'body.light-mode .nav-close{color:#38302a !important;}',
      'body.light-mode .nav-drawer-header{border-bottom:1px solid #dcdad5 !important;background:#eef2f7 !important;}',
      /* ── Overlay + user dropdown ── */
      'body.light-mode #t-overlay{background:#ffffff !important;}',
      'body.light-mode #nav-user-dropdown{background:#f2f1ef !important;border:1px solid #dcdad5 !important;box-shadow:0 8px 32px rgba(0,0,0,0.12) !important;}',
      'body.light-mode #nav-user-dropdown a{color:#38302a !important;border-bottom-color:#dcdad5 !important;}',
      'body.light-mode #nav-user-dropdown a:hover{color:#141210 !important;background:#e7e5e2 !important;}',
      /* ── Global link reset ── */
      'body.light-mode a{color:inherit !important;text-decoration:none !important;}',
      'body.light-mode a:visited{color:inherit !important;}',
      /* ── Cards, neutral gray with subtle lift shadow ── */
      'body.light-mode .type-card{background:#eef2f7 !important;border-color:#b0bcc8 !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',
      'body.light-mode .type-card *{color:#141210 !important;}',
      'body.light-mode .type-card:hover{border-color:#c9a84c !important;box-shadow:0 8px 28px rgba(0,0,0,0.09) !important;}',
      'body.light-mode .card-name{color:#141210 !important;font-weight:500 !important;}',
      'body.light-mode .card-tagline{color:#504840 !important;}',
      'body.light-mode .card-arrow{color:#c9a84c !important;}',
      'body.light-mode .hi{color:#c9a84c !important;}',
      /* ── Mini type badges, clearly darker than card background ── */
      'body.light-mode .mini-type{background:#e7e5e2 !important;border:1px solid #dcdad5 !important;color:#38302a !important;}',
      /* ── Letter cards ── */
      'body.light-mode .lcard{background:#eef2f7 !important;border:1px solid #b0bcc8 !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',
      'body.light-mode .lcard:hover{border-color:#c9a84c !important;box-shadow:0 8px 28px rgba(0,0,0,0.09) !important;}',
      /* FIX: both selectors must be scoped to body.light-mode or dark mode gets dark text */
      'body.light-mode .lcard-letter,body.light-mode .lcard-name{color:#141210 !important;}',
      'body.light-mode .lcard-desc{color:#504840 !important;}',
      /* ── Text utilities ── */
      'body.light-mode .dim-desc{color:#38302a !important;}',
      'body.light-mode .page-sub{color:#141210 !important;}',
      'body.light-mode .page-eyebrow{color:#a8893a !important;}',
      'body.light-mode .dim-num{color:#a8893a !important;}',
      /* FIX: both selectors must be scoped, .group-name was applying dark text globally */
      'body.light-mode .group-label,body.light-mode .group-name{color:#141210 !important;}',
      'body.light-mode .group-desc{color:#38302a !important;}',
      /* ── Noise texture off ── */
      'body.light-mode body::before{opacity:0 !important;}',
      /* ── Theme toggles ── */
      'body.light-mode #theme-toggle-desktop{color:#807870 !important;}',
      'body.light-mode #theme-toggle-mobile{color:#38302a !important;}',
      /* ── Nav right slot ── */
      'body.light-mode .nav-right-slot a:not(.nav-cta){border-color:#dcdad5 !important;color:#38302a !important;}',
      /* ── Footer, deeper neutral, clearly distinct from page ── */
      'body.light-mode #nav-footer{background:#e7e5e2 !important;border-top-color:#dcdad5 !important;}',
      'body.light-mode #nav-footer .footer-tagline{color:#504840 !important;}',
      'body.light-mode #nav-footer .footer-col a{color:#38302a !important;}',
      'body.light-mode #nav-footer .footer-col a:hover{color:#141210 !important;}',
      'body.light-mode #nav-footer .footer-col-head{color:#807870 !important;}',
      'body.light-mode #nav-footer .footer-cta{color:#8a6d2e !important;border-color:rgba(138,109,46,0.35) !important;}',
      'body.light-mode #nav-footer .footer-cta:hover{border-color:#a8893a !important;color:#6b5020 !important;}',
      'body.light-mode #nav-footer .footer-copy{color:#807870 !important;}',
      'body.light-mode #nav-footer .footer-bottom{border-top-color:#dcdad5 !important;}',
      'body.light-mode #nav-footer .footer-bottom-links a{color:#807870 !important;}',
      'body.light-mode #nav-footer .footer-bottom-links a:hover{color:#504840 !important;}',
      'body.light-mode #nav-footer .footer-logo-text{color:#807870 !important;}',
      /* ── FAQ ── */
      'body.light-mode .faq-item{border-bottom-color:#dcdad5 !important;}',
      'body.light-mode .faq-q{color:#141210 !important;font-weight:500 !important;}',
      'body.light-mode .faq-a{color:#38302a !important;}',
      /* ── Rarity badges, use surface2 so they're distinct inside cards ── */
      'body.light-mode .rarity-badge{background:#e7e5e2 !important;border-color:#dcdad5 !important;color:#504840 !important;}',
      /* ── Compat score blocks ── */
      'body.light-mode .score-block{background:#eef2f7 !important;border-color:#b0bcc8 !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',
      'body.light-mode .score-bar-track{background:#dcdad5 !important;}',
      'body.light-mode .score-legend{color:#504840 !important;}',
      'body.light-mode .score-label-text{filter:saturate(1.3) brightness(0.85);}',
      /* ── Type pair cards ── */
      'body.light-mode .type-pair-card{background:#eef2f7 !important;border-color:#b0bcc8 !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',
      'body.light-mode .type-pair-card:hover{border-color:#c9a84c !important;box-shadow:0 8px 28px rgba(0,0,0,0.09) !important;}',
      'body.light-mode .tpc-code{color:#141210 !important;}',
      'body.light-mode .tpc-name{color:#141210 !important;}',
      'body.light-mode .tpc-tagline{color:#504840 !important;}',
      'body.light-mode .tpc-arrow{color:#a8893a !important;}',
      /* ── Related pills + similar cards ── */
      /* Pills are surface2 so they contrast inside card backgrounds ── */
      'body.light-mode .related-pill{background:#e7e5e2 !important;border-color:#dcdad5 !important;color:#504840 !important;}',
      'body.light-mode .related-pill:hover{border-color:#c9a84c !important;color:#8a6d2e !important;background:#dddbd6 !important;}',
      'body.light-mode .similar-card{background:#eef2f7 !important;border-color:#b0bcc8 !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',
      'body.light-mode .similar-card:hover{border-color:#c9a84c !important;box-shadow:0 8px 28px rgba(0,0,0,0.09) !important;}',
      'body.light-mode .sim-code{color:#141210 !important;}',
      'body.light-mode .sim-name{color:#504840 !important;}',
      /* ── Info / prose / legal boxes ── */
      'body.light-mode .info-box{background:#eef2f7 !important;border-color:#b0bcc8 !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',
      'body.light-mode .info-box p{color:#38302a !important;}',
      'body.light-mode .data-list li{color:#141210 !important;}',
      'body.light-mode .prose{color:#141210 !important;}',
      'body.light-mode .warning-box{background:rgba(201,168,76,0.08) !important;border-color:rgba(201,168,76,0.3) !important;}',
      'body.light-mode .warning-box p{color:#141210 !important;}',
      /* ── Contact forms, inputs white, cards surface gray ── */
      'body.light-mode .contact-form input,body.light-mode .contact-form textarea,body.light-mode .contact-form select{background:#ffffff !important;border-color:#dcdad5 !important;color:#141210 !important;}',
      'body.light-mode .contact-form input:focus,body.light-mode .contact-form textarea:focus,body.light-mode .contact-form select:focus{border-color:#c9a84c !important;box-shadow:0 0 0 3px rgba(201,168,76,0.12) !important;}',
      'body.light-mode .contact-card{background:#eef2f7 !important;border-color:#b0bcc8 !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',
      /* ── vs pages ── */
      'body.light-mode .vs-section-title{color:#141210 !important;}',
      'body.light-mode .vs-type-code{color:#141210 !important;}',
      'body.light-mode .vs-vs-word{color:#7a7570 !important;}',
      'body.light-mode .vs-tagline{color:#7a7570 !important;}',
      'body.light-mode .vs-prose p{color:#3a3630 !important;}',
      'body.light-mode .vs-fn-col{background:#eef2f7 !important;border-color:#b0bcc8 !important;}',
      'body.light-mode .vs-fn-col-header{color:#141210 !important;}',
      'body.light-mode .vs-fn-item.introverted{background:#e2eef6 !important;color:#2d5a7b !important;}',
      'body.light-mode .vs-fn-item.extroverted{background:#fdf5e4 !important;color:#7a5c1e !important;}',
      'body.light-mode .vs-table tbody tr:nth-child(even){background:#eef2f7 !important;}',
      'body.light-mode .vs-table td{color:#3a3630 !important;}',
      'body.light-mode .vs-table td:first-child{color:#7a7570 !important;}',
      'body.light-mode .vs-table th:not(:first-child){color:#7a5c1e !important;}',
      'body.light-mode .vs-overlap-item{background:#eef2f7 !important;border-color:#b0bcc8 !important;color:#3a3630 !important;}',
      'body.light-mode .vs-tell-item{background:#eef2f7 !important;}',
      'body.light-mode .vs-tell-title{color:#141210 !important;}',
      'body.light-mode .vs-tell-body{color:#5a5550 !important;}',
      'body.light-mode .vs-famous-col{background:#eef2f7 !important;border-color:#b0bcc8 !important;}',
      'body.light-mode .vs-famous-col-title{color:#7a5c1e !important;}',
      'body.light-mode .vs-famous-name{color:#141210 !important;}',
      'body.light-mode .vs-quiz{background:#eef2f7 !important;border-color:#b0bcc8 !important;}',
      'body.light-mode .vs-quiz-option{background:#e7e5e2 !important;border-color:#dcdad5 !important;color:#3a3630 !important;}',
      'body.light-mode .vs-quiz-option.selected{background:#fdf5e4 !important;border-color:#9a7e3a !important;color:#141210 !important;}',
      'body.light-mode .vs-quiz-q-text{color:#141210 !important;}',
      'body.light-mode .vs-breadcrumb{color:#7a7570 !important;}',
      'body.light-mode .vs-breadcrumb a{color:#7a7570 !important;}',
      'body.light-mode .vs-cta{border-top-color:#dcdad5 !important;}',
      'body.light-mode .vs-cta-copy{color:#7a7570 !important;}',
      'body.light-mode .vs-not-found h1{color:#141210 !important;}',
      'body.light-mode .vs-hub-title{color:#141210 !important;}',
      'body.light-mode .vs-hub-desc{color:#504840 !important;}',
      'body.light-mode .vs-pair-card{background:#eef2f7 !important;border-color:#b0bcc8 !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',
      'body.light-mode .vs-pair-card:hover{border-color:#c9a84c !important;box-shadow:0 4px 16px rgba(30,60,100,0.14),0 1px 4px rgba(30,60,100,0.07) !important;}',
      'body.light-mode .vs-pair-card-types{color:#141210 !important;}',
      'body.light-mode .vs-pair-card-tag{color:#504840 !important;}',

      /* ── All boxes/cards site-wide: bright white, visible border, lifted shadow ── */
      'body.light-mode .db-card,body.light-mode .fncard,body.light-mode .intro-box,body.light-mode .cta-box,body.light-mode .post-body,body.light-mode .reply-card,body.light-mode .box,body.light-mode .growth-box,body.light-mode .opp-block,body.light-mode .lcard,body.light-mode .fd-box,body.light-mode .famous-card,body.light-mode .type-card,body.light-mode .type-mini,body.light-mode .modal,body.light-mode .actor-chip,body.light-mode .universe-chip{background:#eef2f7 !important;border-color:#b0bcc8 !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',

      /* Nested / secondary surface cards */
      'body.light-mode .fn-card,body.light-mode .tag,body.light-mode .mini-type,body.light-mode .filter-btn,body.light-mode .type-btn{background:#e4ecf4 !important;border-color:#b0bcc8 !important;}',

      /* Archive card text — hardcoded light colors need dark overrides */
      'body.light-mode .db-card-name{color:#1c1a18 !important;}',
      'body.light-mode .db-card-ctx{color:#4a5868 !important;}',
      'body.light-mode .db-card-cat{color:#7a8898 !important;opacity:1 !important;}',
      'body.light-mode .db-card-type{color:var(--gold-dim) !important;}',

      /* Archive filter/type button text */
      'body.light-mode .filter-btn{color:#3a3830 !important;}',
      'body.light-mode .filter-btn.active{color:var(--gold) !important;background:rgba(201,168,76,0.1) !important;border-color:var(--gold-dim) !important;}',
      'body.light-mode .type-btn{color:#3a3830 !important;}',
      'body.light-mode .type-btn.active{color:var(--gold) !important;background:rgba(201,168,76,0.1) !important;border-color:var(--gold-dim) !important;}',
      'body.light-mode .results-info-count{color:#1c1a18 !important;}',

      /* Hover lift for interactive cards */
      'body.light-mode .db-card:hover,body.light-mode .type-card:hover,body.light-mode .lcard:hover,body.light-mode .related-card:hover,body.light-mode .fncard:hover{box-shadow:0 4px 18px rgba(30,60,100,0.14),0 2px 4px rgba(30,60,100,0.07) !important;border-color:#c9a84c !important;}',

      /* Keep gold left-border accent on verdict and growth-box */
      'body.light-mode .verdict{border-left-color:var(--gold) !important;border-left-width:4px !important;}',
      'body.light-mode .growth-box{border-left-color:var(--gold-dim) !important;border-left-width:2px !important;}',

      /* New page cards: profile, settings, about, login, privacy, terms, contact, forum */
      'body.light-mode .score-card,body.light-mode .verdict-box,body.light-mode .cta-block,body.light-mode .result-card,body.light-mode .contact-card,body.light-mode .thread-item,body.light-mode .auth-notice,body.light-mode .info-box,body.light-mode .post-body,body.light-mode .reply-card{background:#eef2f7 !important;border-color:#b0bcc8 !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',
      'body.light-mode .callout{background:#eef2f7 !important;border-color:#b0bcc8 !important;border-left-color:var(--gold-dim) !important;box-shadow:0 2px 10px rgba(30,60,100,0.08),0 1px 3px rgba(30,60,100,0.05) !important;}',
      'body.light-mode .warning-box{background:rgba(201,168,76,0.06) !important;border-color:rgba(201,168,76,0.3) !important;}',
      'body.light-mode .contact-card:hover,body.light-mode .thread-item:hover,body.light-mode .result-card:hover{box-shadow:0 4px 18px rgba(30,60,100,0.14),0 2px 4px rgba(30,60,100,0.07) !important;border-color:#c9a84c !important;}',

      /* Form inputs in light mode */
      'body.light-mode .field-input,body.light-mode .field input,body.light-mode .field textarea,body.light-mode .field select,body.light-mode .form-input,body.light-mode .form-select,body.light-mode .form-textarea{background:#eef2f7 !important;border-color:#b0bcc8 !important;color:#1a1818 !important;}',
      'body.light-mode .field-input:focus,body.light-mode .field input:focus,body.light-mode .field textarea:focus,body.light-mode .form-input:focus{border-color:#c9a84c !important;}',
      'body.light-mode .field-input::placeholder,body.light-mode .field input::placeholder,body.light-mode .field textarea::placeholder{color:#a0a8b0 !important;opacity:1 !important;}',

      /* Prose text in light mode */
      'body.light-mode .prose{color:#141210 !important;}',
      'body.light-mode .data-list li{color:#141210 !important;}',

      /* Search bar: dark in dark mode, white in light mode */
      'body.light-mode #site-search{background:#ffffff !important;border-bottom:1px solid #dcdad5 !important;box-shadow:0 2px 10px rgba(0,0,0,0.07) !important;backdrop-filter:none !important;-webkit-backdrop-filter:none !important;}',
      'body.light-mode #srch-icon{color:#a09898 !important;}',
      'body.light-mode #srch-input{background:#eef2f7 !important;border-color:#b0bcc8 !important;color:#1a1818 !important;}',
      'body.light-mode #srch-input:focus{border-color:#c9a84c !important;background:#ffffff !important;}',
      'body.light-mode #srch-input::placeholder{color:#a89e98 !important;}',
      'body.light-mode #srch-hint{color:#c8c0b8 !important;}',
      'body.light-mode #srch-res{background:#ffffff !important;border-color:#e4e0dc !important;box-shadow:0 12px 40px rgba(0,0,0,0.12) !important;}',
      'body.light-mode .srch-item{border-bottom-color:#f0ece8 !important;}',
      'body.light-mode .srch-item.srch-active,body.light-mode .srch-item:hover{background:rgba(201,168,76,0.08) !important;}',
      'body.light-mode .srch-title{color:#1a1818 !important;}',
      'body.light-mode .srch-sub{color:#807870 !important;}',
      'body.light-mode .srch-arrow{color:#ccc8c0 !important;}',
      'body.light-mode .srch-empty{color:#a09898 !important;}',

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
  // so injectDesktopNav detects a match and skips rebuild - no flash.
  var NAV_LINKS = {
    '': [
      { href: '/',                    label: 'Take the Test'  },
      { href: '/types',               label: '16 Types'       },
      { href: '/letters',             label: '8 Letters'      },
      { href: '/cognitive-functions', label: 'Functions'      },
      { href: '/compatibility',       label: 'Compatibility'  },
      { href: '/vs',                  label: 'Type vs Type'   },
      { href: '/archive',             label: 'Archive'        },
      { href: '/forum',               label: 'Forum'          },
      { href: '/about',               label: 'About'          }
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
    if (h === p) return true;
    // Prefix match for section roots (e.g. /vs matches /vs/infj-infp)
    if (h !== '/' && p.startsWith(h + '/')) return true;
    return false;
  }

  // ── INJECTION ─────────────────────────────────────────────────────────────────
  function injectDesktopNav(nav) {
    var existing = Array.from(nav.querySelectorAll('a'));
    var expectedHrefs = links.map(function(l) { return l.href; });
    var existingHrefs = existing.map(function(a) { return a.getAttribute('href'); });
    var match = expectedHrefs.length === existingHrefs.length &&
                expectedHrefs.every(function(h, i) { return h === existingHrefs[i]; });
    if (match) {
      // Links already correct - just update active states, no DOM change
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
    themeBtn.style.cssText = 'display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;padding:18px 24px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#ccc6bf;font-family:"DM Sans",sans-serif;font-weight:500;width:100%;';
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

    // Desktop toggle lives in fixed right container (next to auth, can't overlap)
    var desktopBtn = document.createElement('button');
    desktopBtn.id = 'theme-toggle-desktop';
    desktopBtn.setAttribute('aria-label', 'Toggle light/dark mode');
    desktopBtn.onclick = function() {
      var isLight = !document.body.classList.contains('light-mode');
      localStorage.setItem('77s-theme', isLight ? 'light' : 'dark');
      applyTheme(isLight);
    };
    getNavSlot(nav).insertBefore(desktopBtn, getNavSlot(nav).firstChild);

    // Mobile toggle stays in the nav bar (before burger)
    var mobileBtn = document.createElement('button');
    mobileBtn.id = 'theme-toggle-mobile';
    mobileBtn.setAttribute('aria-label', 'Toggle light/dark mode');
    mobileBtn.onclick = function() {
      var isLight = !document.body.classList.contains('light-mode');
      localStorage.setItem('77s-theme', isLight ? 'light' : 'dark');
      applyTheme(isLight);
    };
    if (burger) {
      nav.insertBefore(mobileBtn, burger);
    } else {
      nav.appendChild(mobileBtn);
    }

    // Redesign logo - replace text with styled HTML
    var logo = nav.querySelector('.nav-logo, .logo');
    if (logo && !logo.querySelector('.logo-77')) {
      logo.innerHTML = '<span class="logo-77">77</span><span class="logo-scenarios">scenarios</span>';
    }

    applyTheme(localStorage.getItem('77s-theme') === 'light');
  }

  function injectFooter() {
    if (document.getElementById('nav-footer')) return;
    // Don't inject on pages that already have a <footer>
    var existing = document.querySelector('footer');
    var target = existing || null;
    var year = new Date().getFullYear();

    var footer = document.createElement('footer');
    footer.id = 'nav-footer';
    footer.innerHTML = [
      '<div class="footer-inner">',
      '  <div class="footer-brand">',
      '    <div class="footer-logo"><span class="logo-77">77</span><span class="footer-logo-text">scenarios</span></div>',
      '    <p class="footer-tagline">77 situations. No self-rating.<br>Just choices, and what they reveal.</p>',
      '    <a href="/" class="footer-cta">Take the test →</a>',
      '  </div>',
      '  <div class="footer-cols">',
      '    <div class="footer-col">',
      '      <div class="footer-col-head">Explore</div>',
      '      <a href="/types">16 Types</a>',
      '      <a href="/letters">8 Letters</a>',
      '      <a href="/cognitive-functions">Functions</a>',
      '      <a href="/compatibility">Compatibility</a>',
      '      <a href="/vs">Type vs Type</a>',
      '      <a href="/archive">Character Archive</a>',
      '    </div>',
      '    <div class="footer-col">',
      '      <div class="footer-col-head">Community</div>',
      '      <a href="/forum">Forum</a>',
      '      <a href="/about">About</a>',
      '      <a href="/contact">Contact</a>',
      '    </div>',
      '    <div class="footer-col">',
      '      <div class="footer-col-head">Legal</div>',
      '      <a href="/privacy">Privacy Policy</a>',
      '      <a href="/terms">Terms of Service</a>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="footer-bottom">',
      '  <span class="footer-copy">&copy; ' + year + ' 77 Scenarios. All rights reserved.</span>',
      '  <span class="footer-bottom-links"><a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a></span>',
      '</div>'
    ].join('');

    if (existing) {
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
    setTimeout(function() { wrap.style.opacity = '1'; }, 30);

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
        client.auth.signOut().then(function() { try{localStorage.removeItem('77s-auth');}catch(e){} window.location.href = prefix + '/'; });
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

  function getNavSlot(nav) {
    var slot = document.getElementById('nav-right-slot');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'nav-right-slot';
      slot.className = 'nav-right-slot';
      if (nav) nav.appendChild(slot);
      else {
        var n = document.querySelector('.site-nav, nav');
        if (n) n.appendChild(slot);
      }
    }
    return slot;
  }

  function buildSignIn() {
    var a = document.createElement('a');
    a.href = prefix + '/login';
    a.textContent = 'Sign in';
    a.style.cssText = 'border:1px solid #252a30;padding:7px 16px;border-radius:60px;font-size:0.82rem;color:#ede8df;text-decoration:none;font-family:"DM Sans",sans-serif;white-space:nowrap;opacity:0;transition:opacity 0.25s;';
    setTimeout(function() { a.style.opacity = '1'; }, 50);
    return a;
  }

  // ── GLOBAL TOGGLE (used by inline onclick on static-HTML pages too) ──────────
  window.toggleMenu = function() {
    var d = document.getElementById('nav-drawer');
    var o = document.getElementById('nav-overlay');
    var b = document.querySelector('.nav-burger');
    if (!d) return;
    var isOpen = d.classList.contains('open');
    d.classList.toggle('open', !isOpen);
    if (o) o.classList.toggle('open', !isOpen);
    if (b) b.classList.toggle('open', !isOpen);
  };

  // ── INIT ──────────────────────────────────────────────────────────────────────
  function initNav() {
    var nav = document.querySelector('.site-nav');

    // If no site-nav exists, build the whole structure and prepend to body
    if (!nav) {
      // Inject base nav CSS so the page doesn't need it hardcoded
      var baseStyle = document.createElement('style');
      baseStyle.textContent = [
        'nav.site-nav{position:fixed;top:0;left:0;right:0;width:100%;z-index:200;background:rgba(12,14,16,0.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--border,#252a30);padding:0 32px;display:flex;justify-content:space-between;align-items:center;height:56px;}',
        'nav.site-nav .nav-logo{font-family:inherit;font-size:15px;font-weight:500;letter-spacing:0.06em;color:var(--cream,#ede8df);text-decoration:none;white-space:nowrap;}',
        'nav.site-nav .nav-links{display:flex;gap:28px;align-items:center;}',
        'nav.site-nav .nav-links a{font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--cream,#ede8df);text-decoration:none;opacity:0.7;transition:opacity 0.15s;}',
        'nav.site-nav .nav-links a:hover,nav.site-nav .nav-links a.active{opacity:1;color:var(--gold,#c9a84c);}',
        'nav.site-nav .nav-burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px;}',
        'nav.site-nav .nav-burger span{display:block;width:22px;height:2px;background:var(--cream,#ede8df);border-radius:2px;transition:all 0.25s;}',
        '.nav-overlay{display:none;position:fixed;inset:0;z-index:190;background:rgba(0,0,0,0.5);}',
        '.nav-overlay.open{display:block;}',
        '.nav-drawer{position:fixed;top:0;right:-320px;width:300px;height:100%;z-index:210;background:var(--bg,#0c0e10);border-left:1px solid var(--border,#252a30);transition:right 0.3s ease;display:flex;flex-direction:column;}',
        '.nav-drawer.open{right:0;}',
        '.nav-drawer-header{display:flex;justify-content:space-between;align-items:center;padding:0 20px;height:56px;border-bottom:1px solid var(--border,#252a30);}',
        '.nav-drawer .nav-close{background:none;border:none;color:var(--cream,#ede8df);font-size:18px;cursor:pointer;opacity:0.7;}',
        '.nav-drawer-links{display:flex;flex-direction:column;padding:20px;gap:4px;}',
        '.nav-drawer-links a{font-size:13px;letter-spacing:0.07em;text-transform:uppercase;color:var(--cream,#ede8df);text-decoration:none;padding:10px 4px;opacity:0.7;border-bottom:1px solid var(--border,#252a30);}',
        '.nav-drawer-links a:hover{opacity:1;color:var(--gold,#c9a84c);}',
        '@media(max-width:480px){nav.site-nav .nav-links{display:none;}nav.site-nav .nav-burger{display:flex;}}',
      ].join('');
      document.head.appendChild(baseStyle);
      nav = document.createElement('nav');
      nav.className = 'site-nav';
      nav.innerHTML =
        '<a href="/" class="nav-logo">77scenarios.com</a>' +
        '<div class="nav-links"></div>' +
        '<button class="nav-burger" aria-label="Menu"><span></span><span></span><span></span></button>';
      document.body.prepend(nav);

      var overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      overlay.id = 'nav-overlay';
      overlay.onclick = toggleMenu;
      document.body.insertBefore(overlay, nav.nextSibling);

      var drawer = document.createElement('div');
      drawer.className = 'nav-drawer';
      drawer.id = 'nav-drawer';
      drawer.innerHTML =
        '<div class="nav-drawer-header">' +
          '<a href="/" class="nav-logo">77scenarios.com</a>' +
          '<button class="nav-close">&#10005;</button>' +
        '</div>' +
        '<nav class="nav-drawer-links"></nav>';
      document.body.insertBefore(drawer, overlay.nextSibling);

      nav.querySelector('.nav-burger').onclick = toggleMenu;
      drawer.querySelector('.nav-close').onclick = toggleMenu;
    }

    var desktopNav = nav.querySelector('.nav-links');
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
    var authSlot = getNavSlot();

    // Render immediately from cache - no pop-in
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem('77s-auth') || 'null'); } catch(e) {}
    if (cached && cached.loggedIn) {
      authSlot.appendChild(buildPill(cached.username || 'Profile', cached.avatarUrl || ''));
      if (drawerNav) {
        var _da = document.createElement('a');
        _da.href = prefix + '/profile';
        _da.textContent = cached.username || 'Profile';
        _da.style.color = '#c9a84c';
        drawerNav.appendChild(_da);
      }
    } else if (cached && !cached.loggedIn) {
      authSlot.appendChild(buildSignIn());
      if (drawerNav) {
        var _dsi = document.createElement('a');
        _dsi.href = prefix + '/login';
        _dsi.textContent = 'Sign in';
        drawerNav.appendChild(_dsi);
      }
    }
    // No cache yet - show nothing until Supabase responds (first visit only)

    if (!sb) {
      if (!cached) authSlot.appendChild(buildSignIn());
      return;
    }
    sb.auth.getSession().then(function(res) {
      var session = res.data && res.data.session;
      if (session) {
        sb.from('profiles').select('avatar_url,username').eq('id', session.user.id).single()
          .then(function(r) {
            var prof = r.data || {};
            var newCache = {loggedIn:true, username:prof.username||'Profile', avatarUrl:prof.avatar_url||''};
            try { localStorage.setItem('77s-auth', JSON.stringify(newCache)); } catch(e) {}
            // Only update DOM if state changed from cache
            if (!cached || !cached.loggedIn || cached.username !== newCache.username) {
              authSlot.innerHTML = '';
              authSlot.appendChild(buildPill(newCache.username, newCache.avatarUrl));
              if (drawerNav) {
                var existing = drawerNav.querySelector('a[href*="profile"]');
                if (!existing) {
                  var a = document.createElement('a');
                  a.href = prefix + '/profile';
                  a.textContent = newCache.username;
                  a.style.color = '#c9a84c';
                  drawerNav.appendChild(a);
                }
              }
            }
          });
      } else {
        try { localStorage.setItem('77s-auth', JSON.stringify({loggedIn:false})); } catch(e) {}
        if (!cached || cached.loggedIn) {
          authSlot.innerHTML = '';
          authSlot.appendChild(buildSignIn());
          if (drawerNav) {
            var _dsi2 = document.createElement('a');
            _dsi2.href = prefix + '/login';
            _dsi2.textContent = 'Sign in';
            drawerNav.appendChild(_dsi2);
          }
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

  // ── SITE-WIDE SEARCH ────────────────────────────────────────────────────────

  var _srchIdx = null;
  var _srchSel = -1;

  var TYPE_NAMES = {
    INFJ:'The Advocate',INTJ:'The Architect',INFP:'The Mediator',INTP:'The Logician',
    ENFJ:'The Protagonist',ENTJ:'The Commander',ENFP:'The Campaigner',ENTP:'The Debater',
    ISFJ:'The Defender',ISTJ:'The Logistician',ISFP:'The Adventurer',ISTP:'The Virtuoso',
    ESFJ:'The Consul',ESTJ:'The Executive',ESFP:'The Entertainer',ESTP:'The Entrepreneur'
  };

  var VS_SLUGS = [
    'infj-infp','intj-intp','enfp-infp','infj-intj','isfj-infj','enfj-infj','entp-intp','infp-isfp',
    'enfp-enfj','entj-intj','isfj-isfp','enfp-entp','istj-intj','intp-infp','esfj-enfj','isfp-esfp',
    'estp-entp','istp-intp','estj-entj','istp-estp','infj-istj','istj-isfj','enfj-entj','esfp-enfp',
    'entp-entj','infp-enfj','isfp-infj','infj-enfp','estp-estj','istp-istj','esfj-estj','intj-infp',
    'enfp-intj','esfj-isfj','estj-istj','esfp-estp','entp-intj','entj-infp','isfj-estj','enfj-isfj',
    'infj-istp','intp-istj','entj-infj','enfj-intj','isfj-infp','istp-isfj','esfp-infj','intp-infj',
    'infp-istp','estp-infj','entj-isfj','intj-esfp','enfj-istp','intp-esfj','enfp-esfj','infp-estj',
    'intj-isfj','estj-infj','entp-isfj','enfp-istp','enfj-esfj','entp-esfj','isfp-entj','esfp-estj',
    'estp-isfj','isfp-esfj','estp-isfp','esfp-isfj','infp-istj','estp-intj','esfj-istp','entj-esfp',
    'infj-esfj','infp-entp','enfp-estj','esfp-entj','isfp-estj','entp-estp','intp-istp','esfj-intj',
    'enfp-isfp','enfj-estp','enfj-intp','intj-isfp','entp-infj','enfj-estj','enfj-entp','intj-istp',
    'entp-istj','estj-intj','entj-intp','entp-estj','entj-istp','entp-isfp','enfj-istj',
    'enfj-enfp','enfj-infp','entj-entp','esfj-infp','esfp-intp','enfj-isfp'
  ];

  function slugSrch(n) {
    return n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  function buildStaticIndex() {
    var idx = [];
    Object.keys(TYPE_NAMES).forEach(function(t) {
      idx.push({title:t, sub:TYPE_NAMES[t], url:'/types/'+t.toLowerCase(), cat:'type'});
    });
    [{code:'I',name:'Introversion'},{code:'E',name:'Extroversion'},{code:'S',name:'Sensing'},
     {code:'N',name:'Intuition'},{code:'T',name:'Thinking'},{code:'F',name:'Feeling'},
     {code:'J',name:'Judging'},{code:'P',name:'Perceiving'}].forEach(function(l) {
      idx.push({title:l.name+' ('+l.code+')', sub:'Cognitive Letter', url:'/letters/'+l.code.toLowerCase(), cat:'letter'});
    });
    [{code:'Ni',name:'Introverted Intuition'},{code:'Ne',name:'Extroverted Intuition'},
     {code:'Si',name:'Introverted Sensing'},{code:'Se',name:'Extroverted Sensing'},
     {code:'Ti',name:'Introverted Thinking'},{code:'Te',name:'Extroverted Thinking'},
     {code:'Fi',name:'Introverted Feeling'},{code:'Fe',name:'Extroverted Feeling'}].forEach(function(f) {
      idx.push({title:f.code+', '+f.name, sub:'Cognitive Function', url:'/cognitive-functions', cat:'function'});
    });
    VS_SLUGS.forEach(function(slug) {
      var p = slug.split('-');
      idx.push({title:p[0].toUpperCase()+' vs '+p[1].toUpperCase(), sub:'Type Comparison', url:'/vs/'+slug, cat:'vs'});
    });
    return idx;
  }

  function loadIndex(cb) {
    if (_srchIdx !== null) { cb(); return; }
    var idx = buildStaticIndex();
    fetch('/archive').then(function(r){ return r.text(); }).then(function(html) {
      var re = /\{name:`([^`]+)`,ctx:`([^`]+)`,type:'([A-Z]{4})'/g, m;
      while ((m = re.exec(html)) !== null) {
        idx.push({title:m[1], sub:m[3]+' · '+m[2], url:'/character/'+slugSrch(m[1]), cat:'character'});
      }
      _srchIdx = idx; cb();
    }).catch(function(){ _srchIdx = idx; cb(); });
  }

  function runSearch(q) {
    if (!q || !_srchIdx) return [];
    var ql = q.toLowerCase().trim();
    if (!ql) return [];
    var out = [];
    _srchIdx.forEach(function(item) {
      var tl = item.title.toLowerCase(), sl = item.sub.toLowerCase();
      var sc = 0;
      if (tl === ql) sc = 100;
      else if (tl.startsWith(ql)) sc = 85;
      else if (tl.includes(ql)) sc = 65;
      else if (sl.includes(ql)) sc = 35;
      if (sc) out.push({item:item, sc:sc});
    });
    out.sort(function(a,b){ return b.sc - a.sc; });
    return out.slice(0,8).map(function(r){ return r.item; });
  }

  var CAT_COLOR = {type:'#c9a84c',letter:'#6b9080',function:'#8b7bb5',vs:'#4a90a4',character:'#c06040'};
  var CAT_LABEL = {type:'Type',letter:'Letter',function:'Function',vs:'Comparison',character:'Character'};

  function srchSelectResult(i) {
    var items = document.querySelectorAll('#srch-res .srch-item');
    items.forEach(function(el){ el.classList.remove('srch-active'); });
    _srchSel = i;
    if (i >= 0 && items[i]) {
      items[i].classList.add('srch-active');
      items[i].scrollIntoView({block:'nearest'});
    }
  }

  function srchRender(results, q) {
    var res = document.getElementById('srch-res');
    if (!res) return;
    _srchSel = -1;
    if (!q || !q.trim()) { res.style.display = 'none'; res.innerHTML = ''; return; }
    if (!results.length) {
      res.style.display = 'block';
      res.innerHTML = '<div class="srch-empty">No results for "'+q+'"</div>';
      return;
    }
    res.style.display = 'block';
    res.innerHTML = results.map(function(item, i) {
      var col = CAT_COLOR[item.cat] || '#888';
      var lbl = CAT_LABEL[item.cat] || item.cat;
      return '<a class="srch-item" href="'+item.url+'" data-i="'+i+'">' +
        '<span class="srch-cat" style="color:'+col+'">'+lbl+'</span>' +
        '<span class="srch-info">' +
          '<span class="srch-title">'+item.title+'</span>' +
          '<span class="srch-sub">'+item.sub+'</span>' +
        '</span>' +
        '<svg class="srch-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</a>';
    }).join('');
    res.querySelectorAll('.srch-item').forEach(function(a) {
      a.addEventListener('mouseenter', function(){ srchSelectResult(+a.dataset.i); });
    });
  }

  function srchHide() {
    var res = document.getElementById('srch-res');
    if (res) { res.style.display = 'none'; res.innerHTML = ''; }
    _srchSel = -1;
  }

  function injectSearchBar() {
    if (document.getElementById('site-search')) return;

    // CSS - white bar on both dark and light mode
    var s = document.createElement('style');
    s.textContent = [
      '#site-search{background:#0d1117;border-top:1px solid #2a3340;border-bottom:1px solid #2a3340;box-shadow:0 4px 20px rgba(0,0,0,0.5);padding:10px 20px;position:sticky;top:56px;z-index:190;}',
      '#site-search-inner{position:relative;max-width:680px;margin:0 auto;}',
      '#srch-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:#607082;}',
      '#srch-input{width:100%;box-sizing:border-box;background:#161c24;border:1px solid #3a4758;border-radius:8px;padding:9px 74px 9px 33px;font-size:16px;line-height:1.2;color:#ede8df;font-family:inherit;outline:none;transition:border-color 0.15s,background 0.15s;-webkit-appearance:none;appearance:none;}',
      '#srch-input:focus{border-color:#c9a84c;background:#1a2230;}',
      '#srch-input::placeholder{color:#5a6570;}',
      '#srch-input::-webkit-search-cancel-button{display:none;}',
      '#srch-hint{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:10px;color:#3a4858;pointer-events:none;letter-spacing:0.04em;white-space:nowrap;}',
      '#srch-res{display:none;position:absolute;top:calc(100% + 8px);left:0;right:0;background:#0d1219;border:1px solid #2a3848;border-radius:10px;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,0.05),0 20px 56px rgba(0,0,0,0.72);z-index:9999;max-height:min(380px,55vh);overflow-y:auto;-webkit-overflow-scrolling:touch;}',
      '.srch-item{display:flex;align-items:center;gap:10px;padding:10px 14px;min-height:44px;text-decoration:none;border-bottom:1px solid #1e2a36;transition:background 0.08s;}',
      '.srch-item:last-child{border-bottom:none;}',
      '.srch-item.srch-active,.srch-item:hover{background:rgba(201,168,76,0.08);}',
      '.srch-cat{flex:0 0 68px;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;opacity:0.9;}',
      '.srch-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}',
      '.srch-title{font-size:14px;color:#f2ede6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.srch-sub{font-size:11px;color:#607080;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.srch-arrow{color:#2e3540;flex-shrink:0;}',
      '.srch-empty{padding:16px 14px;font-size:13px;color:#50585e;}',
      '@media(max-width:600px){',
        '#site-search{padding:7px 12px;}',
        '#srch-hint{display:none;}',
        '#srch-input{padding-right:14px;}',
        '.srch-cat{flex:0 0 58px;font-size:8.5px;}',
        '.srch-item{padding:10px 12px;}',
        '#srch-res{border-radius:8px;}',
      '}',
    ].join('');
    document.head.appendChild(s);

    // Bar HTML
    var bar = document.createElement('div');
    bar.id = 'site-search';
    bar.innerHTML =
      '<div id="site-search-inner">' +
        '<svg id="srch-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input id="srch-input" type="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Search types, characters, comparisons…">' +
        '<span id="srch-hint">Ctrl+K</span>' +
        '<div id="srch-res"></div>' +
      '</div>';

    // Insert after nav
    var nav = document.querySelector('nav.site-nav');
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(bar, nav.nextSibling);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }

    var input = document.getElementById('srch-input');
    var timer;

    // Input handler
    input.addEventListener('input', function() {
      clearTimeout(timer);
      var q = input.value.trim();
      if (!q) { srchHide(); return; }
      if (_srchIdx === null) {
        var res = document.getElementById('srch-res');
        res.style.display = 'block';
        res.innerHTML = '<div class="srch-empty">Loading…</div>';
        loadIndex(function() { srchRender(runSearch(input.value.trim()), input.value.trim()); });
      } else {
        timer = setTimeout(function() { srchRender(runSearch(q), q); }, 60);
      }
    });

    // Keyboard nav
    input.addEventListener('keydown', function(e) {
      var items = document.querySelectorAll('#srch-res .srch-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        srchSelectResult(Math.min(_srchSel + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (_srchSel > 0) srchSelectResult(_srchSel - 1);
        else { srchSelectResult(-1); input.focus(); }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (_srchSel >= 0 && items[_srchSel]) {
          window.location.href = items[_srchSel].href;
        }
      } else if (e.key === 'Escape') {
        input.value = '';
        srchHide();
        input.blur();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!bar.contains(e.target)) srchHide();
    });

    // Pre-load index silently in background
    loadIndex(function(){});
  }

  // Cmd+K / Ctrl+K focuses the search input
  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      var input = document.getElementById('srch-input');
      if (input) { input.focus(); input.select(); }
    }
  });

  // Inject after nav is ready
  document.addEventListener('DOMContentLoaded', function() { setTimeout(injectSearchBar, 80); });
  if (document.readyState !== 'loading') setTimeout(injectSearchBar, 80);

})();
// ── SMOOTH NAVIGATION ────────────────────────────────────────────────────────
(function() {

  // 1. Cancel entry overlay IMMEDIATELY - kills the black fade-in on page load
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

  // 2. Prefetch pages on hover - page is already cached by click time
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

  // 3. Intercept exit clicks - stop the black overlay exit animation
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
    // Navigate cleanly - no black overlay
    window.location.href = href;
  }, true); // capture phase

})();
