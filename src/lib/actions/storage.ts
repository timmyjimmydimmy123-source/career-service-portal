"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, getStoragePath } from "@/lib/storage";

const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET;

export async function uploadImage(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await requireAdmin();

  if (!STORAGE_BUCKET) {
    return { error: "No storage bucket configured — paste an image URL instead." };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "No file selected." };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Unsupported file type. Use JPEG, PNG, WEBP, or GIF." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "File too large. Max size is 5MB." };
  }

  const supabase = createAdminClient();
  const path = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file);
  if (error) {
    return { error: error.message };
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function deleteImageIfOwned(url: string | null | undefined) {
  if (!STORAGE_BUCKET || !url) return;

  const path = getStoragePath(url, STORAGE_BUCKET);
  if (!path) return;

  const supabase = createAdminClient();
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}
