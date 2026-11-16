# Application de Covoiturage

Carpooling application. Stack: Angular (frontend), NestJS (backend), PostgreSQL, TypeORM, JWT.

## Prerequisites

- Node.js 20+ (check with `node -v`)
- Docker Desktop (must be **running** before any docker command)
- Git

## First-time setup

```bash
git clone https://github.com/amiraelmanaa/Application_de_Covoiturage.git
cd Application_de_Covoiturage

# 1. Start PostgreSQL (creates the "carpooling" and "carpooling_test" databases)
docker compose up -d

# 2. Install backend dependencies (node_modules is not in git)
cd backend
npm install
```

Check that the database is up with `docker ps` (you should see `carpooling-db`).

## Run the backend

```bash
cd backend
npm run start:dev
```

The API runs on http://localhost:3000. Tables are created automatically by TypeORM.

## Run the tests

The database container must be running.

```bash
cd backend
npm run test:e2e -- --runInBand
```

Tests use the separate `carpooling_test` database, so they never touch development data.

## Troubleshooting

| Problem | Fix |
|---|---|
| `failed to connect to the docker API` | Start Docker Desktop and wait for "Engine running" |
| `database "carpooling_test" does not exist` | Run `docker exec -it carpooling-db psql -U postgres -c "CREATE DATABASE carpooling_test;"` |
| `port 5433 already in use` | A local PostgreSQL is running. Stop it, or change the port mapping in `docker-compose.yml` (the port we're using is 5433) |
| `Cannot find module ...` | Run `npm install` inside `backend/` |

To reset the databases completely (deletes ALL data): `docker compose down -v` then `docker compose up -d`.

## Git workflow

- `main`: shared foundation. Do not commit feature code directly.
- One branch per use case. Before working, bring in the latest foundation:

```bash
git checkout <your-branch>
git merge main
```

- Commit messages reference the issue, for example: `feat(booking): ... (refs #17)`
- Open a Pull Request into `main` with `Closes #NN` in the description.