# replacemegently

A full-stack marketplace application built with Next.js (TypeScript), Python FastAPI, and PostgreSQL.

## Prerequisites

- **Node.js** (v18+) and **npm** — [install](https://nodejs.org/)
- **Python 3** and **pip** — for the API (coming soon)
- **PostgreSQL** via Homebrew — for the database (coming soon)
- **Cursor** IDE — [install](https://cursor.sh/)

## Project Structure

```
.
├── web/          # Next.js TypeScript frontend (App Router + Tailwind CSS)
├── api/          # Python FastAPI backend (coming soon)
├── .cursor/      # Cursor skills and configuration
└── README.md
```

## Quick Start

### Web App (Next.js)

```bash
cd web
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts (web/)

| Command         | Description                  |
|-----------------|------------------------------|
| `npm run dev`   | Start development server     |
| `npm run build` | Create production build      |
| `npm run start` | Serve production build       |
| `npm run lint`  | Run ESLint                   |

## Getting Started from Scratch

1. Fork this repo to your own GitHub
2. Clone it locally:
   ```bash
   git clone <your-fork-url>
   cd skillful-marketplace
   ```
3. Open in Cursor (File -> Open Folder)
4. Run `cd web && npm install && npm run dev`

## Next Steps

- [ ] Set up Python FastAPI backend in `api/`
- [ ] Configure local PostgreSQL database
- [ ] Wire API to database
- [ ] Build marketplace features (listings, users, orders)
