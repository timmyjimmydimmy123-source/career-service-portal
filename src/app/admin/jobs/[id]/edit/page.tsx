import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/common/PageHeader";
import { JobForm } from "@/components/admin/JobForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { updateJob, deleteJob } from "@/lib/actions/jobs";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Edit Job" />
        <DeleteButton action={deleteJob.bind(null, job.id)} />
      </div>
      <JobForm job={job} action={updateJob.bind(null, job.id)} />
    </div>
  );
}
