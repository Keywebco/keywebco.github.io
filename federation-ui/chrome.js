/* Next-Xus Federation shared chrome: one top bar and one footer for every site.
   Served from https://next-xus.net/federation-ui/chrome.js
   Zero dependencies, no tracking, no network calls. Pair it with theme.css.
   Optional: <body data-nx-site="home|codex|dragons|music|business|info">
   marks the current site. Without it the site is worked out from the address.
   Add data-nx-chrome="off" to <body> (or ?embed=1 in the address) to skip it. */
(function () {
  'use strict';
  if (window.__nxChrome) return;
  window.__nxChrome = true;

  var LINKS = [
    { id: 'home',     label: 'Home',     href: 'https://next-xus.net/' },
    { id: 'codex',    label: 'Codex',    href: 'https://next-xus.org/' },
    { id: 'dragons',  label: 'Dragons',  href: 'https://next-xus.net/dragon/' },
    { id: 'music',    label: 'Music',    href: 'https://next-xus.net/nextxus-music/' },
    { id: 'business', label: 'Business', href: 'https://next-xus.biz/' },
    { id: 'info',     label: 'Info',     href: 'https://next-xus.info/' }
  ];
  var FOOT_EXTRA = [
    { label: 'Living Library', href: 'https://next-xus.org/library/' },
    { label: 'System Directory', href: 'https://next-xus.info/federation-directory.html' },
    { label: 'Code on GitHub', href: 'https://github.com/Keywebco' },
    { label: 'Contact', href: 'mailto:keywebco@gmail.com' }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function currentSite(body) {
    var forced = body.getAttribute('data-nx-site');
    if (forced) return forced;
    var h = location.hostname.replace(/^www\./, '');
    var p = location.pathname;
    if (h === 'next-xus.org') return 'codex';
    if (h === 'next-xus.biz') return 'business';
    if (h === 'next-xus.info') return 'info';
    if (h === 'next-xus.net' || h === 'keywebco.github.io') {
      if (p.indexOf('/dragon/') === 0) return 'dragons';
      if (p.indexOf('/nextxus-music/') === 0) return 'music';
      if (p === '/' || p === '/index.html') return 'home';
    }
    return '';
  }

  function findMain() {
    var m = document.querySelector('main');
    if (!m) return null;
    if (!m.id) m.id = 'nx-main';
    return m;
  }

  function build() {
    var body = document.body;
    if (!body) return;
    if (body.getAttribute('data-nx-chrome') === 'off') return;
    try { if (new URLSearchParams(location.search).get('embed') === '1') return; } catch (e) {}
    if (body.classList.contains('embed')) return;
    if (document.querySelector('.nx-bar.nx-js')) return;

    var site = currentSite(body);
    var main = findMain();

    // Skip link: reuse the page's own one if it has it, otherwise make one.
    var skip = null;
    var anchors = body.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      if (/skip/i.test(anchors[i].textContent) && /main|content/i.test(anchors[i].textContent + anchors[i].getAttribute('href'))) { skip = anchors[i]; break; }
    }
    if (!skip && main) {
      skip = document.createElement('a');
      skip.href = '#' + main.id;
      skip.textContent = 'Skip to main content';
    }
    if (skip) skip.classList.add('nx-skip');

    var items = LINKS.map(function (l) {
      var cur = l.id === site ? ' aria-current="page"' : '';
      return '<li><a href="' + esc(l.href) + '"' + cur + '>' + esc(l.label) + '</a></li>';
    }).join('');

    var bar = document.createElement('div');
    bar.className = 'nx-bar nx-js';
    bar.innerHTML =
      '<nav class="nx-bar-inner" aria-label="Next-Xus Federation">' +
        '<a class="nx-brand" href="https://next-xus.net/"><span class="nx-mark" aria-hidden="true">NX</span>Next-Xus Federation</a>' +
        '<button type="button" class="nx-toggle" aria-expanded="false" aria-controls="nx-links">Menu</button>' +
        '<ul class="nx-links" id="nx-links">' + items + '</ul>' +
      '</nav>';

    body.insertBefore(bar, body.firstChild);
    if (skip) body.insertBefore(skip, bar);

    var toggle = bar.querySelector('.nx-toggle');
    function setOpen(open) {
      bar.classList.toggle('nx-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close menu' : 'Menu';
    }
    toggle.addEventListener('click', function () { setOpen(!bar.classList.contains('nx-open')); });
    bar.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && bar.classList.contains('nx-open')) { setOpen(false); toggle.focus(); }
    });

    var foot = document.createElement('div');
    foot.className = 'nx-foot';
    foot.setAttribute('role', 'region');
    foot.setAttribute('aria-label', 'Next-Xus Federation footer');
    var footLinks = LINKS.concat(FOOT_EXTRA).map(function (l) {
      return '<li><a href="' + esc(l.href) + '">' + esc(l.label) + '</a></li>';
    }).join('');
    foot.innerHTML =
      '<div class="nx-foot-inner">' +
        '<div><p class="nx-foot-brand">Next-Xus HumanCodex Federation</p>' +
        '<p class="nx-foot-motto">Truth Before Comfort. Own your code.</p>' +
        '<p>Free, open and static. No subscriptions. No tracking.</p></div>' +
        '<ul>' + footLinks + '</ul>' +
      '</div>';
    body.appendChild(foot);

    // Remove the no-JavaScript fallback bar if a page included one outside <noscript>.
    var fallback = body.querySelectorAll('.nx-bar:not(.nx-js)');
    for (var j = 0; j < fallback.length; j++) fallback[j].parentNode.removeChild(fallback[j]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
