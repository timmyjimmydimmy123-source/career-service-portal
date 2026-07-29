import { prisma } from "@/lib/prisma";
import { AlumniCard } from "@/components/cards/AlumniCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/filters/SearchInput";
import { FilterSelect } from "@/components/filters/FilterSelect";

const PAGE_SIZE = 12;

export default async function AlumniPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; industry?: string; page?: string }>;
}) {
  const { q, industry, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

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
      orderBy: { graduationYear: "desc" },
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alumni"
        description="Graduates working across every industry."
      />
      <div className="flex flex-wrap gap-3">
        <SearchInput placeholder="Search by name, company, or industry" />
        <FilterSelect
          paramKey="industry"
          placeholder="All industries"
          options={industries
            .filter((i) => i.industry)
            .map((i) => ({ value: i.industry!, label: i.industry! }))}
        />
      </div>
      {alumni.length === 0 ? (
        <EmptyState message="No alumni profiles match your search." />
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
        searchParams={{ q, industry }}
      />
    </div>
  );
}
