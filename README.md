# insta-tracking

Instagram ad tracking app for a psychologist's practice. Tracks ad spending, income, and leads.

## Structure

Monorepo managed with pnpm workspaces.

- `packages/backend/` — NestJS 11 + TypeORM + PostgreSQL
- `packages/frontend/` — React + Vite + Mantine UI (PWA)

## Prerequisites

- Node.js
- pnpm
- Docker (for PostgreSQL)

## Setup

```bash
pnpm install
docker compose up -d
cp packages/backend/.env.example packages/backend/.env  # then edit as needed
```

## Development

```bash
pnpm run dev           # backend + frontend in parallel
pnpm run dev:backend   # NestJS on :3000
pnpm run dev:frontend  # Vite on :5173
```

Vite proxies `/api` to `http://localhost:3000`.

## Build / Lint / Test

```bash
pnpm run build
pnpm run lint
pnpm run test
```

Backend e2e tests (requires running DB):

```bash
pnpm --filter backend run test:e2e
```

## Stack

- **Backend:** NestJS 11, TypeORM, PostgreSQL, JWT auth with bcrypt. Modules: `auth`, `ad-spending`, `income`, `dashboard`. All data is user-scoped via `userId` FK.
- **Frontend:** React SPA, react-router-dom, @tanstack/react-query, Mantine v8, Recharts. PWA via vite-plugin-pwa. JWT stored in localStorage.
