"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminRole } from "@prisma/client";

export async function inviteAdmin(formData: FormData) {
  await requireAdmin("SUPER_ADMIN");

  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as AdminRole;

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?next=/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  await prisma.admin.create({
    data: {
      authUserId: data.user.id,
      email,
      fullName,
      role,
    },
  });

  revalidatePath("/admin/users");
}

export async function setAdminActive(id: string, isActive: boolean) {
  await requireAdmin("SUPER_ADMIN");

  await prisma.admin.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/users");
}

export async function deleteAdmin(id: string) {
  const currentAdmin = await requireAdmin("SUPER_ADMIN");

  if (id === currentAdmin.id) {
    throw new Error("You cannot delete your own admin account.");
  }

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) return;

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(admin.authUserId);
  if (error && error.message !== "User not found") {
    throw new Error(error.message);
  }

  await prisma.admin.delete({ where: { id } });

  revalidatePath("/admin/users");
}
