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
- `test-build-image` (PR only): executes Docker image build as a smoke test
- `test-ssh`: validates SSH connectivity to the target VPS early

On push to `master` (after successful checks):

- `create-release`: bumps versions and changelog using `commit-and-tag-version`, then pushes tag/commit
- `build-image-for-deploy`: builds Docker images from the release commit and pushes them to GitHub Container Registry
- `deploy`: uploads `docker-compose.yml` to VPS, pulls latest images, and starts services with `docker compose up -d`

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
- Dockerfiles in each package define the production build and runtime.
