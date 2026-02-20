# MBTI Generative Quiz Monorepo

Minimal Node + TypeScript workspace bootstrap for a deterministic MBTI quiz app.

## Workspaces

- `shared/`: Chat contract schemas and quiz gradient helpers (EI/SN/TF/JP).
- `server/`: Express API (`GET /health`, `POST /chat`) with strict request validation.
- `web/`: Static chat UI posting to configurable API base URL.

## Quick Start

1. Install dependencies:
   - `npm install`
2. Copy env file:
   - `cp .env.example .env` (or create `.env` manually on Windows)
3. Run dev mode (server + web):
   - `npm run dev`

Server default: `http://localhost:3000`  
Web default: `http://localhost:5173`

## Scripts

- `npm run build`: builds shared/server and validates web build step.
- `npm run test`: runs shared unit tests and server API contract tests.
- `npm run typecheck`: runs TypeScript checks.
- `npm run dev`: runs server + web dev servers concurrently.

## Environment

See `.env.example`:

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL=openai/gpt-oss-120b`
- `PORT=3000`

`OPENROUTER_*` values are scaffolded for future model integration; current `/chat` returns deterministic stub responses.

## Deployment Notes

### GitHub Pages (web)

- Deploy contents of `web/` as static site.
- If API host differs, update `web/config.js` (`apiBaseUrl`) for production server URL.

### Railway (server)

- `railway.toml` is included.
- Build command: `npm run build`
- Start command: `npm run start -w server`
- Health check path: `/health`

## Test Coverage Intent

- Shared helper unit tests: `clamp`, `ema`, deterministic axis update behavior.
- Server API contract tests: `/health`, valid `/chat` response contract, invalid payload rejection.
