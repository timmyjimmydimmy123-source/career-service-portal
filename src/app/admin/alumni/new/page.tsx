import { PageHeader } from "@/components/common/PageHeader";
import { AlumniForm } from "@/components/admin/AlumniForm";
import { createAlumni } from "@/lib/actions/alumni";

export default function NewAlumniPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add Alumni" />
      <AlumniForm action={createAlumni} />
    </div>
  );
}
