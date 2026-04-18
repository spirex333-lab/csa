<div align="center">
  <img src="apps/webapp/public/logo.svg" alt="CSA Logo" width="80" />
  <h1>Crypto Swap App</h1>
  <p>A fast, non-custodial crypto exchange platform — swap digital assets with the best rates across multiple providers.</p>

  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=flat-square&logo=nestjs&logoColor=white)
  ![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat-square&logo=mysql&logoColor=white)
  ![NX](https://img.shields.io/badge/NX-Monorepo-143055?style=flat-square&logo=nx&logoColor=white)
</div>

---

## Overview

CSA is a full-stack NX monorepo that aggregates swap quotes from **ChangeNow** and **LetsExchange**, presents the best rate to the user, and handles the full order lifecycle — from quote to deposit address to status polling.

```
User → picks pair & amount → gets best rate → submits destination address → receives deposit address → sends funds → monitors status
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Backend API | NestJS 10, TypeORM, MySQL 8 |
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Monorepo | NX, pnpm workspaces |
| Auth | JWT + API Keys (role-based) |
| Swap Providers | ChangeNow, LetsExchange |
| Infra | Docker Compose (local), Vercel (webapp), Railway (api) |

---

## Project Structure

```
csa/
├── apps/
│   ├── api/            # NestJS backend — swap engine, auth, order management
│   └── webapp/         # Next.js frontend — swap UI, wallet input, order tracking
│
├── libs/
│   ├── backend/
│   │   ├── change-now/     # ChangeNow API integration
│   │   ├── auth/           # JWT / API-key / role-based auth
│   │   ├── be-commons/     # Shared entities, filters, pipes, decorators
│   │   ├── config/         # Key-value config module
│   │   ├── mysql-db/       # TypeORM MySQL setup
│   │   ├── mailer/         # Email module
│   │   ├── files/          # File upload/management
│   │   ├── socket-io/      # WebSocket module
│   │   └── migrations/     # DB migrations
│   │
│   ├── commons/            # Shared frontend + backend code
│   │   ├── dtos/           # All DTOs (single source of truth for API shapes)
│   │   ├── auth/           # Auth utilities
│   │   ├── hooks/          # Shared React hooks
│   │   ├── validation/     # Wallet address & input validators
│   │   └── i18n/           # Locale strings
│   │
│   ├── eds/                # CSA design system (themed components)
│   ├── ui/                 # shadcn/radix base primitives
│   └── utils/              # Tailwind config & utilities
│
├── tools/
│   └── be-nest-module/     # NX generator for new NestJS modules
├── docker-compose.yml
└── nx.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### Install

```bash
pnpm install
```

### Environment

```bash
cp apps/api/.env.example apps/api/.env
# Fill in: CHANGENOW_API_KEY, DB_HOST, DB_PASS, JWT_SECRET, etc.
```

### Run locally

```bash
# Start MySQL + API + webapp via Docker
docker compose up

# Or run individually
nx serve api       # NestJS on :8002
nx serve webapp    # Next.js on :3000
```

### Build

```bash
nx build api
nx build webapp
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/change-now/currencies` | List supported currencies |
| `GET` | `/api/change-now/quote/float` | Get float-rate quote |
| `GET` | `/api/change-now/quote/fixed` | Get fixed-rate quote |
| `POST` | `/api/change-now/orders` | Create swap order |
| `GET` | `/api/change-now/orders/:id` | Poll order status |

---

## Key Conventions

- **New NestJS module?** Run the generator: `nx generate @workspace/be-nest-module:module <name>`
- **New UI component?** Add it to `libs/eds/` — never directly in `apps/webapp/`
- **Shared data shape?** Create a DTO in `libs/commons/src/dtos/` — no standalone interfaces
- **Styling?** Tailwind only — no inline styles or separate CSS files

---

## Project Tracker

Stories and milestones are tracked in the **Crypto Swap App** project (`CSA`).

| Milestone | Status |
|-----------|--------|
| Week 1 — Foundation | 🟡 In Progress |

---

<div align="center">
  <sub>Built with TypeScript · NestJS · Next.js · NX</sub>
</div>
