# dtrw app monorepo template

Production-ready pnpm monorepo template for a full-stack app:

- `packages/backend`: Fastify + TypeScript API
- `packages/frontend`: React + Vite frontend
- root workspace scripts for linting, type checks, tests, build, and deployment packaging

## Stack

- Node.js `24.x`
- pnpm workspace (`pnpm-workspace.yaml`)
- TypeScript (both packages)
- Vitest (workspace and package-level)
- ESLint + Husky + Commitlint
- Docker Compose for runtime deployment layout
- GitHub Actions for PR checks, release tagging, and VPS deploy

## Monorepo layout

```text
.
|- packages/
|  |- backend/
|  \- frontend/
|- docker/
|  |- backend/env
|  \- frontend/nginx.conf
|- docker-compose.yml
|- pnpm-workspace.yaml
\- vitest.config.ts
```

## Quick start

1. Use this repository as a template and rename it to `dtrw-app-<app-name>`.
1. Update template placeholders (see "Template placeholders to change").
1. Install dependencies:

```bash
pnpm install
```

1. Run development mode for both packages in parallel:

```bash
pnpm dev
```

Expected local URLs:

- frontend: `http://localhost:3000`
- backend: `http://localhost:4000`
- backend health: `http://localhost:4000/health`
- backend hello route: `http://localhost:4000/hello`

## Workspace commands

Run from repository root:

```bash
pnpm dev         # run package dev scripts in parallel
pnpm lint        # lint all packages
pnpm typecheck   # typecheck all packages
pnpm test        # run Vitest projects from packages/*
pnpm build       # build all packages
pnpm clear       # remove build artifacts
```

Target a single package when needed:

```bash
pnpm --filter backend <script>
pnpm --filter frontend <script>
```

Example:

```bash
pnpm --filter backend test
pnpm --filter frontend dev
```

## CI/CD overview

- PR checks (`.github/workflows/test-pr.yaml`): install, test, lint, build.
- Release (`.github/workflows/release.yaml`): on push to `master`, runs checks, creates release commit/tag.
- Deploy (`.github/workflows/deploy.yaml`): on `v*` tag, builds artifacts, copies frontend/backend/docker files to VPS, restarts Docker services.

### Required GitHub secrets

- `PAT`
- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_SSH_PASSPHRASE`
- `KUMA_API_KEY` (reserved for future maintenance mode step)
- `KUMA_CONTAINER` (reserved for future maintenance mode step)

## Template placeholders to change

This template currently contains default app identifiers (`qwerty`). Update them after creating your new app:

- `package.json`: `name`, `repository`
- `.github/workflows/deploy.yaml`: `env.APP_NAME`, `env.KUMA_APP`
- `docker-compose.yml`: service container names

If your deploy target path differs, also update paths used in deploy workflow SCP steps.

## Deployment artifacts

Root deploy scripts prepare:

- `dist-frontend/` from frontend build output
- `dist-backend/` from backend build output packaged for runtime

`docker-compose.yml` expects runtime folders on server:

- `./frontend` served by nginx
- `./backend` executed by Node.js

Deploy workflow copies both artifacts and docker config into `/apps/${APP_NAME}`.

## Commit quality gates

- Husky `pre-commit`: runs `pnpm lint` and `pnpm typecheck`
- Husky `commit-msg`: runs commitlint with conventional commit rules

## Notes

- Backend dev env defaults are in `packages/backend/.env.development`.
- Deploy pipeline writes `COMMIT_SHA` into `docker/backend/env` before packaging.
- Workspace uses pnpm catalog versions to keep toolchain versions aligned across packages.
