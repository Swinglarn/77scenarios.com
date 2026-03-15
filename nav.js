(function() {
  var SUPA_URL = 'https://rttomfnfyjjssdqfzkaj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dG9tZm5meWpqc3NkcWZ6a2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODcwMjEsImV4cCI6MjA4ODU2MzAyMX0.0qBogK8xywL77IFYj4IywZIhHyKjbvbVmXYvG6wAZGw';
  var FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23252a30'/%3E%3Ccircle cx='40' cy='32' r='14' fill='%238a6d2e'/%3E%3Cellipse cx='40' cy='72' rx='24' ry='16' fill='%238a6d2e'/%3E%3C/svg%3E";

  // Inject dropdown CSS once
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

  // Close dropdown on outside click
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
    profileLink.href = '/profile';
    profileLink.textContent = 'Profile';

    var settingsLink = document.createElement('a');
    settingsLink.href = '/settings';
    settingsLink.textContent = 'Settings';

    var signOutBtn = document.createElement('button');
    signOutBtn.textContent = 'Sign out';
    signOutBtn.onclick = function() {
      // Use global sb if available, otherwise create our own
      var client = window._navSb || (function() {
        if (window.supabase && window.supabase.createClient) {
          return window.supabase.createClient(SUPA_URL, SUPA_KEY);
        }
        return null;
      })();
      if (client) {
        client.auth.signOut().then(function() {
          window.location.href = '/';
        });
      } else {
        window.location.href = '/';
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
    a.href = '/login';
    a.textContent = 'Sign in';
    a.style.cssText = 'border:1px solid #252a30;padding:7px 16px;border-radius:60px;font-size:0.82rem;color:#ede8df;text-decoration:none;font-family:DM Sans,sans-serif;white-space:nowrap;';
    return a;
  }

  function initNav() {
    var desktopNav = document.querySelector('.nav-links');
    var drawerNav = document.querySelector('.nav-drawer-links');

    // Only run if nav exists and hasn't been set up yet
    if (!desktopNav || desktopNav.dataset.navReady) return;
    desktopNav.dataset.navReady = '1';

    // Get sb from page scope if available
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
        sb.from('profiles')
          .select('avatar_url,username')
          .eq('id', session.user.id)
          .single()
          .then(function(r) {
            var prof = r.data;
            var username = (prof && prof.username) || 'Profile';
            var avatar = (prof && prof.avatar_url) || '';
            desktopNav.appendChild(buildPill(username, avatar));
            if (drawerNav) {
              var a = document.createElement('a');
              a.href = '/profile';
              a.textContent = username;
              a.style.color = '#c9a84c';
              drawerNav.appendChild(a);
            }
          });
      } else {
        desktopNav.appendChild(buildSignIn());
        if (drawerNav) {
          var a = document.createElement('a');
          a.href = '/login';
          a.textContent = 'Sign in';
          drawerNav.appendChild(a);
        }
      }
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
