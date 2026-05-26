# AGENTS.md — Syarif Portfolio

## Project structure
```
index.html   → single-page portfolio (sections: hero, about, skills, projects, experience, contact)
style.css    → all styles (dark theme, accent #64ffda, responsive 768px/480px breakpoints)
main.js      → particles, custom cursor, typing effect, scroll animations, counter, hamburger menu
```

## Serving
No build step, no package manager. Open `index.html` in a browser directly, or use any static file server (e.g. `python3 -m http.server 8000`, `npx serve .`).

## Dependencies (all via CDN in index.html `<head>`)
- Font Awesome 6.5.0 (icons)
- Google Fonts: Inter (400–800)
- particles.js 2.0.0 (loaded via `<script>` before main.js)

## Key implementation notes
- Custom cursor: `.cursor` + `.cursor-follower` elements; hidden on mobile (`display: none` at 768px)
- Particles.js background: renders on `#particles-canvas` fixed element; guarded by `typeof particlesJS !== 'undefined'` — will silently skip if CDN fails
- Scroll animations: `.fade-in` elements observed via `IntersectionObserver` (threshold 0.15, rootMargin -50px); class `visible` triggers CSS transition
- Typing effect cycles through 4 phrases on `.typing-text`
- Skill bars animate width on scroll via a second `IntersectionObserver` (resets to 0% then applies stored width)
- Counter animation animates `.stat-num` elements using `data-target` attribute
- Nav hamburger toggles `.nav-links.active` class on mobile
- Scroll behavior: `scroll-behavior: smooth` on `<html>`

## Style conventions
- Background: `#0a0a0a`, text: `#e0e0e0`, accent: `#64ffda`
- Monospace numbers/section labels use `'SF Mono', 'Fira Code', monospace`
- Glassmorphism: `background: rgba(...)` + `backdrop-filter: blur(...)` on cards/nav
- All interactive elements have `cursor: none` (custom cursor replaces default)
- `section { padding: 120px 0 }` with 80px on mobile
