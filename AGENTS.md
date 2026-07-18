# AGENTS.md — Syarif Portfolio

Static single-page portfolio with Kuro AI chatbot.  
Zero build step, no package manager. Open `index.html` directly; chatbot requires Cloudflare Pages deploy.

## Files
- `index.html` + `style.css` + `main.js` + `img/Avatar.jpeg`, `img/og-banner.svg` + `functions/chat.js`
- `.gitignore` covers `.env*`, `.wrangler/`
- GitHub: `Kazuya-01`

## CDN dependencies (loaded in `<head>`)
- Font Awesome 6.5.0, Google Fonts (Inter 400–800, M PLUS Rounded 1c)
- particles.js 2.0.0 at end of `<body>`; guarded by `typeof particlesJS !== 'undefined'` — silently skips if CDN fails

## JS behaviors (`main.js`)
- **Theme** — `.theme-toggle` toggles `data-theme` on `<html>`, persists to `localStorage` key `kuro_theme`
- **Custom cursor** — init only when `innerWidth > 768`; CSS hides at 768px. `body` + interactive elements `cursor: none`
- **Typing** — `.typing-text` cycles `['Laravel & PHP.', 'React Native.', 'Anime & Code.', 'Database & API.']`
- **Scroll animations** — `IntersectionObserver` on `.fade-in` (threshold 0.15, rootMargin -50px), `.fade-in-stagger` (0.3, delays 0.1/0.3/0.5s). Already-visible get `.visible` on `window.load`
- **Hero stagger** — `.hero-text > *` fade+translate up (delays 0.1–0.85s) triggered by `.staggered` on `window.load`
- **Section line** — `.section-line::before` scales 0→1 via observer (0.3), star fades at end
- **Skill bars** — observer resets to 0% then restores stored width after 200ms; `.skill-card` stagger 0s–0.45s
- **Counter** — `.stat-num` via `data-target`; single-fire (unobserves). `data-target="auto-projects"` counts `.project-card` elements. `data-no-plus` omits `+`
- **Chatbot Kuro** — `MAX_CHAT=5`, persists via `localStorage` key `kuro_chat`, cooldown until 7 AM daily. `?reset-chat` clears it. Client sends `history.slice(-20)`; server uses last 5. Cooldown timer shown inside panel
- **Project filter** — buttons dynamically created from `.project-tech` spans. Filters cards by tech tag
- **Project modal** — populates from card's `.project-tech`, hidden `.project-features` `<ul>`, `.project-github` link. Closes on bg click / Escape

## Cloudflare Pages Function (`functions/chat.js`)
- No npm deps (Workers runtime with native `fetch`). CORS `OPTIONS` preflight for dev
- **Primary**: Gemini 2.5 Flash — reads `GEMINI_API_KEY` through `GEMINI_API_KEY_6` (6 keys for rate-limit rotation)
- **Fallback**: Groq `llama-3.3-70b-versatile` — reads `GROQ_API_KEY`
- System prompt in Indonesian: Kuro persona (cheerful, humorous, ends each reply with Japanese vocab)
- Request body: `{ message, history: [{ role, text }] }`. Returns `{ reply }` or `{ error }` (HTTP 500)

## Deploy to Cloudflare Pages
```bash
wrangler pages deploy . --branch main --project-name portofolio-syarif
```
Set env vars in Cloudflare dashboard or via:
```bash
wrangler pages secret put GEMINI_API_KEY --project-name portofolio-syarif
wrangler pages secret put GROQ_API_KEY --project-name portofolio-syarif
```
Repeat for `GEMINI_API_KEY_2` through `_6` if using key rotation.

## Style conventions
- CSS vars: `--bg: #0a0e17`, `--accent: #ff4757`, `--accent-secondary: #ffc048`, `--accent-tertiary: #536dfe`, `--text: #e2e8f0`
- Light theme via `[data-theme="light"]` overrides all vars; `--white`/`--black` swap
- Headings: `'M PLUS Rounded 1c', sans-serif`; monospace: `'SF Mono', 'Fira Code', monospace`
- Hero name: gradient via `background-clip: text`
- Glassmorphism: `background: rgba(...)` + `backdrop-filter: blur(...)`
- `section { padding: 120px 0 }` → `60px 0` at 480px; `.section-line` hidden at 480px
- Scroll indicator (`.scroll-indicator`): `display: none` → `flex` at 768px
- `<html lang="id">`
