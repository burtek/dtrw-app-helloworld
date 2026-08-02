# backend

Backend package for the monorepo template.

## Stack

- Fastify
- TypeScript
- Zod + `fastify-type-provider-zod`
- Vitest
- ESLint
- tsdown (build)

## Local development

From repository root:

```bash
pnpm --filter backend dev:tsx
```

or from this package directory:

```bash
pnpm dev:tsx
```

Server defaults:

- host: `0.0.0.0`
- port: `4000`

## Environment

Development env file: `.env.development`

Default values:

```env
NODE_ENV=development
PORT=4000
```

Validated runtime variables:

- `NODE_ENV` (`development`, `production`, `test`)
- `PORT` (number, defaults to `4000`)
- `LOGS_FILE` (optional)

## Routes

- `GET /health`
  - returns app/system health details (status, uptime, version, memory usage, commit SHA)
- `GET /hello`
  - returns plain text: `Hello world`

## Package scripts

```bash
pnpm dev:tsx       # run server in watch mode with tsx
pnpm dev:typecheck # tsc --watch
pnpm lint
pnpm typecheck
pnpm test
pnpm test:watch
pnpm build         # runs prebuild (tsc) then tsdown
pnpm assemble
```

## Build output

Build entry is `src/server.ts` (configured in `tsdown.config.ts`).

This package is bundled in ESM format and used by root deploy packaging scripts.

## Auth header notes

Request context includes `request.user` populated from proxy headers:

- `remote-user`
- `remote-groups` (comma-separated)

This allows integrating reverse proxy auth (for example Authelia) without changing route handlers.
