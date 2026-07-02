# frontend

Frontend package for the monorepo template.

## Stack

- React 19
- Vite
- TypeScript
- Vitest + Testing Library
- ESLint

## Local development

From repository root:

```bash
pnpm --filter frontend dev
```

or from this package directory:

```bash
pnpm dev
```

Default local URL:

- `http://localhost:3000`

## API proxy

Vite dev server proxies `/api/*` to backend `http://localhost:4000`.

Current app example fetch:

- frontend calls `/api/hello`
- proxy rewrites to backend `/hello`

This keeps frontend code independent from backend host/port during local development.

## Package scripts

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:watch
pnpm build
pnpm preview
```

## Testing

- test environment: `jsdom`
- setup file: `setup-tests.ts`

Run from root or package directory.

## Build and deploy notes

- `pnpm build` produces static files in `dist/`
- root deploy pipeline copies this output to `dist-frontend/`
- production nginx config for static hosting is in `docker/frontend/nginx.conf`
