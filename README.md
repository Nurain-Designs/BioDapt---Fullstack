# BioDapt

## Overview
BioDapt is a **full‑stack** web application that provides an AI‑driven material recommendation UI (React + Vite) and a lightweight **Express** backend (TypeScript) exposing simple API endpoints. The frontend is wired to the backend via Vite’s proxy, so all `/api/*` calls are automatically forwarded to the backend during development.

## Features
- **Frontend**: React 19, Vite, TailwindCSS, Framer Motion, Recharts, and a polished UI with dark/light gradients.
- **Backend**: Express server with CORS, two demo endpoints:
  - `GET /api/health` – health check.
  - `GET /api/data` – sample data response.
- **Development workflow**:
  - `npm run dev` – start only the Vite dev server.
  - `npm run backend` – start only the backend server.
  - `npm run dev:full` – launch both simultaneously using `concurrently`.
- **Production build** (frontend only): `npm run build` produces a single‑file bundle via `vite-plugin-singlefile`.

## Getting Started
1. **Install dependencies**
   ```bash
   npm install                # install both frontend and backend deps
   npm i -D concurrently      # (already installed)
   ```
2. **Run the development stack**
   ```bash
   npm run dev:full
   ```
   - Frontend will be available at `http://localhost:5173`.
   - Backend runs on `http://localhost:5000` and is proxied for the UI.
3. **Health check**
   Open the browser console or use curl:
   ```bash
   curl http://localhost:5000/api/health
   ```
   You should receive `{ "status": "ok", "timestamp": "..." }`.
4. **Production build** (frontend only)
   ```bash
   npm run build
   ```
   The output is a single HTML file in `dist/` ready for static hosting.

## Project Structure
```
BioDapt/
├─ src/                # React source files
│   ├─ App.tsx
│   └─ ...
├─ backend/
│   ├─ src/index.ts    # Express server
│   ├─ package.json    # backend deps & scripts
│   └─ tsconfig.json
├─ vite.config.ts      # Vite config with proxy
├─ package.json        # root scripts + dev deps
└─ README.md           # you are here!
```

## Extending the Backend
Add new routes in `backend/src/index.ts` and install any required packages. Remember to restart the backend (or use `npm run dev:full` which watches changes).

## License
MIT – feel free to adapt and use for your own projects.
