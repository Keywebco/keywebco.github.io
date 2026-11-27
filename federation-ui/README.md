# Next-Xus Federation UI

One shared look for every Next-Xus site: one top bar, one footer, one set of colours. It is free, static, and has no tracking.

**Add it to any Next-Xus page in 3 lines:**

1. In `<head>`, add `<link rel="stylesheet" href="https://next-xus.net/federation-ui/theme.css">`
2. Just before `</body>`, add `<script src="https://next-xus.net/federation-ui/chrome.js" defer></script>`
3. Change `<body>` to `<body class="nx-theme" data-nx-site="home">`. Use `home`, `codex`, `dragons`, `music`, `business` or `info` to mark which link is the current site.

Notes:
- Make sure the page has one `<main>` element. The script adds a "Skip to main content" link to it, or reuses the page's own skip link.
- If JavaScript is off, the page can show the same links with the `<noscript>` block used in `next-xus.net/index.html`.
- To turn the bar and footer off on one page, add `data-nx-chrome="off"` to `<body>`. Embedded pages (`?embed=1`) skip them on their own.
- Tokens use the `--nx-` prefix (for example `--nx-gold` and `--nx-surface`), and components use `.nx-` classes (`.nx-card`, `.nx-btn`, `.nx-btn--ghost`, `.nx-wrap`), so they never clash with a site's own CSS.
- The link list lives in one place, `chrome.js`. Change it there and every site updates.
