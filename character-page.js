// ─────────────────────────────────────────────
//  77scenarios — Character Page Bootstrap  v1.0
//  Handles reveal animations and avatar loading
//  for individual character HTML pages.
//  Add before </body>:
//  <script src="/character-page.js" defer></script>
// ─────────────────────────────────────────────
(function () {

  // ── REVEAL ANIMATIONS ───────────────────────────
  // Elements with class "r" start at opacity:0 and
  // need class "in" added to become visible.
  function revealElements() {
    var els = document.querySelectorAll('.r');
    els.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('in');
      }, i * 60);
    });
  }

  // ── AVATAR IMAGE LOADING ────────────────────────
  // The hero-avatar <img> has no src; we probe local
  // image files and fall back to a placeholder.
  function loadAvatar() {
    var img = document.getElementById('hero-avatar');
    if (!img) return;

    // Derive slug from the current URL path
    var path = window.location.pathname;
    var ps = path.replace('/character/', '').replace(/\/$/, '');

    var candidates = [
      '/images/characters/' + ps + '.webp',
      '/images/characters/' + ps + '.jpg',
      '/images/characters/' + ps + '.gif'
    ];

    // Extract character type initial for placeholder
    var heroType = document.querySelector('.hero-type');
    var typeInitial = heroType ? heroType.textContent.trim().slice(0, 1) : '?';

    function showPlaceholder() {
      img.outerHTML = '<div class="hero-avatar-placeholder"><span>' + typeInitial + '</span></div>';
    }

    function tryNext(i) {
      if (i >= candidates.length) {
        // All local candidates failed — try Wikipedia as last resort
        var altEl = img.getAttribute('alt');
        if (altEl) {
          tryWikipedia(altEl);
        } else {
          showPlaceholder();
        }
        return;
      }
      var src = candidates[i];
      var probe = new Image();
      probe.onload = function () {
        img.src = src;
        img.onload = function () { img.style.opacity = '1'; };
      };
      probe.onerror = function () { tryNext(i + 1); };
      probe.src = src;
    }

    function tryWikipedia(name) {
      var wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(name.replace(/ /g, '_'));
      fetch(wikiUrl)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var src = data && data.thumbnail && data.thumbnail.source;
          if (src) {
            img.src = src;
            img.onload = function () { img.style.opacity = '1'; };
          } else {
            showPlaceholder();
          }
        })
        .catch(function () {
          showPlaceholder();
        });
    }

    tryNext(0);
  }

  // ── PAGE TRANSITION OVERLAY ─────────────────────
  function cancelOverlay() {
    var ov = document.getElementById('t-overlay');
    if (ov) {
      ov.style.transition = 'opacity 0.45s ease';
      ov.style.opacity = '0';
    }
  }

  // ── INIT ────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      cancelOverlay();
      loadAvatar();
      requestAnimationFrame(revealElements);
    });
  } else {
    cancelOverlay();
    loadAvatar();
    requestAnimationFrame(revealElements);
  }

})();
