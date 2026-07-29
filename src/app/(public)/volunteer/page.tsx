import { prisma } from "@/lib/prisma";
import { VolunteerCard } from "@/components/cards/VolunteerCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/filters/SearchInput";
import { FilterSelect } from "@/components/filters/FilterSelect";

const PAGE_SIZE = 12;
const REMOTE_OPTIONS = [
  { value: "true", label: "Remote" },
  { value: "false", label: "In-person" },
];

export default async function VolunteerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; remote?: string; page?: string }>;
}) {
  const { q, remote, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

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
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.volunteer.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteer Opportunities"
        description="Find ways to serve the community."
      />
      <div className="flex flex-wrap gap-3">
        <SearchInput placeholder="Search by title, organization, or location" />
        <FilterSelect paramKey="remote" placeholder="All locations" options={REMOTE_OPTIONS} />
      </div>
      {opportunities.length === 0 ? (
        <EmptyState message="No volunteer opportunities match your search." />
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
        searchParams={{ q, remote }}
      />
    </div>
  );
}
