export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Unsupported file type. Use JPEG, PNG, WEBP, or GIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "File too large. Max size is 5MB.";
  }
  return null;
}

export function getStoragePath(url: string | null | undefined, bucket: string) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
}

export function resolveImageUrl(
  url: string | null | undefined,
  kind: "avatar" | "logo",
) {
  if (url) return url;
  return kind === "avatar"
    ? "https://placehold.co/200x200?text=Photo"
    : "https://placehold.co/200x200?text=Logo";
}
