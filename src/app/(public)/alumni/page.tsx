import { prisma } from "@/lib/prisma";
import { AlumniCard } from "@/components/cards/AlumniCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";

export default async function AlumniPage() {
  const alumni = await prisma.alumni.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { graduationYear: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alumni"
        description="Graduates working across every industry."
      />
      {alumni.length === 0 ? (
        <EmptyState message="No alumni profiles have been published yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.map((person) => (
            <AlumniCard key={person.id} alumni={person} />
          ))}
        </div>
      )}
    </div>
  );
}
