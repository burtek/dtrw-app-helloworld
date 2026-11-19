# dtrw app monorepo template

Production-ready pnpm monorepo template for a full-stack app:

- `packages/backend`: Fastify + TypeScript API
- `packages/backend-sqlite`: Fastify + TypeScript API with SQLite database
- `packages/frontend`: React + Vite frontend
- root workspace scripts for linting, type checks, tests, build, and deployment packaging

## Stack

- Node.js `26.13.1`
- pnpm workspace (`pnpm-workspace.yaml`)
- TypeScript (all packages)
- Vitest (workspace and package-level)
- ESLint + Husky + Commitlint
- Docker Compose for runtime deployment layout
- GitHub Actions for PR checks, release tagging, and VPS deploy
- Drizzle ORM (backend-sqlite package)

## Monorepo layout

```text
.
|- packages/
|  |- backend/
|  |- backend-sqlite/
|  \- frontend/
|- scripts/
|  |- run-in-parallel.mjs
|  \- validate-workspace.mjs
|- .github/
|  |- workflows/
|  |  |- pr-check.yaml
|  |  |- push-master.yml
|  |  |- build-docker.yml
|  |  \- _checks.yml
|  \- actions/
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

1. Run development mode for all packages in parallel:

```bash
pnpm dev
```

Expected local URLs:

- frontend: `http://localhost:3000`
- backend: `http://localhost:4000`
  - health check: `http://localhost:4000/health`
  - hello route: `http://localhost:4000/hello`
- backend-sqlite: `http://localhost:4001`
  - health check: `http://localhost:4001/health`
  - hello route: `http://localhost:4001/hello`

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
pnpm --filter backend-sqlite <script>
pnpm --filter frontend <script>
```

Example:

```bash
pnpm --filter backend test
pnpm --filter backend-sqlite dev
pnpm --filter frontend dev
```

## CI/CD overview

GitHub Actions workflows run automated checks and deployments:

**PR checks** (`.github/workflows/pr-check.yaml`):
- Runs workspace tests, lint, and build in parallel
- Executes end-to-end tests with Playwright
- Validates SSH connectivity to target VPS
- Builds Docker images as a smoke test

**Push to master** (`.github/workflows/push-master.yml`):
- After successful PR checks, creates release using release-please:
  - Bumps versions and updates changelog based on conventional commit messages
  - Creates release tag and commit
- Builds Docker images and pushes to GitHub Container Registry (`.github/workflows/build-docker.yml`)
- Deploys to VPS:
  - Uploads `docker-compose.yml`
  - Pulls latest images from GHCR
  - Starts services with `docker compose up -d`

### Required GitHub secrets

- `SSH_HOST`
- `SSH_PORT`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_KNOWN_HOSTS`

## Template placeholders to change

This template currently contains default app identifiers (`helloworld`). Update them after creating your new app:

- `package.json`: `name`, `repository`
- `.github/workflows/push-master.yml`: `env.DEPLOY_DIR_NAME`
- `docker-compose.yml`: service container names and GHCR image references
- `packages/*/Dockerfile`: image labels that reference the app name

## Docker deployment

The deployment uses Docker images built and pushed to GitHub Container Registry (GHCR):

1. **Image building**: 
   - `.github/workflows/build-docker.yml` discovers all packages with Dockerfiles
   - Each package is built as a separate Docker image
   - Images are tagged with commit SHA and version tag
   - Images are pushed to `ghcr.io/<repository>/<package>:<tag>`

2. **Deployment**:
   - `docker-compose.yml` references images by version tag (set via `VERSION_TAG` env variable)
   - The deploy workflow uploads `docker-compose.yml` to VPS
   - On VPS: `docker compose pull` fetches the latest images from GHCR
   - `docker compose up -d` starts services with zero-downtime restart

This approach provides:
- Simplified deployment (no file artifacts, just image pulls)
- Atomic updates (images are immutable)
- Easy rollback (just pull a different image tag)
- Consistent environments (Dockerfile defines exact dependencies)

## Commit quality gates

- Husky `pre-commit`: runs `pnpm check-all`, which executes:
    - workspace validation (`pnpm run validate`)
    - parallel `lint`, `typecheck`, and `test`
- Husky `commit-msg`: runs commitlint with conventional commit rules

## Notes

- Backend dev env defaults are in `packages/backend/.env.development`.
- Backend-sqlite dev env defaults are in `packages/backend-sqlite/.env.development`.
- Backend-sqlite runs on `http://localhost:4001` (separate from main backend on `4000`).
- Dockerfiles in each package define the production build and runtime.
- In Docker deployment, all three services (backend, backend-sqlite, frontend) run as separate containers orchestrated by `docker-compose.yml`.
