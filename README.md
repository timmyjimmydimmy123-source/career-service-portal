# Career & Service Portal

A site for a high school to publish alumni profiles, volunteer opportunities, and first-job
listings, with an admin dashboard for faculty to manage content without touching code.

## Tech stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Prisma ORM
- Supabase (Postgres + Auth + Storage)
- Deployed on Vercel

## Getting started
1. Copy `.env.example` to `.env.local` and fill in Supabase/Prisma values.
2. `npm install`
3. `npx prisma migrate dev` (once the Prisma schema exists — see `docs/roadmap.md`)
4. `npm run dev` and open [http://localhost:3000](http://localhost:3000)

## Docs
See the `docs/` folder:
- [`vision.md`](docs/vision.md) — what this project is and isn't
- [`design-system.md`](docs/design-system.md) — UI conventions
- [`database.md`](docs/database.md) — schema and RLS
- [`roadmap.md`](docs/roadmap.md) — implementation phases and progress
- [`api.md`](docs/api.md) — API routes
- [`deployment.md`](docs/deployment.md) — Vercel/Supabase deployment steps
- [`contributing.md`](docs/contributing.md) — branching, commits, local setup

## Project structure
```
src/app/(public)/   public read-only pages (alumni, volunteer, jobs)
src/app/admin/      admin dashboard, protected by middleware.ts
src/app/api/        public read endpoints + upload route
src/components/     ui/, layout/, cards/, filters/, admin/, common/
src/lib/            prisma client, supabase clients, auth helpers, actions, validations
prisma/             schema.prisma, migrations, seed script
```
