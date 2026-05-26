# AGENTS.md — Syarif Portfolio

Single-page portfolio. No build step, no package manager. Open `index.html` directly or serve with any static file server.

## Dependencies (all CDN, loaded in `<head>`)
- Font Awesome 6.5.0, Google Fonts Inter 400–800, particles.js 2.0.0

## JS behaviors agents commonly miss
- Particles.js renders on `#particles-canvas` (fixed). Guarded by `typeof particlesJS !== 'undefined'` — silently skips if CDN fails.
- Custom cursor: `.cursor` + `.cursor-follower`. JS only initializes on `innerWidth > 768`. Both get `display: none` at 768px breakpoint (CSS). Body and all interactive elements use `cursor: none`.
- Typing effect: cycles through `words` array on `.typing-text`. Defined inline in `main.js:67`.
- Scroll animations: `.fade-in` observed via `IntersectionObserver` (threshold 0.15, rootMargin `0px 0px -50px 0px`). On `window.load`, already-visible `.fade-in` elements also get `.visible` applied immediately.
- Skill bars: separate `IntersectionObserver` (threshold 0.3) resets `.skill-fill` to `0%` then applies stored width after 200ms.
- Counter: `.stat-num` elements animated via `data-target` attribute, single fire (unobserve after start).
- Hamburger toggles `.nav-links.active` + `.nav-overlay.active`. Both close on overlay click or nav link click.

## Style conventions
- Background `#0a0a0a`, text `#e0e0e0`, accent `#64ffda`
- Monospace labels: `'SF Mono', 'Fira Code', monospace`
- Glassmorphism cards: `background: rgba(...)` + `backdrop-filter: blur(...)`
- `section { padding: 120px 0 }`, 80px on 480px breakpoint
- `<html lang="id">` — site content is in Indonesian
- Avatar image: `img/Avatar.jpeg`
- Scroll indicator is hidden by default, only visible on mobile (<768px)
- Hero name uses gradient text (`background-clip: text`)
