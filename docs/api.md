# API

Public read endpoints (no auth): `GET /api/alumni`, `GET /api/volunteer`, `GET /api/jobs`,
plus `GET /api/{resource}/[id]`. Query params for filtering/pagination TBD in Phase 3/4.

Admin write endpoints require an authenticated session; most admin mutations go through
Next.js Server Actions in `src/lib/actions/` rather than REST routes. `POST /api/upload`
handles server-mediated image uploads to Supabase Storage.

To be filled in with exact request/response shapes as each phase lands.
