"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { deleteImageIfOwned } from "@/lib/actions/storage";
import type { RecordStatus } from "@prisma/client";

function readAlumniForm(formData: FormData) {
  return {
    fullName: formData.get("fullName") as string,
    graduationYear: Number(formData.get("graduationYear")),
    currentTitle: (formData.get("currentTitle") as string) || null,
    currentCompany: (formData.get("currentCompany") as string) || null,
    bio: formData.get("bio") as string,
    photoUrl: (formData.get("photoUrl") as string) || null,
    linkedinUrl: (formData.get("linkedinUrl") as string) || null,
    industry: (formData.get("industry") as string) || null,
    status: formData.get("status") as RecordStatus,
  };
}

export async function createAlumni(formData: FormData) {
  const admin = await requireAdmin();
  const data = readAlumniForm(formData);

  await prisma.alumni.create({
    data: { ...data, createdById: admin.id },
  });

  revalidatePath("/admin/alumni");
  revalidatePath("/alumni");
  redirect("/admin/alumni");
}

export async function updateAlumni(id: string, formData: FormData) {
  await requireAdmin();
  const data = readAlumniForm(formData);

  const existing = await prisma.alumni.findUnique({ where: { id } });

  await prisma.alumni.update({
    where: { id },
    data,
  });

  if (existing?.photoUrl && existing.photoUrl !== data.photoUrl) {
    await deleteImageIfOwned(existing.photoUrl);
  }

  revalidatePath("/admin/alumni");
  revalidatePath("/alumni");
  redirect("/admin/alumni");
}

export async function deleteAlumni(id: string) {
  await requireAdmin();

  const existing = await prisma.alumni.delete({ where: { id } });
  await deleteImageIfOwned(existing.photoUrl);

  revalidatePath("/admin/alumni");
  revalidatePath("/alumni");
  redirect("/admin/alumni");
}
