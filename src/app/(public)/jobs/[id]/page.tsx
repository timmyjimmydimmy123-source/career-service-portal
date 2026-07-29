import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";

const JOB_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
  APPRENTICESHIP: "Apprenticeship",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job || job.status !== "PUBLISHED") notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={job.title} description={job.company} />
      <div className="space-y-2 text-sm">
        {job.location && <p>Location: {job.location}</p>}
        {job.isRemote && <Badge variant="secondary">Remote</Badge>}
        <Badge variant="secondary">{JOB_TYPE_LABEL[job.jobType]}</Badge>
        {job.salaryRange && <p>Salary: {job.salaryRange}</p>}
        <p className="text-muted-foreground">{job.description}</p>
        {job.applyUrl && (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Apply
          </a>
        )}
        {job.contactEmail && (
          <p>
            Contact:{" "}
            <a
              href={`mailto:${job.contactEmail}`}
              className="text-primary underline"
            >
              {job.contactEmail}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
