-- Defense-in-depth RLS. The app's Prisma connection (DATABASE_URL) uses a
-- privileged Postgres role and is unaffected by these policies. These
-- policies only constrain access via Supabase's PostgREST/JS client using
-- the anon/authenticated JWT roles.

ALTER TABLE "admins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admins" FORCE ROW LEVEL SECURITY;
ALTER TABLE "alumni" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "alumni" FORCE ROW LEVEL SECURITY;
ALTER TABLE "volunteer_opportunities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "volunteer_opportunities" FORCE ROW LEVEL SECURITY;
ALTER TABLE "jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "jobs" FORCE ROW LEVEL SECURITY;

-- admins: no anon access; an authenticated user may only read their own row
CREATE POLICY "admins_select_self" ON "admins"
  FOR SELECT
  TO authenticated
  USING ("authUserId" = auth.uid()::text);

-- alumni: public read of published rows only; no anon/authenticated writes
CREATE POLICY "alumni_select_published" ON "alumni"
  FOR SELECT
  TO anon, authenticated
  USING (status = 'PUBLISHED');

-- volunteer_opportunities: public read of published rows only
CREATE POLICY "volunteer_select_published" ON "volunteer_opportunities"
  FOR SELECT
  TO anon, authenticated
  USING (status = 'PUBLISHED');

-- jobs: public read of published rows only
CREATE POLICY "jobs_select_published" ON "jobs"
  FOR SELECT
  TO anon, authenticated
  USING (status = 'PUBLISHED');

-- No INSERT/UPDATE/DELETE policies are defined for anon/authenticated on any
-- table, so all writes via PostgREST/JS client are denied by default.
-- All application writes go through Prisma using the privileged DB role.
