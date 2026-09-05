---
name: scrapbook-galery
description: Use when working on the Galery scrapbook web (C:\Users\LENOVO\Galery) or building similar romantic polaroid/music single-page sites ("galery", "scrapbook", "polaroid", "foto galeri", "music page"). Captures the site's design tokens, ES5 JS conventions, and component/reveal/upload/marquee patterns.
---

# Scrapbook Galery (C:\Users\LENOVO\Galery)

Single-page romantic "scrapbook" website. Static, no build step, no framework.
UI text is in Indonesian.

Structure:

- `index.html` — page sections.
- `style.css` — all styling, sections separated by `/* ---------- ... ---------- */` comments.
- `script.js` — one ES5 IIFE (`(function(){ ... })()`).
- `music.mp3` — background music loop.
- `photos/` — directory is NOT used by the JS; photos are chosen by the visitor via file input.

## JavaScript conventions

- ES5 only: `var`, `function`, old-school string concat. No `const`, `let`, arrow functions, template literals.
- DOM is built by appending elements/strings in script.
- Page flow currently: hero (big name) → divider → `.two-col` (playlist | photo grid) → divider + bloom flower → dedication envelope → closing polaroid → divider → bottom marquee "kita, galery".
- `.wrap` centers content (max-width 760px, 20px side padding). `.two-col` is full-bleed via `margin: 40px calc(50% - 50vw) 0; padding: 0 20px;` so the two columns reach the screen edges.

## Design tokens

- Fonts: `'Dancing Script'` (cursive, titles) + `'Quicksand'` (body), loaded from Google Fonts.
- CSS variables in `:root`:
  - `--bg: #fffaf7`, `--paper: #ffffff`
  - `--ink: #4a373c`, `--ink-soft: #7d6367`
  - `--blush: #f7dde2`, `--blush-2: #fbeff1`
  - `--rose: #cf8a97`, `--rose-deep: #b3697a`
  - `--gold: #d8b48c`, `--tape: #f1c9bd`
  - `--shadow` / `--shadow-hover` rose-tinted shadows

## Page components & behavior (as built)

- **Curtain**: fixed overlay, `.open` slides up after ~1.8s, starts background music on first click.
- **Background music**: `<audio id="bgMusic" src="music.mp3" loop>`, mute button toggles `bgMusic.muted`, persisted in `localStorage["galeryMuted"]`.
- **Hero**: full-viewport (`min-height: 100vh/100svh`, flex centered); `h1` name uses `clamp(3.4rem, 12vw, 7rem)`.
- **`.two-col`**: grid 2 equal columns, `gap: 56px`, `align-items: start`; right column has a dashed separator (`border-left`). Stacks to 1 column under 820px (separator removed).
- **Playlist**: rendered from a JS array (`title`/`artist`) into grid `repeat(2, minmax(0,1fr))`; each `.music-card` shows icon + title/artist + number. Reveal on scroll via `.music-card.is-visible`.
- **Photo upload pattern**: each `.polaroid` contains a hidden `<input type="file">` inside a `<label>`. On change, `FileReader` sets `background-image` on `.photo-inner` and adds `.has-image` (hides the hint). This pattern is reused in the photo grid, the final polaroid, and the marquee strips. Reasonably-sized images only; keep IDs unique.
- **Photo grid** (right side of `.two-col`): grid `repeat(2, auto)`, `justify-content: center`, gap 14px, polaroid width ~190px (mobile 140px). Slot captions come from the `photoCaptions` array (currently 6).
- **Scroll reveal**: one `IntersectionObserver` adds `.is-visible` to `.entry` and `.music-card` targets (staggered by index). `.entry` starts `opacity:0; translateY(28px)`. For `.entry` used inside grid cells, keep `max-width: none` so the 72% cap does not shrink columns.
- **Bloom flower**: SVG flower (`.bloom-flower`), `.bloomed` triggers petal "mekar": petals hinge from base (`transform-origin: 50% 95%`), start `scale(0) rotate(var(--p-rot))`, springy cue `cubic-bezier(.18,1.6,.3,1)`, staggered via `--p-rot` per `nth-child`. A glow ring via `.bloom-flower::before`. `burstBloom(flower)` spawns ~24 `.bloom-burst` particles (`✿🌸✦❀✧`) flying outward with `--bx/--by/--br`, removed after ~1.8s.
- **Dedication envelope**: click toggles `.open`, slides flap up, letter pops, and `burstHearts()` fires ~80 heart glyphs (`♡❤♥`) using `--hx/--hy/--hr`.
- **Bottom marquee** (id `marqueeRight` / `marqueeLeft`, ".kita, galery"): two horizontal strips, each 5 polaroids, content duplicated 2× for a seamless loop driven by `requestAnimationFrame`. Right strip scrolls content right (`scrollLeft -= 0.6`, wraps at `<= 0` by adding half width); left strip scrolls left (`+= 0.6`, wraps at half width). Pause while hovered/touched (`paused` per strip). Polaroid width ~230px (mobile 170px).
- **Background FX** (all `pointer-events: none`, low z-index): floating hearts (`.floating-heart`), falling petals (`.petal`), twinkling sparkles (`.sparkle`), watermark text, fixed floral deco SVGs.
- **`prefers-reduced-motion: reduce`** is honored (global animation/transition clamp) — keep new animations safe under it.

