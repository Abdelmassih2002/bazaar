# Bazaar — B2B Wholesale Ordering Platform

> A production-grade portfolio project demonstrating full-stack capability
> (Next.js 16 + FastAPI + PostgreSQL). Built to solve a real problem:
> small Egyptian retailers order wholesale goods via WhatsApp, leading to errors and no tracking.

## Tech Stack

**Frontend**
- Next.js 16.4 (App Router, Webpack mode) + TypeScript (strict)
- Tailwind CSS v4
- React Hook Form + Zod
- TanStack Query + Zustand
- Lucide React (icons)

**Backend**
- Python FastAPI + SQLAlchemy + Alembic
- PostgreSQL + Redis
- JWT auth (httpOnly cookies)
- Pydantic v2

**Infra**
- Frontend: Vercel
- Backend: Railway / Render
- DB: Supabase (Postgres) + Upstash (Redis)
- CI/CD: GitHub Actions

## Project Structure

```
bazaar/
├── src/                    # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/ui/      # Reusable UI components
│   ├── lib/                # API client, utils
│   └── types/              # Shared TypeScript types
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/         # SQLAlchemy models (TODO)
│   │   ├── schemas/        # Pydantic schemas (TODO)
│   │   ├── routers/        # API routes (stubs)
│   │   └── services/       # Business logic (TODO)
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## Getting Started

### Frontend
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
```

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload  # http://localhost:8000/docs
```

## Roadmap

- [x] Week 1: Project scaffold + Auth pages + Backend skeleton
- [x] Week 2: Product catalog + Cart (frontend + backend)
- [x] Week 3: Checkout + Orders + Admin dashboard
- [x] Week 4: FastAPI orders/admin + DB models
- [x] Week 5: Vitest unit tests + Playwright E2E + GitHub Actions CI
- [x] Week 6: i18n (EN/AR) + Deploy prep + Demo video script

## i18n

Lightweight locale context (`src/contexts/locale-context.tsx`) with EN/AR translations.
Toggle via the globe icon on the landing page. RTL supported via `dir` attribute.

## Deploy

- **Frontend (Vercel):** `vercel.json` configured. Set `NEXT_PUBLIC_API_URL`.
- **Backend (Railway/Render):** `Procfile` included. Set `DATABASE_URL` to Postgres in production.
- **DB:** Switch `DATABASE_URL` from SQLite to Postgres (Supabase/Neon) for production.

## Notes

- This project uses **Webpack** instead of Turbopack due to native binary issues on some Windows setups.
- Tailwind CSS v4 with `@import "tailwindcss"` (no postcss.config needed).
- Backend routers are stubs — implement them week by week.

## License

MIT
