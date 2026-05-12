# dtrw app template (React + Fastify)

This repository is a working application and a reusable template for DTRW-hosted apps.

## What you get

- Frontend: React + Vite (`packages/frontend`)
- Backend: Fastify + TypeScript (`packages/backend`)
- Health endpoint: `GET /health`
- Sample API:
  - `GET /hello`
  - `GET /hello/messages`
  - `POST /hello/messages`
- Optional database mode in one committed codebase:
  - `DB_MODE=none` (in-memory repository)
  - `DB_MODE=sqlite` (SQLite repository using Node's built-in `node:sqlite`)

## Quick start

```bash
yarn install
yarn test
yarn build
yarn dev
```

Frontend runs on `http://localhost:3000` and proxies `/api/*` to backend `http://localhost:4000`.

## Environment

Backend env files are documented in:

- `/home/runner/work/dtrw-app-helloworld/dtrw-app-helloworld/packages/backend/.env.example`
- `/home/runner/work/dtrw-app-helloworld/dtrw-app-helloworld/packages/backend/.env.sqlite.example`

Main backend env variables:

- `APP_NAME` (default `helloworld`)
- `DB_MODE` (`none` or `sqlite`)
- `DB_FILE_NAME` (used when `DB_MODE=sqlite`)

## Template initialization

Run:

```bash
./init.sh <app-name>
```

or `./init.sh` and answer prompts.

The script is idempotent and updates:

- `.github/template.env` (single source for template app naming)
- `docker/backend/env` defaults
- root `package.json` name/repository placeholder

It does **not** delete files, apply hidden patches, or create releases.

## CI and release behavior

CI tests and builds the committed code in a matrix:

- `DB_MODE=none`
- `DB_MODE=sqlite`

No workflow patching or source mutation is used.

## Deployment

Deployment workflow is opinionated for DTRW VPS conventions and reads app naming from `.github/template.env`.

Required secrets:

- `PAT`
- `VPS_HOST`
- `VPS_PORT`
- `VPS_SSH_KEY`
- `VPS_SSH_PASSPHRASE`
- `VPS_USER`
- `KUMA_API_KEY`
- `KUMA_CONTAINER`

## Template surface vs example surface

Reusable template surface:

- CI/release/deploy workflows
- bootstrap/init script
- backend app wiring and DB mode switch
- Docker config

Example app surface (replace freely):

- frontend UI in `packages/frontend/src/App.tsx`
- sample hello/messages backend endpoints
