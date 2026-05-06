# replacemegently

A full-stack marketplace application built with Next.js (TypeScript), Python FastAPI, and PostgreSQL. Tools and objects for designers coping with the age of AI.

## Prerequisites

- **Node.js** (v18+) and **npm** — [install](https://nodejs.org/)
- **Python 3.11+** and **pip**
- **PostgreSQL 16** via Homebrew (`brew install postgresql@16 && brew services start postgresql@16`)
- **Cursor** IDE — [install](https://cursor.sh/)

## Project Structure

```
.
├── web/          # Next.js TypeScript frontend (App Router + Tailwind CSS)
├── api/          # Python FastAPI backend (catalog API)
├── .cursor/      # Cursor skills and configuration
└── README.md
```

## Quick Start

### 1. Database (PostgreSQL via Homebrew)

```bash
brew install postgresql@16
brew services start postgresql@16
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"

createuser -s skillful 2>/dev/null || true
createdb -O skillful skillful_marketplace 2>/dev/null || true
psql -d skillful_marketplace -c "ALTER USER skillful WITH PASSWORD 'skillful';"
```

### 2. API (FastAPI)

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
alembic upgrade head
python -m app.seed

uvicorn app.main:app --reload --port 8000
```

The API will be available at [http://localhost:8000](http://localhost:8000).

Interactive API docs:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs) — try endpoints in-browser.
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc) — reference-style reading.
- **OpenAPI spec:** [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json) — machine-readable schema.

Smoke test:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/products
curl http://localhost:8000/collections
```

### 3. Web App (Next.js)

```bash
cd web
npm install
cp .env.local.example .env.local   # points the web at http://localhost:8000
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

### web/

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Create production build  |
| `npm run start` | Serve production build   |
| `npm run lint`  | Run ESLint               |

### api/

| Command                                     | Description                         |
| ------------------------------------------- | ----------------------------------- |
| `alembic upgrade head`                      | Apply database migrations           |
| `alembic revision --autogenerate -m "msg"`  | Generate a new migration            |
| `python -m app.seed`                        | Seed catalog data (idempotent)      |
| `uvicorn app.main:app --reload --port 8000` | Run the API in development mode     |

## API Endpoints

| Method | Path                              | Description                           |
| ------ | --------------------------------- | ------------------------------------- |
| GET    | `/health`                         | Liveness check                        |
| GET    | `/products`                       | List products (`?category=&collection=`) |
| GET    | `/products/{id}`                  | Get a single product                  |
| GET    | `/collections`                    | List collections with computed `itemCount` |
| GET    | `/collections/{id}`               | Get a single collection               |

## Getting Started from Scratch

1. Fork this repo to your own GitHub
2. Clone it locally and open in Cursor
3. Follow steps 1–3 above to bring up the database, API, and web app

## Next Steps

- Add write APIs (admin auth, products/collections CRUD)
- Add users, orders, and server-side cart persistence
- Wire CI/CD and deployment (see `.cursor/skills/deploy-to-gcp-serverless/`)
