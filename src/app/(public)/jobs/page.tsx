import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/cards/JobCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/filters/SearchInput";
import { FilterSelect } from "@/components/filters/FilterSelect";
import type { JobType } from "@prisma/client";

const PAGE_SIZE = 12;
const JOB_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "APPRENTICESHIP", label: "Apprenticeship" },
];

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; jobType?: string; page?: string }>;
}) {
  const { q, jobType, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

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
      orderBy: { postedDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="First Jobs"
        description="Entry-level listings for students."
      />
      <div className="flex flex-wrap gap-3">
        <SearchInput placeholder="Search by title, company, or location" />
        <FilterSelect paramKey="jobType" placeholder="All job types" options={JOB_TYPE_OPTIONS} />
      </div>
      {jobs.length === 0 ? (
        <EmptyState message="No job listings match your search." />
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
        searchParams={{ q, jobType }}
      />
    </div>
  );
}
