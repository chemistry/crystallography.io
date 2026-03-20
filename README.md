# Crystal Structure Search Application

[![GitHub Build Status](https://github.com/chemistry/crystallography.io/workflows/CI/badge.svg)](https://github.com/chemistry/crystallography.io/actions?query=workflow%3ACI)
[![License: MIT](https://img.shields.io/badge/License-MIT-gren.svg)](https://opensource.org/licenses/MIT)

Website: [crystallography.io](https://crystallography.io/)

![CrystalStructureSearch](https://github.com/chemistry/crystallography.io/blob/master/crystal-structure-search.png?raw=true)

## Architecture

Microservice / event-driven architecture for crystal structure search and analysis. Data sourced from [COD](https://www.crystallography.net/) (Crystallography Open Database).

**Stack:** TypeScript, Node.js 22, Express, React 18, Vite, Zustand, MongoDB, Redis, RabbitMQ, Docker Swarm, Traefik

### Containers

| Package                                                                 | Description                                                |
| ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| [@chemistry/c14-api](packages/containers/c14-api)                       | REST API for COD+ database access                          |
| [@chemistry/c14-web](packages/containers/c14-web)                       | Web UI with server-side rendering                          |
| [@chemistry/cod-to-disk](packages/containers/cod-to-disk)               | Sync CIF files from COD via rsync                          |
| [@chemistry/disk-to-db](packages/containers/disk-to-db)                 | Parse CIF files and store in MongoDB                       |
| [@chemistry/structure-to-index](packages/containers/structure-to-index) | Build search indexes (authors, names, formulas, fragments) |
| [@chemistry/maintenance](packages/containers/maintenance)               | Scheduled tasks (catalog, sitemap generation)              |
| [@chemistry/searchrouter](packages/containers/searchrouter)             | Substructure search API (BullMQ + Socket.IO)               |
| [@chemistry/searchworker](packages/containers/searchworker)             | Substructure search worker (molecule matching)             |

### Libraries

| Package                                                | Description        |
| ------------------------------------------------------ | ------------------ |
| [@chemistry/cif-2-json](packages/libraries/cif-2-json) | CIF to JSON parser |

### Data Pipeline

```
COD (rsync) → cod-to-disk → disk-to-db → MongoDB
                                ↓
                        structure-to-index → authors, names, formulas, fragments
                                ↓
                           maintenance → catalog, sitemap
```

## Development

```bash
npm install          # Install all workspaces
npm run build        # TypeScript composite build
npm run lint         # ESLint check
npm run test         # Vitest
npm run verify       # build + lint + test
npm run dev          # Start c14-web with Vite dev server
```

## Deployment

Fully automated via GitHub Actions — no manual SSH required.

| Workflow            | Trigger                 | Purpose                                 |
| ------------------- | ----------------------- | --------------------------------------- |
| `ci.yml`            | Every push              | Build + lint + test                     |
| `pr-validation.yml` | PR to master            | CI + Docker build validation            |
| `deploy.yml`        | Push to master / manual | Build images → deploy to Docker Swarm   |
| `sync-cod.yml`      | Manual / weekly cron    | Rsync CIF files from COD                |
| `seed-import.yml`   | Manual                  | Queue CIF files for initial data import |
| `server-status.yml` | Manual                  | Check services and resources            |

### Deploy to a new server

1. Set GitHub secrets: `DEPLOY_HOST`, `DEPLOY_SSH_KEY`, `MONGO_PASSWORD`, `REDIS_PASSWORD`, `SENTRY_DSN`
2. Trigger `deploy.yml` — stack is up
3. Trigger `sync-cod.yml` — CIF files synced (~532K files, ~111 GB)
4. Trigger `seed-import.yml` — data pipeline populates MongoDB
5. Point DNS → server, Traefik auto-generates SSL

### Library Release

```bash
git tag l0.0.18 && git push --tags
```

Triggers `release.yml` → npm publish for `@chemistry/cif-2-json`.

## License

This project is licensed under the MIT license, Copyright (c) 2020 Volodymyr Vreshch.
For more information see [LICENSE](https://github.com/chemistry/crystallography.io/blob/master/LICENSE).
