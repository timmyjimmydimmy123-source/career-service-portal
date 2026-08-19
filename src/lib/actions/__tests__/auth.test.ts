import { describe, it, expect, vi, beforeEach } from "vitest";

const { signInWithPassword, signOut, resetPasswordForEmail } = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  resetPasswordForEmail: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { signInWithPassword, signOut, resetPasswordForEmail },
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

import { login, logout, requestPasswordReset } from "@/lib/actions/auth";

function formData(fields: Record<string, string>) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
});

describe("login", () => {
  it("redirects to /admin on success", async () => {
    signInWithPassword.mockResolvedValue({ error: null });

    await expect(
      login(formData({ email: "a@b.com", password: "secret123" })),
    ).rejects.toThrow("REDIRECT:/admin");

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "secret123",
    });
  });

  it("redirects back to /login with error message on failure", async () => {
    signInWithPassword.mockResolvedValue({ error: { message: "Invalid credentials" } });

    await expect(
      login(formData({ email: "a@b.com", password: "wrong" })),
    ).rejects.toThrow("REDIRECT:/login?error=Invalid%20credentials");
  });
});

describe("logout", () => {
  it("signs out and redirects to /login", async () => {
    await expect(logout()).rejects.toThrow("REDIRECT:/login");
    expect(signOut).toHaveBeenCalled();
  });
});

describe("requestPasswordReset", () => {
  it("calls resetPasswordForEmail and redirects", async () => {
    resetPasswordForEmail.mockResolvedValue({ error: null });

    await expect(
      requestPasswordReset(formData({ email: "a@b.com" })),
    ).rejects.toThrow("REDIRECT:/forgot-password?sent=1");

    expect(resetPasswordForEmail).toHaveBeenCalledWith(
      "a@b.com",
      expect.objectContaining({
        redirectTo: expect.stringContaining("/reset-password"),
      }),
    );
  });
});
