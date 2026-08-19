import { HeartHandshake } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { VolunteerCard } from "@/components/cards/VolunteerCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/filters/SearchInput";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { FilterBar } from "@/components/filters/FilterBar";
import { ActiveFilters } from "@/components/filters/ActiveFilters";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 12;
const REMOTE_OPTIONS = [
  { value: "true", label: "Remote" },
  { value: "false", label: "In-person" },
];
const REMOTE_LABEL: Record<string, string> = { true: "Remote", false: "In-person" };

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];
const SORT_ORDER_BY: Record<string, Prisma.VolunteerOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
};

export default async function VolunteerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; remote?: string; sort?: string; page?: string }>;
}) {
  const { q, remote, sort, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const orderBy = SORT_ORDER_BY[sort ?? ""] ?? SORT_ORDER_BY.newest;

  const where = {
    status: "PUBLISHED" as const,
    ...(remote ? { isRemote: remote === "true" } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { organization: { contains: q, mode: "insensitive" as const } },
            { location: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [opportunities, total] = await Promise.all([
    prisma.volunteer.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.volunteer.count({ where }),
  ]);

  const chips = [
    q && { key: "q", label: `"${q}"` },
    remote && { key: "remote", label: REMOTE_LABEL[remote] ?? remote },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteer Opportunities"
        description="Find meaningful ways to serve the community."
        count={total}
        countLabel="opportunities"
      />

      <div className="space-y-3">
        <FilterBar>
          <SearchInput placeholder="Search by title, organization, or location" />
          <FilterSelect paramKey="remote" placeholder="All locations" options={REMOTE_OPTIONS} />
          <FilterSelect paramKey="sort" placeholder="Newest first" options={SORT_OPTIONS} />
        </FilterBar>
        <ActiveFilters chips={chips} />
      </div>

      {opportunities.length === 0 ? (
        <EmptyState
          icon={HeartHandshake}
          message="No volunteer opportunities match your search. Try a different title, organization, or location."
          actionHref="/volunteer"
          actionLabel="Clear filters"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opportunity) => (
            <VolunteerCard key={opportunity.id} volunteer={opportunity} />
          ))}
        </div>
      )}
      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        searchParams={{ q, remote, sort }}
      />
    </div>
  );
}
