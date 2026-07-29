import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteJob } from "@/lib/actions/jobs";
import type { RecordStatus } from "@prisma/client";

const PAGE_SIZE = 20;
const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = status ? { status: status as RecordStatus } : {};

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Jobs" description="Manage job listings." />
        <Link href="/admin/jobs/new">
          <Button>Add job</Button>
        </Link>
      </div>
      <FilterSelect paramKey="status" placeholder="All statuses" options={STATUS_OPTIONS} />
      {jobs.length === 0 ? (
        <EmptyState message="No job listings yet." />
      ) : (
        <div className="divide-y rounded-lg border">
          {jobs.map((job) => (
            <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{job.status}</Badge>
                <Link href={`/admin/jobs/${job.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <DeleteButton action={deleteJob.bind(null, job.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        searchParams={{ status }}
      />
    </div>
  );
}
