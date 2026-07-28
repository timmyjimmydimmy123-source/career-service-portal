# Database

Schema lives in `prisma/schema.prisma`. To be expanded once Phase 1 (Supabase project +
Prisma setup) lands, with:

- ER diagram of `Admin`, `Alumni`, `Volunteer`, `Job`.
- Explanation of the `status` lifecycle (DRAFT → PUBLISHED → ARCHIVED).
- Row Level Security policy summary per table/bucket.
- Migration workflow: `prisma migrate dev` locally, `prisma migrate deploy` in CI/deploy.
