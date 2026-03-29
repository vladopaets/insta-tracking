# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Instagram ad tracking application for a psychologist's practice. Monorepo with NestJS 11 backend and React PWA frontend.

## Structure

- `packages/backend/` — NestJS 11 + TypeORM + PostgreSQL
- `packages/frontend/` — React + Vite + Mantine UI (PWA)

## Commands

### Root (workspace)

- **Install:** `pnpm install`
- **Dev all:** `pnpm run dev` (backend + frontend in parallel)
- **Dev backend:** `pnpm run dev:backend` (NestJS watch mode, port 3000)
- **Dev frontend:** `pnpm run dev:frontend` (Vite dev server, port 5173)
- **Build all:** `pnpm run build`
- **Lint all:** `pnpm run lint`
- **Test all:** `pnpm run test`

### Backend (packages/backend)

- **Build:** `pnpm run build`
- **Format:** `pnpm run format` (Prettier)
- **Lint:** `pnpm run lint`
- **Unit tests:** `pnpm run test`
- **Single test:** `pnpm exec jest --testPathPattern <pattern>`
- **E2E tests:** `pnpm run test:e2e` (requires running DB)

### Frontend (packages/frontend)

- **Dev:** `pnpm run dev`
- **Build:** `pnpm run build`
- **Lint:** `pnpm run lint`

## Architecture

### Backend

NestJS app using module/controller/service pattern with TypeORM entities. Modules: auth, ad-spending, income, dashboard. JWT authentication with bcrypt passwords. All data is user-scoped via userId FK.

### Frontend

React SPA with react-router-dom, @tanstack/react-query for server state, Mantine v8 for UI, Recharts for charts. PWA via vite-plugin-pwa. Auth via JWT stored in localStorage.

## Code Style

- ESLint with typescript-eslint and Prettier integration
- `@typescript-eslint/no-explicit-any` is disabled
- `strictNullChecks` enabled, `noImplicitAny` disabled
- Package manager: pnpm (workspaces)

## Infrastructure

- **Database:** PostgreSQL via `docker-compose.yml` at root
- **Backend .env:** `packages/backend/.env` (DB connection, JWT secret)
- **Vite proxy:** `/api` -> `http://localhost:3000`

## GitHub

- **Repository:** `vladopaets/insta-tracking` (private)
- **MCP Server:** GitHub MCP is configured via Docker (`MCP_DOCKER`). Use `mcp__MCP_DOCKER__*` tools for GitHub operations (issues, PRs, branches, etc.)
