"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { deleteImageIfOwned } from "@/lib/actions/storage";
import type { JobType, RecordStatus } from "@prisma/client";

function readJobForm(formData: FormData) {
  const expiresAt = formData.get("expiresAt") as string;

  return {
    title: formData.get("title") as string,
    company: formData.get("company") as string,
    description: formData.get("description") as string,
    location: (formData.get("location") as string) || null,
    isRemote: formData.get("isRemote") === "on",
    jobType: formData.get("jobType") as JobType,
    imageUrl: (formData.get("imageUrl") as string) || null,
    applyUrl: (formData.get("applyUrl") as string) || null,
    contactEmail: (formData.get("contactEmail") as string) || null,
    salaryRange: (formData.get("salaryRange") as string) || null,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    status: formData.get("status") as RecordStatus,
  };
}

export async function createJob(formData: FormData) {
  const admin = await requireAdmin();
  const data = readJobForm(formData);

  await prisma.job.create({
    data: { ...data, createdById: admin.id },
  });

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}

export async function updateJob(id: string, formData: FormData) {
  await requireAdmin();
  const data = readJobForm(formData);

  const existing = await prisma.job.findUnique({ where: { id } });

  await prisma.job.update({
    where: { id },
    data,
  });

  if (existing?.imageUrl && existing.imageUrl !== data.imageUrl) {
    await deleteImageIfOwned(existing.imageUrl);
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}

export async function deleteJob(id: string) {
  await requireAdmin();

  const existing = await prisma.job.delete({ where: { id } });
  await deleteImageIfOwned(existing.imageUrl);

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}
