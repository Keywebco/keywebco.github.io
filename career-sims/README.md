# Next-Xus Career Sims

Free Sims of everyday careers, each with a small brain file anyone can download and keep (JSON and YAML). Live at https://next-xus.net/career-sims/ (served by GitHub Pages from this repository's `career-sims/` folder).

Approved by Roger Keyserling, spoken yes, 2026-11-20 6:34 PM CT. Recorded in `Keywebco/nextxus-brain` as PROPOSAL-2026-11-20-002.

**These are simulations, not professionals.** Every Sim says so, defers to licensed humans, and carries extra safety rules for medical, mental-health, legal, financial, and hands-on safety roles.

## What is here

| Path | What it is |
|---|---|
| `index.html` | Gallery: one card per Sim with Open and chat, Download brain (JSON), Download brain (YAML), and Copy ready prompt. |
| `sim.html?id=<id>` | Chat page. It is the AI Minds Lab companion engine (Val Companion v2, `Keywebco/nextxus-ai-minds-lab`) generalized to load any brain. Memory (Echo state plus a never-deleted archive) stays in the browser, with Export and Import. |
| `make.html` | Make your own Sim: a rule-based brain writer in the browser (no AI, no server). |
| `brains/*.json` | The brain files (source of truth). `brains/*.yaml` are generated twins. |
| `schema/sim-brain.schema.json` | JSON Schema for `nextxus.sim-brain/1`, a superset of the AI Minds Lab identity packet. |
| `canon/sacred-directives.json` | Byte-for-byte copy of `Keywebco/nextxus-brain` `directives/sacred-directives.json` at the pinned commit. Never edit it. |
| `canon/PIN.json` | The pin: commit and SHA-256. |
| `catalog.json` | Generated index with file hashes. |
| `tools/brains.py` | `build` writes YAML twins and the catalog; `check` validates everything. |

CI: `.github/workflows/career-sims-validate.yml` runs `tools/brains.py check` on every push and pull request that touches `career-sims/`.

## How chat works

1. **Offline (default).** No AI is called. Copy ready prompt gives a full prompt (role, safety rules, and the exact wording of DIR-000 and the Sim's chosen directives, read from the pinned canon after a hash check) to paste into any AI or a local model.
2. **Your own AI.** Any OpenAI-compatible address, such as a local model. No key is ever stored in the page.
3. **Roger Sim relay.** The neutral `POST /proxy/sim` route on `Keywebco/roger-sim-api` uses only the brain's persona, never Roger Sim's own prompt. The page checks `GET /proxy/sim` and shows "coming soon" until that route is deployed.

## Canon rules

- Brains reference directives by ID only (`DIR-000` is the 95% Truth Gate; `DIR-001` to `DIR-073`). They never copy or reword directive text. CI fails a brain that copies directive wording or names an unknown ID.
- The official list lives in `Keywebco/nextxus-brain/directives/`. The sealed Cathedral file `00-immutable/directives.yaml` is the wording authority and is never touched here.
- To re-pin: copy the new file from `nextxus-brain` at a commit, update `canon/PIN.json` and every brain's `canon` block, run `python3 career-sims/tools/brains.py build` then `check`.

## Adding a Sim

Write `brains/<id>.json` fresh (do not copy other Sim rosters), run `build` then `check`, and commit all changed files together.
