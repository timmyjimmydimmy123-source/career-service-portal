import { describe, it, expect, vi, beforeEach } from "vitest";

const { findUnique, create, update, del, requireAdmin, deleteImageIfOwned } = vi.hoisted(
  () => ({
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    requireAdmin: vi.fn(),
    deleteImageIfOwned: vi.fn(),
  }),
);

vi.mock("@/lib/prisma", () => ({
  prisma: { alumni: { findUnique, create, update, delete: del } },
}));

vi.mock("@/lib/auth", () => ({ requireAdmin }));

vi.mock("@/lib/actions/storage", () => ({ deleteImageIfOwned }));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

import { createAlumni, updateAlumni, deleteAlumni } from "@/lib/actions/alumni";

function formData(fields: Record<string, string>) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  return fd;
}

const baseFields = {
  fullName: "Jordan Reyes",
  graduationYear: "2016",
  bio: "A bio.",
  status: "PUBLISHED",
};

beforeEach(() => {
  vi.clearAllMocks();
  requireAdmin.mockResolvedValue({ id: "admin-1" });
});

describe("createAlumni", () => {
  it("creates a record scoped to the current admin and redirects", async () => {
    await expect(createAlumni(formData(baseFields))).rejects.toThrow(
      "REDIRECT:/admin/alumni",
    );

    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        fullName: "Jordan Reyes",
        graduationYear: 2016,
        createdById: "admin-1",
      }),
    });
  });
});

describe("updateAlumni", () => {
  it("deletes the old photo when it changes", async () => {
    findUnique.mockResolvedValue({ photoUrl: "https://old.example/a.png" });

    await expect(
      updateAlumni(
        "alumni-1",
        formData({ ...baseFields, photoUrl: "https://new.example/b.png" }),
      ),
    ).rejects.toThrow("REDIRECT:/admin/alumni");

    expect(deleteImageIfOwned).toHaveBeenCalledWith("https://old.example/a.png");
  });

  it("does not delete the photo when it is unchanged", async () => {
    findUnique.mockResolvedValue({ photoUrl: "https://same.example/a.png" });

    await expect(
      updateAlumni(
        "alumni-1",
        formData({ ...baseFields, photoUrl: "https://same.example/a.png" }),
      ),
    ).rejects.toThrow("REDIRECT:/admin/alumni");

    expect(deleteImageIfOwned).not.toHaveBeenCalled();
  });
});

describe("deleteAlumni", () => {
  it("deletes the record and its photo", async () => {
    del.mockResolvedValue({ photoUrl: "https://old.example/a.png" });

    await expect(deleteAlumni("alumni-1")).rejects.toThrow("REDIRECT:/admin/alumni");

    expect(del).toHaveBeenCalledWith({ where: { id: "alumni-1" } });
    expect(deleteImageIfOwned).toHaveBeenCalledWith("https://old.example/a.png");
  });
});
