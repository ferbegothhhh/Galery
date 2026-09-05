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

## Notes

- Skills/config changes in opencode load on startup — after editing this file, restart opencode for it to take effect.