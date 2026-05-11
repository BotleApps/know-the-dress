# StyleSift ✦

A tiny, mobile-first web app that helps you find the dress that matches your vibe — no login, no clutter.

Two paths:

1. **Find my vibe** — a 4-question quiz (mood, occasion, colour, season) that maps your energy to a silhouette and hands you back a dress + a character name.
2. **Build my dress** — a 6-step picker (neckline, length, fabric, sleeves, slit, colour) that names what you've designed.

Designed to feel like a calm, photography-led marketplace (white canvas, single accent, soft pill shapes, generous whitespace) — see [design.md](design.md) for the system this app is loosely modelled after.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS for the design system
- Netlify Functions + [Netlify Blobs](https://docs.netlify.com/blobs/overview/) for anonymous, IP-grouped interaction logging — zero config on Netlify's default deploy.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

To exercise the Netlify function locally (Blobs storage), use the Netlify CLI:

```bash
npm install -g netlify-cli
netlify dev
```

Without `netlify dev`, the `/api/log` calls will fail silently and the events will be printed to the function's stdout instead — the UI is unaffected.

## Deploy to Netlify

Push this repo to GitHub and connect it to a Netlify site. Defaults work:

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

These are pinned in [netlify.toml](netlify.toml). Netlify Blobs is enabled automatically — no API keys needed.

### Optional environment variables

- `STYLESIFT_IP_SALT` — overrides the default salt used to hash IP addresses before storage. Set this in the Netlify UI for production.

## Privacy

- We never ask for a name, email, or login.
- IP addresses are **hashed with a daily-rotating salt** before storage; the raw IP is never written to disk.
- A coarse `/16` network prefix is stored alongside each event for rough geo bucketing only.
- A random `sessionId` is stored in `localStorage` to group events from the same device across visits. Clearing site data resets it.

## Project layout

```
src/
  App.tsx              # router shell
  main.tsx             # bootstrap
  styles.css           # Tailwind + tokens
  lib/
    dress.ts           # data + recommendation engine
    log.ts             # client logger (sendBeacon)
  screens/
    _chrome.tsx        # Header, FooterCTA, ChoiceChip, Wordmark
    Home.tsx           # landing + path selection
    VibeQuiz.tsx       # 4-step quiz
    Builder.tsx        # 6-step builder
    Result.tsx         # dress reveal
netlify/functions/
  log.ts               # writes events to Netlify Blobs
```
