import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { Admin, AdminRole } from "@prisma/client";

export async function getCurrentUser(): Promise<Admin | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return prisma.admin.findUnique({ where: { authUserId: user.id } });
}

const ROLE_RANK: Record<AdminRole, number> = {
  EDITOR: 0,
  SUPER_ADMIN: 1,
};

export async function requireAdmin(minRole: AdminRole = "EDITOR"): Promise<Admin> {
  const admin = await getCurrentUser();

  if (!admin || !admin.isActive) {
    throw new Error("Not authenticated as an admin");
  }

  if (ROLE_RANK[admin.role] < ROLE_RANK[minRole]) {
    throw new Error(`Requires ${minRole} role`);
  }

  return admin;
}
