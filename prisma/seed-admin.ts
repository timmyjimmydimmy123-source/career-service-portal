import path from "node:path";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.edu";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";
  const fullName = process.env.SEED_ADMIN_NAME ?? "Sample Admin";

  const { data: created, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error && !error.message.includes("already been registered")) {
    throw error;
  }

  let authUserId = created?.user?.id;

  if (!authUserId) {
    const { data: list, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;
    authUserId = list.users.find((u) => u.email === email)?.id;
  }

  if (!authUserId) {
    throw new Error(`Could not resolve auth user id for ${email}`);
  }

  await prisma.admin.upsert({
    where: { email },
    update: { authUserId },
    create: {
      authUserId,
      email,
      fullName,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Admin ready: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
