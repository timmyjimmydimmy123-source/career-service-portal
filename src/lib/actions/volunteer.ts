"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { RecordStatus } from "@prisma/client";

function readVolunteerForm(formData: FormData) {
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  return {
    title: formData.get("title") as string,
    organization: formData.get("organization") as string,
    description: formData.get("description") as string,
    location: (formData.get("location") as string) || null,
    isRemote: formData.get("isRemote") === "on",
    contactEmail: (formData.get("contactEmail") as string) || null,
    contactUrl: (formData.get("contactUrl") as string) || null,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    status: formData.get("status") as RecordStatus,
  };
}

export async function createVolunteer(formData: FormData) {
  const admin = await requireAdmin();
  const data = readVolunteerForm(formData);

  await prisma.volunteer.create({
    data: { ...data, createdById: admin.id },
  });

  revalidatePath("/admin/volunteer");
  revalidatePath("/volunteer");
  redirect("/admin/volunteer");
}

export async function updateVolunteer(id: string, formData: FormData) {
  await requireAdmin();
  const data = readVolunteerForm(formData);

  await prisma.volunteer.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/volunteer");
  revalidatePath("/volunteer");
  redirect("/admin/volunteer");
}

export async function deleteVolunteer(id: string) {
  await requireAdmin();

  await prisma.volunteer.delete({ where: { id } });

  revalidatePath("/admin/volunteer");
  revalidatePath("/volunteer");
  redirect("/admin/volunteer");
}
