# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**crystallography.io** — Crystal Structure Search Application. A full-stack platform for searching and analyzing crystal structures from the Crystallography Open Database (COD).

**Repository:** `chemistry/crystallography.io`
**Default Branch:** `master`
**Monorepo:** npm workspaces with event-driven microservice architecture

## Development Commands

```bash
npm install              # Install all workspace dependencies
npm run build            # Build all packages
npm run dev              # Start frontend dev server (Vite)
npm test                 # Run Vitest unit tests
npm run test:e2e         # Run Playwright E2E tests
npm run lint             # ESLint
npm run format:check     # Prettier check
npm run verify           # Full pipeline: type-check + lint + build + test
npm run clean            # Clean build artifacts
```

## Architecture

### Packages

```
packages/
├── libraries/
│   └── cif-2-json/      # CIF file parser library
└── containers/
    ├── c14-api/         # Public search API (Express)
    ├── c14-web/         # Frontend (React + Vite)
    ├── cod-to-disk/     # COD database sync service
    ├── disk-to-db/      # File-to-MongoDB import service
    ├── structure-to-index/ # Search index builder
    ├── maintenance/     # Database maintenance tasks
    ├── searchrouter/    # Search request router
    └── searchworker/    # Search execution worker
```

### Key Patterns

- **Event-driven microservices** — each container runs independently
- **Processing pipeline:** COD → disk → MongoDB → search index
- **MongoDB** for structure storage, in-memory index for search
- **Docker Compose** for local development, Docker Swarm for production

### Key Dependencies

- Express.js (APIs), React 18 + Vite (frontend)
- MongoDB (native driver)
- TypeScript strict mode

## Testing

- **Unit:** Vitest — `*.test.ts` pattern
- **E2E:** Playwright — frontend and API tests

## Deployment

Containerized services deployed via Docker Swarm. **Never deploy manually** — CI handles it on merge to master.

## Standards

See [root CLAUDE.md](../../CLAUDE.md) for tech standards and [showcase CLAUDE.md](../CLAUDE.md) for portfolio workflow rules.
