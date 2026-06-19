# AGENTS.md — Syarif Portfolio

Single-page portfolio. No build step, no package manager. Open `index.html` directly or serve with any static file server.

## Dependencies (all CDN, loaded in `<head>`)
- Font Awesome 6.5.0, Google Fonts Inter 400–800 + M PLUS Rounded 1c, particles.js 2.0.0

## JS behaviors agents commonly miss
- Particles.js renders on `#particles-canvas` (fixed). Guarded by `typeof particlesJS !== 'undefined'` — silently skips if CDN fails.
- Custom cursor: `.cursor` + `.cursor-follower`. JS only initializes on `innerWidth > 768`. Both get `display: none` at 768px breakpoint (CSS). Body and all interactive elements use `cursor: none`.
- Typing effect: cycles through `words` array on `.typing-text` (`main.js:67`). Words: `['Laravel & PHP.', 'React Native.', 'Anime & Code.', 'Database & API.']`
- Scroll animations: `.fade-in` observed via `IntersectionObserver` (threshold 0.15, rootMargin `0px 0px -50px 0px`). On `window.load`, already-visible `.fade-in` elements also get `.visible` applied immediately.
- Skill bars: separate `IntersectionObserver` (threshold 0.3) resets `.skill-fill` to `0%` then applies stored width after 200ms.
- Counter: `.stat-num` elements animated via `data-target` attribute, single fire (unobserve after start). Special value `data-target="auto-projects"` counts `.project-card` elements dynamically.
- Hamburger toggles `.nav-links.active` + `.nav-overlay.active`. Both close on overlay click or nav link click.

## Style conventions
- CSS custom properties driven: `--bg: #0a0e17`, `--accent: #ff4757` (red, not green), `--accent-secondary: #ffc048`, `--accent-tertiary: #536dfe`, `--text: #e2e8f0`
- Headings use `'M PLUS Rounded 1c', sans-serif`; monospace labels use `'SF Mono', 'Fira Code', monospace`
- Glassmorphism cards: `background: rgba(...)` + `backdrop-filter: blur(...)`
- `section { padding: 120px 0 }`, 80px on 480px breakpoint
- `<html lang="id">` — site content is in Indonesian
- Avatar image: `img/Avatar.jpeg`
- Scroll indicator (`.scroll-indicator`) is hidden by default (`display: none`), only visible on mobile via `@media (max-width: 768px) { display: flex; }`
- Hero name uses gradient text (`background-clip: text`)
