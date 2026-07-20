# AGENTS.md — Syarif Portfolio

Static single-page portfolio with Kuro AI chatbot.
Zero build step, no package manager. Open `index.html` directly; chatbot requires Cloudflare Pages deploy.

## Files
- `index.html` + `style.css` + `main.js` + `img/` (Avatar.jpeg, favicon.svg, og-banner.svg)
- `functions/chat.js` — Cloudflare Pages Function (Workers runtime)
- `_headers` — CSP & security headers (CSP allows Gemini & Groq APIs via `connect-src`)
- `404.html` — custom 404 page

## Commands
```bash
wrangler pages deploy . --branch main --project-name portofolio-syarif
wrangler pages secret put GEMINI_API_KEY --project-name portofolio-syarif
wrangler pages secret put GROQ_API_KEY --project-name portofolio-syarif
# Repeat GEMINI_API_KEY_2 through _6 for key rotation
```

## JS behaviors (`main.js`)
- **Loader** — hides via `display:none` after 900ms timeout
- **Theme** — `.theme-toggle` toggles `data-theme` on `<html>`, persists to `localStorage` key `kuro_theme`
- **Custom cursor** — only inits on `innerWidth > 768`; CSS hides at ≤768px
- **Typing** — `.typing-text` cycles `['Laravel & PHP.', 'React Native.', 'Anime & Code.', 'Database & API.']` with type/delete effect
- **Scroll progress** — `.nav-progress` width = fraction of doc height scrolled, updated on scroll
- **Nav active link** — updates `.nav-link.active` based on scroll position, throttled via `requestAnimationFrame`
- **Scroll animations** — 3 `IntersectionObserver`s: `.fade-in` (0.15, rootMargin -50px), `.fade-in-stagger` (0.3), `.section-line` (0.3, single-fire). Already-visible get `.visible` on `window.load`
- **Skill bars** — observer resets to 0% then restores stored width after 200ms
- **Counter** — `.stat-num` via `data-target`; single-fire. `data-target="auto-projects"` counts `.project-card` elements. `data-no-plus` omits `+`
- **Particles** — inline config in `main.js`; guarded by `typeof particlesJS !== 'undefined'` — silently skips if CDN fails
- **Button ripple** — all `.btn` get a ripple `span` on click, auto-removed after 600ms
- **Chatbot Kuro** — `MAX_CHAT=5`, persisted via `localStorage` key `kuro_chat`. Cooldown resets daily at 7 AM. `?reset-chat` clears state. Client sends `history.slice(-20)`; server uses last 5. Cooldown timer shown inside panel
- **Project filter** — buttons dynamically created from `.project-tech` spans
- **Project modal** — populates from card's `.project-tech`, hidden `.project-features` `<ul>`, `.project-github` link. Closes on bg click / Escape
- **Cert lightbox** — click `.cert-img-wrap` to open full-size image overlay; closes on bg click / Escape

## Cloudflare Pages Function (`functions/chat.js`)
- No npm deps (Workers runtime with native `fetch`). CORS `OPTIONS` preflight allows localhost + production origin
- **Rate limiting**: 20 req/min per IP (in-memory `rateMap`)
- **Primary**: Gemini 2.5 Flash — reads `GEMINI_API_KEY` through `GEMINI_API_KEY_6` (6 keys for rate-limit rotation)
- **Fallback**: Groq `llama-3.3-70b-versatile` — reads `GROQ_API_KEY`
- System prompt in Indonesian: Kuro persona (cheerful, humorous, ends each reply with Japanese vocab)
- Request body: `{ message, history: [{ role, text }] }`. Returns `{ reply }` or `{ error }` (HTTP 500)

## Design conventions
- CSS custom properties in `:root` / `[data-theme="light"]` — dark-first, light overrides via attribute
- Glassmorphism: `background: rgba(...)` + `backdrop-filter: blur(...)`
- Headings: `'M PLUS Rounded 1c', sans-serif`; monospace: `'SF Mono', 'Fira Code', monospace`
- Hero name gradient via `background-clip: text`
- `section { padding: 120px 0 }` → `60px 0` at 480px; `.section-line` hidden at 480px
- Scroll indicator: hidden by default → `display: flex` at ≤768px
- Custom cursor hidden at ≤768px via `display: none`
- `<html lang="id">`
