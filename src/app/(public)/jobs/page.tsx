import { Briefcase } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/cards/JobCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/filters/SearchInput";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { FilterBar } from "@/components/filters/FilterBar";
import { ActiveFilters } from "@/components/filters/ActiveFilters";
import type { JobType, Prisma } from "@prisma/client";

const PAGE_SIZE = 12;
const JOB_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "APPRENTICESHIP", label: "Apprenticeship" },
];
const JOB_TYPE_LABEL = Object.fromEntries(JOB_TYPE_OPTIONS.map((o) => [o.value, o.label]));

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];
const SORT_ORDER_BY: Record<string, Prisma.JobOrderByWithRelationInput> = {
  newest: { postedDate: "desc" },
  oldest: { postedDate: "asc" },
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; jobType?: string; sort?: string; page?: string }>;
}) {
  const { q, jobType, sort, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const orderBy = SORT_ORDER_BY[sort ?? ""] ?? SORT_ORDER_BY.newest;

  const where = {
    status: "PUBLISHED" as const,
    ...(jobType ? { jobType: jobType as JobType } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { company: { contains: q, mode: "insensitive" as const } },
            { location: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where }),
  ]);

  const chips = [
    q && { key: "q", label: `"${q}"` },
    jobType && { key: "jobType", label: JOB_TYPE_LABEL[jobType] ?? jobType },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Board"
        description="Entry-level and first-job listings built for students."
        count={total}
        countLabel="openings"
      />

      <div className="space-y-3">
        <FilterBar>
          <SearchInput placeholder="Search by title, company, or location" />
          <FilterSelect paramKey="jobType" placeholder="All job types" options={JOB_TYPE_OPTIONS} />
          <FilterSelect paramKey="sort" placeholder="Newest first" options={SORT_OPTIONS} />
        </FilterBar>
        <ActiveFilters chips={chips} />
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          message="No job listings match your search. Try a different title, company, or location."
          actionHref="/jobs"
          actionLabel="Clear filters"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        searchParams={{ q, jobType, sort }}
      />
    </div>
  );
}
