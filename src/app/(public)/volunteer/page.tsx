import { prisma } from "@/lib/prisma";
import { VolunteerCard } from "@/components/cards/VolunteerCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";

export default async function VolunteerPage() {
  const opportunities = await prisma.volunteer.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteer Opportunities"
        description="Find ways to serve the community."
      />
      {opportunities.length === 0 ? (
        <EmptyState message="No volunteer opportunities have been published yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opportunity) => (
            <VolunteerCard key={opportunity.id} volunteer={opportunity} />
          ))}
        </div>
      )}
    </div>
  );
}
