import { PageHeader } from "@/components/common/PageHeader";
import { JobForm } from "@/components/admin/JobForm";
import { createJob } from "@/lib/actions/jobs";

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add Job" />
      <JobForm action={createJob} />
    </div>
  );
}
