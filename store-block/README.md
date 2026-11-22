# Shared store block (EE-2026-11-20-005)

One store list for every Next-Xus public door, built from the brain's product list so the pages stop drifting apart.

- **Source of truth:** Gumroad listings, as recorded in `Keywebco/nextxus-brain` → `04-builds/products.yaml` (21 live products, verified 2026-10-05). Only title, Gumroad link, and price are copied.
- **No tracking, no cookies, no checkout here.** Every link goes to Gumroad.
- **Free:** plain files on GitHub Pages.

## Files

- `build.py`: regenerates the three files below from `products.yaml`. Run `python3 build.py` (reads the brain's public raw file) or `python3 build.py path/to/products.yaml`. Needs PyYAML.
- `store-block.html`: the static block. Paste it inside a page when the titles must be readable with JavaScript off, or by the health check. Between the `nx-store-block:start` and `end` markers, it is generated; do not hand-edit.
- `store-block.js`: the same list for other sites. Add these two lines where the block should appear:

  ```html
  <div data-nx-store></div>
  <script src="https://next-xus.net/store-block/store-block.js" defer></script>
  ```

  Use `data-nx-store="5"` to show the first five, plus a link to the full store.
- `products.json`: the same data as JSON, for robots and other tools.
- `index.html`: a preview page.

## When a listing changes

1. Update `04-builds/products.yaml` in the brain (by review branch, Roger's yes).
2. Run `build.py` here and commit the three generated files on a review branch.
3. Roger says the merge word.

## Not done yet (each needs Roger's pick)

Adding the block to the Portal homepage, the Commons, the tools door, and the next-xus.biz desktop. Each site is its own small review branch. The Portal's two missing titles are already handled by the EE-002 branch.
