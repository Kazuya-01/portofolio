# AGENTS.md — Syarif Portfolio

Single-page portfolio (`index.html` + `style.css` + `main.js`).  
No build step, no package manager — open directly or serve with any static server.

## CDN deps
- **Font Awesome 6.5.0**, **Google Fonts** (Inter 400–800, M PLUS Rounded 1c) — loaded in `<head>`.
- **particles.js 2.0.0** — loaded at end of `<body>` (`index.html:484`). Guarded by `typeof particlesJS !== 'undefined'`; silently skips if CDN fails.

## JS behaviors
- **Particles canvas** (`#particles-canvas`, fixed positioning, `z-index: 0`). Render only runs when CDN loaded.
- **Custom cursor** (`.cursor` + `.cursor-follower`): JS initializes only when `innerWidth > 768` (`main.js:38`). CSS sets `display: none` at 768px breakpoint. Both `<body>` and all interactive elements use `cursor: none`.
- **Typing effect** on `.typing-text` (`main.js:67`): cycles through `['Laravel & PHP.', 'React Native.', 'Anime & Code.', 'Database & API.']`.
- **Scroll animations**: two `IntersectionObserver` instances — `.fade-in` (threshold 0.15, rootMargin `0px 0px -50px 0px`), `.fade-in-stagger` with staggered transition delays (0.1s, 0.3s, 0.5s). On `window.load`, already-visible elements get `.visible` immediately.
- **Skill bars**: separate observer (threshold 0.3) resets `.skill-fill` to `0%`, then restores stored width after 200ms. `.skill-card` fade-in has staggered delays (0s–0.45s).
- **Counter** (`.stat-num`): animates via `data-target`; single-fire (unobserves after start). `data-target="auto-projects"` counts `.project-card` elements. `data-no-plus` attribute omits the `+` suffix.
- **Hamburger**: toggles `.nav-links.active` + `.nav-overlay.active` + `.hamburger.spin` + icon swap (fa-bars ↔ fa-times). All three close on overlay click or nav-link click.
- **Scroll progress bar** (`.nav-progress`): width updated on `scroll` as percentage of document height.

## Style
- CSS custom properties: `--bg: #0a0e17`, `--accent: #ff4757`, `--accent-secondary: #ffc048`, `--accent-tertiary: #536dfe`, `--text: #e2e8f0`
- Headings: `'M PLUS Rounded 1c', sans-serif`; monospace: `'SF Mono', 'Fira Code', monospace`
- Glassmorphism: `background: rgba(...)` + `backdrop-filter: blur(...)`
- `section { padding: 120px 0 }`, shrinks to `60px 0` at 480px
- `<html lang="id">` — site content is Indonesian
- Avatar: `img/Avatar.jpeg`
- Scroll indicator (`.scroll-indicator`): `display: none` by default, `display: flex` at ≤768px
- Hero name uses gradient text via `background-clip: text`
