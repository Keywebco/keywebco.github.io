# The Dragons of the Next-Xus Federation (`/dragon/`)

Live path once merged: https://next-xus.net/dragon/

## Change a dragon's name
Open `config.js`. The featured, talking companion is the line
`var FEATURED_DRAGON = "Aether";` — change only the word in quotes
(for example to `"Vortyx"` or `"Draco"`). The other dragons are in
`DRAGON_NAMES`. With JavaScript on, every visible name, the page title,
the image descriptions, the screen-reader labels and the spoken lines
follow the config. (With JavaScript off, the page shows the names
written into `index.html`; update those too if a name changes for good.)

## What is here
- `index.html` — the page: featured companion, question box, Aether
  gallery, and the dragon roster.
- `dragon.css` — the look for this page (no web fonts). The shared
  Federation bar and colours come from `/federation-ui/`.
- `config.js` — the names.
- `companion.js` — voice (browser speech only), questions, microphone.
- `img/` — the pictures and Aether greeting films, all stored here
  (nothing is hotlinked, and nothing depends on a muse.ai share link).

## Aether gallery
Pontus rebuilt a richer Aether page with many pictures and films.
This folder keeps Aether's new stills and three greeting films, folded
into this page rather than published as a second site.

Other films from that page, and proposed names such as Keeper of
Infinite Lore, Aetherion, Codex Draconis, Draconis Sapientia, and
Astralis Voraleth, are not in this roster. They wait on Roger's word.
If those films are added later, put them on a free GitHub release
(the same pattern as the music player), because together they are
about 48 megabytes.

## Rules this page keeps
- No API keys, no server, no paid AI. Voice is the browser's own speechSynthesis.
- 73 Sacred Directives (DIR-000, the Truth Gate, above them and not counted).
- Links only to next-xus.net, next-xus.org, next-xus.com, next-xus.info and
  next-xus.biz, plus the YouTube source of Roger's sayings.
- The shared look is loaded from `/federation-ui/theme.css` and
  `chrome.js`.
