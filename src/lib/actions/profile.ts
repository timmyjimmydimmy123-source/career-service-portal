"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const admin = await requireAdmin();
  const fullName = formData.get("fullName") as string;

  await prisma.admin.update({
    where: { id: admin.id },
    data: { fullName },
  });

  revalidatePath("/admin/settings");
}

export async function changeOwnPassword(formData: FormData) {
  await requireAdmin();
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/settings");
}
