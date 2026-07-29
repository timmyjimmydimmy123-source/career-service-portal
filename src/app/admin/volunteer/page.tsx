import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteVolunteer } from "@/lib/actions/volunteer";
import type { RecordStatus } from "@prisma/client";

const PAGE_SIZE = 20;
const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export default async function AdminVolunteerPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = status ? { status: status as RecordStatus } : {};

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
      <div className="flex items-center justify-between">
        <PageHeader
          title="Volunteer Opportunities"
          description="Manage volunteer listings."
        />
        <Link href="/admin/volunteer/new">
          <Button>Add opportunity</Button>
        </Link>
      </div>
      <FilterSelect paramKey="status" placeholder="All statuses" options={STATUS_OPTIONS} />
      {opportunities.length === 0 ? (
        <EmptyState message="No volunteer opportunities yet." />
      ) : (
        <div className="divide-y rounded-lg border">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-medium">{opportunity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {opportunity.organization}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{opportunity.status}</Badge>
                <Link href={`/admin/volunteer/${opportunity.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <DeleteButton action={deleteVolunteer.bind(null, opportunity.id)} />
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
