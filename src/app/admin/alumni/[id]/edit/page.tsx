import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/common/PageHeader";
import { AlumniForm } from "@/components/admin/AlumniForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { updateAlumni, deleteAlumni } from "@/lib/actions/alumni";

export default async function EditAlumniPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const alumni = await prisma.alumni.findUnique({ where: { id } });

  if (!alumni) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Edit Alumni" />
        <DeleteButton action={deleteAlumni.bind(null, alumni.id)} />
      </div>
      <AlumniForm alumni={alumni} action={updateAlumni.bind(null, alumni.id)} />
    </div>
  );
}
