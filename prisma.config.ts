import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, ".env.local") });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrate/introspect use the direct connection — Supabase's pgbouncer
    // pooler (transaction mode) can hang on the schema engine's connectivity
    // checks. The app's runtime PrismaClient uses DATABASE_URL (pooled) via
    // its own adapter in src/lib/prisma.ts, unrelated to this CLI config.
    url: process.env.DIRECT_URL,
  },
});
