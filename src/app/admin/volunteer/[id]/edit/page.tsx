import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/common/PageHeader";
import { VolunteerForm } from "@/components/admin/VolunteerForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { updateVolunteer, deleteVolunteer } from "@/lib/actions/volunteer";

export default async function EditVolunteerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const volunteer = await prisma.volunteer.findUnique({ where: { id } });

  if (!volunteer) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Edit Volunteer Opportunity" />
        <DeleteButton action={deleteVolunteer.bind(null, volunteer.id)} />
      </div>
      <VolunteerForm
        volunteer={volunteer}
        action={updateVolunteer.bind(null, volunteer.id)}
      />
    </div>
  );
}
