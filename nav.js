(function () {
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  const links = [
    { href: '/',                    label: 'Take the Test' },
    { href: '/types',               label: '16 Types' },
    { href: '/letters',             label: '8 Letters' },
    { href: '/cognitive-functions', label: 'Functions' },
    { href: '/compatibility',       label: 'Compatibility' },
    { href: '/archive',             label: 'Archive' },
    { href: '/forum',               label: 'Forum' },
    { href: '/about',               label: 'About' },
    { href: '/store',               label: 'Store' },
  ];

  function isActive(href) {
    if (href === '/') return path === '/';
    return path === href || path.startsWith(href + '/');
  }

  const desktopLinks = links
    .map(l => `<a href="${l.href}"${isActive(l.href) ? ' class="active"' : ''}>${l.label}</a>`)
    .join('\n    ');

  const drawerLinks = links
    .map(l => `<a href="${l.href}"${isActive(l.href) ? ' class="active"' : ''}>${l.label}</a>`)
    .join('');

  const html = `
<nav class="site-nav">
  <a href="/" class="nav-logo">77scenarios.com</a>
  <div class="nav-links" id="nav-links">
    ${desktopLinks}
  </div>
  <button class="nav-burger" onclick="toggleMenu()" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="nav-overlay" id="nav-overlay" onclick="toggleMenu()"></div>
<div class="nav-drawer" id="nav-drawer">
  <div class="nav-drawer-header">
    <a href="/" class="nav-logo">77scenarios.com</a>
    <button class="nav-close" onclick="toggleMenu()">&#10005;</button>
  </div>
  <nav class="nav-drawer-links">
    ${drawerLinks}
  </nav>
</div>`;

  const target = document.getElementById('nav');
  if (target) target.innerHTML = html;
})();
