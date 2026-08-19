/**
 * Resolves the app's canonical public URL. Prefers Vercel's own
 * automatically-injected production domain over the hand-set
 * NEXT_PUBLIC_SITE_URL env var, since the latter is manually maintained and
 * can silently drift out of sync with the real deployment (e.g. left as
 * localhost after a local dev session).
 */
export function getSiteUrl(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
