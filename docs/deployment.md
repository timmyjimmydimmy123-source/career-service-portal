# Deployment

## Environment variables (Vercel project settings)
See `.env.example` for the full list: Supabase URL/anon key/service role key, and
`DATABASE_URL` / `DIRECT_URL` for Prisma.

## Supabase setup checklist
- Create project, note the connection strings and API keys.
- Create Storage buckets: `alumni-photos`, `volunteer-images`, `job-images` (public read).
- Enable Row Level Security and add policies per `docs/database.md`.

## Vercel setup checklist
- Connect the GitHub repo.
- Add environment variables above.
- Ensure `prisma migrate deploy` runs as part of the build step.
- Smoke test the deployed site end to end after each deploy.
