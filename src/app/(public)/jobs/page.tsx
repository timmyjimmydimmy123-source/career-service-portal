import { prisma } from "@/lib/prisma";
import { JobCard } from "@/components/cards/JobCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { postedDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="First Jobs"
        description="Entry-level listings for students."
      />
      {jobs.length === 0 ? (
        <EmptyState message="No job listings have been published yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