## Editing workflows

- Photo captions and playlist entries are data arrays at the top of `script.js`, not hardcoded HTML.
- When adding a new polaroid field, follow the label+hidden-input pattern so the upload preview handler keeps working.
- `photos/` is not wired to the DOM; if a static gallery is ever requested, the HTML/JS must load images from that folder explicitly.

## Known limitations & edge cases

- **Uploaded photos are not persisted.** `FileReader` sets `background-image` in memory only — nothing is written to `localStorage`, a server, or disk. A page refresh clears every uploaded photo back to its empty hint state. If persistence is ever requested, this needs an explicit storage layer (e.g. `localStorage` with base64, or an upload endpoint) — don't assume the current pattern survives reload.
- **Marquee wrap math is width-dependent.** Both strips duplicate their content 2× and reset `scrollLeft` at "half width," so if a polaroid's width, gap, or count changes, the half-width calculation in `script.js` must be updated too or the loop will visibly jump/stutter.
- **z-index stacking order matters.** Curtain sits above everything; background FX (hearts/petals/sparkles/watermark) must stay `pointer-events: none` and below content, or they'll block clicks on polaroids/envelope/mute button. Check stacking whenever a new fixed/absolute layer is added.
- **`IntersectionObserver` root margins aren't specified in this doc** — check `script.js` directly before assuming when `.is-visible` fires relative to viewport edges; this affects how "early" the reveal/stagger feels.
- **Curtain click also starts music** — any new full-screen overlay or click target added early in the page flow should not accidentally intercept or duplicate this first-click handler.
- **File input reuse across slots** — each `.polaroid` needs a unique input `id`; copy-pasting a slot without renaming the id will make two slots fight over the same file picker.

## Performance & image guidance

- Since photos are visitor-uploaded (not pre-optimized), don't add client-side resizing/compression unless asked — but do warn users in-app (or in captions) if a very large image visibly slows the page.
- Prefer square or near-square source photos for polaroid slots (`.photo-inner` is cropped via `background-size: cover`); odd aspect ratios will crop unpredictably at the ~190px (mobile ~140px) slot size.
- Keep `music.mp3` reasonably compressed (looping background track, not a full-quality single) since it loads on first paint alongside the curtain.
- Background FX (floating hearts, petals, sparkles) should stay CSS-driven (transform/opacity animations), not JS-driven per-frame DOM writes, to avoid jank alongside the marquee's `requestAnimationFrame` loop.

## Accessibility notes

- `prefers-reduced-motion: reduce` is already honored globally — any new animation (new bloom variants, new burst effects, etc.) must also be covered by that clamp, not just the original set.
- Curtain & envelope divs are interactive via keyboard: `role="button"`, `tabindex="0"`, `aria-label`, and `Enter`/`Space` keydown handlers (share the same handlers as click). The mute button is a native `<button>` with `aria-pressed`. `:focus-visible` outlines are styled in `style.css`. Keep these attributes if you touch those elements.
- File-input labels (`<label>` wrapping hidden `<input type="file">`) are keyboard-reachable by default — don't replace them with a plain `<div onclick>` or that accessibility is lost.
- Decorative SVGs (`.floral-deco`, bloom flowers) and background FX elements carry `aria-hidden="true"` — keep it on new decorative layers.

## Quick reference: editing content

- **Playlist entries** — edit the `title`/`artist` array at the top of `script.js`; the grid and `.music-card` reveal stagger will pick up array order automatically.
- **Photo captions** — edit the `photoCaptions` array (currently 6 entries) at the top of `script.js`; keep it in sync with the number of `.polaroid` slots in the grid.
- **Adding a new photo slot** — copy an existing `.polaroid` block (label + hidden file input + `.photo-inner` + hint), give the input a new unique `id`, and add a matching caption to `photoCaptions`.
- **Colors/fonts** — all in the `:root` CSS variables in `style.css`; change tokens there rather than hardcoding new colors inline.
- **Hero name** — the `h1` text directly in `index.html`'s hero section.
- **Dedication letter text** — inside the envelope markup in `index.html`; keep it short enough to fit the popped-letter layout at mobile widths.

## Notes

- Skills/config changes in opencode load on startup — after editing this file, restart opencode for it to take effect.