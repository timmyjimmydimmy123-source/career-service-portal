import { describe, it, expect, vi, beforeEach } from "vitest";

const { findUnique, getUser } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  getUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { admin: { findUnique } },
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: { getUser } })),
}));

import { getCurrentUser, requireAdmin } from "@/lib/auth";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getCurrentUser", () => {
  it("returns null when there is no Supabase session", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    expect(await getCurrentUser()).toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("looks up the Admin row by authUserId when a session exists", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-1" } } });
    findUnique.mockResolvedValue({ id: "admin-1", authUserId: "auth-1" });

    const admin = await getCurrentUser();

    expect(findUnique).toHaveBeenCalledWith({ where: { authUserId: "auth-1" } });
    expect(admin).toEqual({ id: "admin-1", authUserId: "auth-1" });
  });
});

describe("requireAdmin", () => {
  it("throws when there is no admin", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    await expect(requireAdmin()).rejects.toThrow("Not authenticated as an admin");
  });

  it("throws when the admin is deactivated", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-1" } } });
    findUnique.mockResolvedValue({ id: "admin-1", isActive: false, role: "SUPER_ADMIN" });
    await expect(requireAdmin()).rejects.toThrow("Not authenticated as an admin");
  });

  it("throws when the admin's role is below the required minimum", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-1" } } });
    findUnique.mockResolvedValue({ id: "admin-1", isActive: true, role: "EDITOR" });
    await expect(requireAdmin("SUPER_ADMIN")).rejects.toThrow("Requires SUPER_ADMIN role");
  });

  it("returns the admin when active and sufficiently privileged", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "auth-1" } } });
    const admin = { id: "admin-1", isActive: true, role: "SUPER_ADMIN" };
    findUnique.mockResolvedValue(admin);
    await expect(requireAdmin("EDITOR")).resolves.toEqual(admin);
  });
});
