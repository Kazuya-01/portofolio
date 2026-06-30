# AGENTS.md — Syarif Portfolio

Static single-page portfolio with ChatGPT-like Kuro AI chatbot.  
Zero build step, zero package manager. Open `index.html` directly in browser; chatbot requires Cloudflare Pages deploy.

## Files
- `index.html` + `style.css` + `main.js` + `img/Avatar.jpeg` + `functions/chat.js`
- `.gitignore` covers `.env*` and `.wrangler/`
- SEO meta tags (`og:title`, `og:description`, `og:image`, `twitter:card`) in `<head>`

## CDN dependencies
- **Font Awesome 6.5.0** — loaded in `<head>`
- **Google Fonts** (Inter 400–800, M PLUS Rounded 1c) — loaded in `<head>`
- **particles.js 2.0.0** — loaded at end of `<body>`; guarded by `typeof particlesJS !== 'undefined'` — silently skips if CDN fails

## JS behaviors (all in `main.js`)
- **Theme toggle** — `.theme-toggle` in nav switches `data-theme` on `<html>`. Persists to `localStorage` key `kuro_theme`. Moon/sun icons rotate in `.theme-thumb`
- **Particles** — `#particles-canvas`, fixed overlay at `z-index: 0`, only when CDN loaded
- **Custom cursor** — `.cursor` + `.cursor-follower`; JS inits only when `innerWidth > 768`. CSS hides at 768px. `body` + all interactive elements use `cursor: none`
- **Typing** — `.typing-text` cycles `['Laravel & PHP.', 'React Native.', 'Anime & Code.', 'Database & API.']`
- **Scroll animations** — two `IntersectionObserver` instances: `.fade-in` (threshold 0.15, rootMargin -50px), `.fade-in-stagger` (threshold 0.3, delays 0.1s/0.3s/0.5s). Already-visible elements get `.visible` on `window.load`
- **Hero stagger** — `.hero-text > *` fade+translate up with 0.1s–0.85s delays, triggered by `.staggered` class on `window.load`
- **Section line reveal** — `.section-line::before` scales from 0→1 via `IntersectionObserver` (threshold 0.3), star fades in at end
- **Button ripple** — `.ripple` span appended on `.btn` click, removed after 600ms; CSS `overflow: hidden` on `.btn` contains it
- **Skill bars** — separate observer resets to `0%` then restores stored width after 200ms; `.skill-card` stagger delays 0s–0.45s
- **Counter** — `.stat-num` animates via `data-target`; single-fire (unobserves after start). `data-target="auto-projects"` counts `.project-card` elements. `data-no-plus` omits `+` suffix
- **Hamburger** — toggles `.nav-links.active` + `.nav-overlay.active` + `.hamburger.spin` + `fa-bars` ↔ `fa-times`. Closes on overlay click or nav-link click
- **Scroll progress** — `.nav-progress` width = percentage of document scroll
- **Chatbot Kuro** — `MAX_CHAT = 5` limit per session; persists via `localStorage` key `kuro_chat` with 24h cooldown. Append `?reset-chat` to URL to clear localStorage. Sends history (last 5 messages) to `/chat`. Chat toggle button gets `.hidden` when exhausted
- **Project filter** — `.project-filters` with dynamically-created `.filter-btn` buttons from tech spans. Click filters cards by tech tag. `allProjectCards` array + `IntersectionObserver`
- **Project modal** — `.project-modal` overlay on card click (skips overlay anchor clicks). Populates from card's `.project-tech` spans, `.project-features` (hidden `<ul>` per card), and `.project-github` link. Closes on bg click / Escape

## Cloudflare Pages Function (`functions/chat.js`)
- No npm deps (Workers runtime with native `fetch`). Handles CORS `OPTIONS` preflight for dev.
- **Primary**: Gemini 2.5 Flash — reads `GEMINI_API_KEY` through `GEMINI_API_KEY_6` (6 keys for rate-limit rotation)
- **Fallback**: Groq `llama-3.3-70b-versatile` — reads `GROQ_API_KEY`
- System prompt in Indonesian: Kuro persona (cheerful, humorous, ends each reply with Japanese vocab)
- History sent in request body: `{ message, history: [{ role, text }] }`. Function uses last 5 from history
- Returns `{ reply }` or `{ error }` with HTTP 500

## Deploy to Cloudflare Pages
```bash
wrangler pages deploy . --branch main --project-name portofolio-syarif
```
Set env vars in Cloudflare dashboard (project → Settings → Environment Variables) or via:
```bash
wrangler pages secret put GEMINI_API_KEY --project-name portofolio-syarif
wrangler pages secret put GROQ_API_KEY --project-name portofolio-syarif
```
Or connect Git repo on [Cloudflare Dashboard](https://dash.cloudflare.com/).

## Style conventions
- CSS vars: `--bg: #0a0e17`, `--accent: #ff4757`, `--accent-secondary: #ffc048`, `--accent-tertiary: #536dfe`, `--text: #e2e8f0`
- Light theme via `[data-theme="light"]` overrides all vars. `--white`/`--black` swap between themes
- Headings: `'M PLUS Rounded 1c', sans-serif`; monospace: `'SF Mono', 'Fira Code', monospace`
- Hero name gradient via `background-clip: text`
- Glassmorphism: `background: rgba(...)` + `backdrop-filter: blur(...)`
- `section { padding: 120px 0 }` → `60px 0` at 480px. `.section-line` hidden at 480px
- Scroll indicator (`.scroll-indicator`): `display: none` by default, `display: flex` at ≤768px
- `<html lang="id">` — site content is Indonesian
