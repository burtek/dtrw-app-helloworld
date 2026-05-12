# Backend (Fastify)

TypeScript Fastify backend with optional data persistence mode.

## Run locally

```bash
yarn workspace backend dev
```

Server defaults to `http://localhost:4000`.

## Environment

Use one of:

- `./packages/backend/.env.example`
- `./packages/backend/.env.sqlite.example`

Important variables:

- `APP_NAME`
- `DB_MODE` (`none` or `sqlite`)
- `DB_FILE_NAME`

## Routes

- `GET /health`
- `GET /hello`
- `GET /hello/messages`
- `POST /hello/messages`

## Architecture

- Controller -> Service -> Repository boundary
- Repository implementation is selected by config:
  - `InMemoryHelloRepository` for `DB_MODE=none`
  - `SqliteHelloRepository` for `DB_MODE=sqlite`
