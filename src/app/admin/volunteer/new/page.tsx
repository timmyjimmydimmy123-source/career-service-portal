import { PageHeader } from "@/components/common/PageHeader";
import { VolunteerForm } from "@/components/admin/VolunteerForm";
import { createVolunteer } from "@/lib/actions/volunteer";

export default function NewVolunteerPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add Volunteer Opportunity" />
      <VolunteerForm action={createVolunteer} />
    </div>
  );
}
