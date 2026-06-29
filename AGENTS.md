# AGENTS.md — Syarif Portfolio

Static single-page portfolio with AI chatbot: `index.html` + `style.css` + `main.js` + `img/Avatar.jpeg` + `functions/chat.js`.  
No build step, no package manager. Static files open directly; chatbot requires Cloudflare Pages deploy.

## CDN dependencies (loaded from `<head>` and end of `<body>`)
- **Font Awesome 6.5.0**, **Google Fonts** (Inter 400–800, M PLUS Rounded 1c)
- **particles.js 2.0.0** — guarded by `typeof particlesJS !== 'undefined'`; silently skips if CDN fails

## JS behaviors (all in `main.js`)
- **Particles canvas** — `#particles-canvas`, fixed overlay at `z-index: 0`, only rendered when CDN loaded
- **Custom cursor** — `.cursor` + `.cursor-follower`; JS initializes only when `innerWidth > 768`. CSS hides at 768px breakpoint. Both `<body>` and all interactive elements use `cursor: none`
- **Typing effect** — `.typing-text` cycles: `['Laravel & PHP.', 'React Native.', 'Anime & Code.', 'Database & API.']`
- **Scroll animations** — two `IntersectionObserver` instances: `.fade-in` (threshold 0.15), `.fade-in-stagger` (staggered delays 0.1s/0.3s/0.5s). Already-visible elements get `.visible` on `window.load`
- **Skill bars** — separate observer resets to `0%` then restores stored width after 200ms; `.skill-card` stagger delays 0s–0.45s
- **Counter** — `.stat-num` animates via `data-target`; single-fire (unobserves after start). `data-target="auto-projects"` counts `.project-card` elements; `data-no-plus` omits `+` suffix
- **Hamburger** — toggles `.nav-links.active` + `.nav-overlay.active` + `.hamburger.spin` + `fa-bars` ↔ `fa-times`. Closes on overlay click or nav-link click
- **Scroll progress bar** — `.nav-progress` width updated as percentage of document height
- **Chatbot Kuro** — `MAX_CHAT = 5` limit per session; disables input + hides toggle button when exhausted. Sends conversation history to `/chat` (Cloudflare Pages Function). Chat toggle disappears after limit reached.

## Cloudflare Pages Function (`functions/chat.js`)
- No npm dependencies (uses Workers runtime with native `fetch`)
- Proxies to Gemini 2.5 Flash with system prompt containing Syarif's bio, skills, projects, experience
- **Required env var**: `GEMINI_API_KEY` — get from [Google AI Studio](https://aistudio.google.com/)
- Set via Cloudflare dashboard: project → Settings → Environment Variables

## Deploy to Cloudflare Pages
```bash
# Install Wrangler (once)
npm i -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy . --branch main --project-name portofolio-syarif

# Set env var
wrangler pages secret put GEMINI_API_KEY --project-name portofolio-syarif
```
Or connect Git repo on [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → Create a project → Connect Git.

## Style conventions
- CSS custom properties: `--bg: #0a0e17`, `--accent: #ff4757`, `--accent-secondary: #ffc048`, `--accent-tertiary: #536dfe`, `--text: #e2e8f0`
- Headings: `'M PLUS Rounded 1c', sans-serif`; monospace: `'SF Mono', 'Fira Code', monospace`
- Hero name: gradient text via `background-clip: text`
- Glassmorphism: `background: rgba(...)` + `backdrop-filter: blur(...)`
- `section { padding: 120px 0 }` → `60px 0` at 480px
- Scroll indicator (`.scroll-indicator`): `display: none` by default, `display: flex` at ≤768px
- `<html lang="id">` — site content is Indonesian
