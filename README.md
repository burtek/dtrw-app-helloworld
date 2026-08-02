# dtrw app monorepo template

Production-ready pnpm monorepo template for a full-stack app:

- `packages/backend`: Fastify + TypeScript API
- `packages/frontend`: React + Vite frontend
- root workspace scripts for linting, type checks, tests, build, and deployment packaging

## Stack

- Node.js `26.x`
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
pnpm assemble    # prepare deply.tar.gz ready to be deployed to a server
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

The main workflow (`.github/workflows/main.yaml`) runs on both PRs and pushes to `master`.

On every PR/push:

- `test`: runs workspace tests, lint, and build in parallel
- `test-playwright`: runs end-to-end tests in Playwright container
- `test-build-alpine` (PR only): executes Alpine build workflow as a deployment packaging smoke test
- `test-ssh`: validates SSH connectivity to the target VPS early

On push to `master` (after successful checks):

- `create-release`: bumps versions and changelog using `commit-and-tag-version`, then pushes tag/commit
- `build-alpine-for-deploy`: builds deployment artifacts on Alpine from the release commit
- `deploy`: downloads built artifact and performs zero-downtime-ish file swap on VPS, then runs `docker compose up -d`

### Required GitHub secrets

- `SSH_HOST`
- `SSH_PORT`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_KNOWN_HOSTS`

## Template placeholders to change

This template currently contains default app identifiers (`helloworld`). Update them after creating your new app:

- `package.json`: `name`, `repository`
- `.github/workflows/main.yaml`: `env.APP_NAME`
- `docker-compose.yml`: service container names

If your deploy target path differs, also update paths used in deploy workflow SCP steps.

## Deployment artifacts

The deployment payload is prepared in two layers:

1. Package-level `assemble` scripts create package-local `.assembled` outputs:
    - backend: `pnpm pm --filter . --prod deploy .assembled`
      - exports production backend runtime dependencies/files
      - then `postassemble` generates `.assembled/env` with `COMMIT_SHA=$BUILD_SHA`
    - frontend: `cp -r dist .assembled`
      - copies static Vite build output

1. Root `pnpm assemble` runs package `assemble` scripts across the workspace.

In CI, `.github/workflows/build-alpine.yml` then creates one archive:

- `alpine-build-output.tar.gz` containing:
  - `docker/`
  - `docker-compose.yml`
  - transformed package artifacts from `packages/*/.assembled` into top-level `backend/` and `frontend/` directories

The `deploy` job in `.github/workflows/main.yaml` downloads this artifact, extracts it on the VPS under `/apps/${APP_NAME}/upload`, rotates current files into `old/`, moves new files into place, and restarts via `docker compose up -d`.

### Responsibility separation

```plain
Package
    build
    assemble
        ↓
Monorepo
    assemble
        ↓
Filesystem ready for deployment
        ↓
CI
    archive
    upload
        ↓
VPS
    extract
```

## Commit quality gates

- Husky `pre-commit`: runs `pnpm check-all`, which executes:
    - workspace validation (`pnpm run validate`)
    - parallel `lint`, `typecheck`, and `test`
- Husky `commit-msg`: runs commitlint with conventional commit rules

## Notes

- Backend dev env defaults are in `packages/backend/.env.development`.
- Deploy pipeline sets `BUILD_SHA` in Alpine build job, and backend `postassemble` writes `COMMIT_SHA` into `packages/backend/.assembled/env`.
- Workspace uses pnpm catalog versions to keep toolchain versions aligned across packages.
