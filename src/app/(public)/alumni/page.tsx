import { GraduationCap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AlumniCard } from "@/components/cards/AlumniCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/filters/SearchInput";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { FilterBar } from "@/components/filters/FilterBar";
import { ActiveFilters } from "@/components/filters/ActiveFilters";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "year-desc", label: "Newest grads first" },
  { value: "year-asc", label: "Oldest grads first" },
  { value: "name-asc", label: "Name (A-Z)" },
];

const SORT_ORDER_BY: Record<string, Prisma.AlumniOrderByWithRelationInput> = {
  "year-desc": { graduationYear: "desc" },
  "year-asc": { graduationYear: "asc" },
  "name-asc": { fullName: "asc" },
};

export default async function AlumniPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; industry?: string; sort?: string; page?: string }>;
}) {
  const { q, industry, sort, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const orderBy = SORT_ORDER_BY[sort ?? ""] ?? SORT_ORDER_BY["year-desc"];

  const where = {
    status: "PUBLISHED" as const,
    ...(industry ? { industry } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" as const } },
            { currentCompany: { contains: q, mode: "insensitive" as const } },
            { industry: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [alumni, total, industries] = await Promise.all([
    prisma.alumni.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.alumni.count({ where }),
    prisma.alumni.findMany({
      where: { status: "PUBLISHED", industry: { not: null } },
      select: { industry: true },
      distinct: ["industry"],
    }),
  ]);

  const chips = [
    q && { key: "q", label: `"${q}"` },
    industry && { key: "industry", label: industry },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alumni Directory"
        description="Graduates working across every industry — reach out and see where their path led."
        count={total}
        countLabel="alumni"
      />

      <div className="space-y-3">
        <FilterBar>
          <SearchInput placeholder="Search by name, company, or industry" />
          <FilterSelect
            paramKey="industry"
            placeholder="All industries"
            options={industries
              .filter((i) => i.industry)
              .map((i) => ({ value: i.industry!, label: i.industry! }))}
          />
          <FilterSelect paramKey="sort" placeholder="Newest grads first" options={SORT_OPTIONS} />
        </FilterBar>
        <ActiveFilters chips={chips} />
      </div>

      {alumni.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          message="No alumni profiles match your search. Try a different name, company, or industry."
          actionHref="/alumni"
          actionLabel="Clear filters"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.map((person) => (
            <AlumniCard key={person.id} alumni={person} />
          ))}
        </div>
      )}
      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        searchParams={{ q, industry, sort }}
      />
    </div>
  );
}
