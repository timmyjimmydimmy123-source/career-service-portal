import { describe, it, expect, beforeEach } from "vitest";
import { getSiteUrl } from "@/lib/site-url";

beforeEach(() => {
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
});

describe("getSiteUrl", () => {
  it("prefers Vercel's production domain when present", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "my-app.vercel.app";
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

    expect(getSiteUrl()).toBe("https://my-app.vercel.app");
  });

  it("falls back to NEXT_PUBLIC_SITE_URL when Vercel's domain is unset", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("falls back to localhost when nothing is configured", () => {
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
