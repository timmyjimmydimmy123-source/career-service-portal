# Database

Schema lives in `prisma/schema.prisma`, connection config in `prisma.config.ts`.

## Tables
- `admins` — one row per faculty admin, linked to Supabase Auth via `authUserId`.
  `role` is `SUPER_ADMIN` or `EDITOR`.
- `alumni`, `volunteer_opportunities`, `jobs` — the three public content types.
  Each has a `status` column (`DRAFT` / `PUBLISHED` / `ARCHIVED`) and an optional
  `createdById` linking back to the admin who created it.

## Status lifecycle
Records default to `PUBLISHED`. Admins can save as `DRAFT` before it's ready, or move a
listing to `ARCHIVED` instead of deleting it outright (soft delete). Public pages only ever
query `status: PUBLISHED`.

## Row Level Security
Not yet configured (tracked in Phase 5/6, once admin write paths exist). Planned policy:
`SELECT` allowed to `anon` where `status = 'PUBLISHED'`; all writes restricted to the
`service_role` connection Prisma uses, since the app never lets the browser talk to
Postgres directly.

## Connections
Supabase gives two connection strings:
- `DATABASE_URL` — pooled (pgbouncer, port 6543), used by the app's runtime `PrismaClient`
  (`src/lib/prisma.ts`, via `@prisma/adapter-pg`).
- `DIRECT_URL` — direct (port 5432), used by the Prisma CLI (`prisma.config.ts`) for
  `migrate`/`generate`. The pooler can hang on the schema engine's connectivity checks,
  so CLI operations always go direct.

## Migration workflow
- Local: `npx prisma migrate dev --name <description>`
- Seed sample data: `npm run db:seed`
- Deploy: `npx prisma migrate deploy` (Phase 11)
