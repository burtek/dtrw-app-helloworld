# Frontend (React + Vite)

Frontend app that demonstrates backend integration for template users.

## Run locally

```bash
yarn workspace frontend dev
```

Default URL: `http://localhost:3000`

## What it demonstrates

- Loads greeting from `GET /api/hello`
- Reads persisted sample messages from `GET /api/hello/messages`
- Saves new messages with `POST /api/hello/messages`
- Displays active backend database mode

## Notes

Vite dev server proxies `/api/*` to backend `http://localhost:4000`.
