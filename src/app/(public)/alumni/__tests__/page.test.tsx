import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const { findMany, count } = vi.hoisted(() => ({
  findMany: vi.fn(),
  count: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { alumni: { findMany, count } },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/alumni",
  useSearchParams: () => new URLSearchParams(),
}));

import AlumniPage from "@/app/(public)/alumni/page";

beforeEach(() => {
  vi.clearAllMocks();
  count.mockResolvedValue(0);
});

describe("AlumniPage", () => {
  it("renders alumni cards when results exist", async () => {
    findMany
      .mockResolvedValueOnce([
        {
          id: "1",
          fullName: "Jordan Reyes",
          graduationYear: 2016,
          currentTitle: "Software Engineer",
          currentCompany: "Acme Corp",
          industry: "Technology",
          photoUrl: null,
        },
      ])
      .mockResolvedValueOnce([{ industry: "Technology" }]);
    count.mockResolvedValue(1);

    const ui = await AlumniPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(screen.getByText("Jordan Reyes")).toBeInTheDocument();
    expect(screen.getByText(/Class of 2016/)).toBeInTheDocument();
  });

  it("renders an empty state when there are no matches", async () => {
    findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    count.mockResolvedValue(0);

    const ui = await AlumniPage({ searchParams: Promise.resolve({ q: "nobody" }) });
    render(ui);

    expect(screen.getByText(/No alumni profiles match your search/)).toBeInTheDocument();
  });
});
