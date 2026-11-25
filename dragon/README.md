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
- `index.html` — the page: featured companion, question box, dragon roster.
- `dragon.css` — the look (no web fonts, no outside assets).
- `config.js` — the names.
- `companion.js` — voice (browser speech only), questions, microphone.
- `img/` — the pictures, all stored here (nothing is hotlinked).

## Rules this page keeps
- No API keys, no server, no paid AI. Voice is the browser's own speechSynthesis.
- 73 Sacred Directives (DIR-000, the Truth Gate, above them and not counted).
- Links only to next-xus.net, next-xus.org, next-xus.com and next-xus.info,
  plus the YouTube source of Roger's sayings.
