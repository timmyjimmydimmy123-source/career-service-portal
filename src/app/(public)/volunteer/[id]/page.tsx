import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";

export default async function VolunteerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const volunteer = await prisma.volunteer.findUnique({ where: { id } });

  if (!volunteer || volunteer.status !== "PUBLISHED") notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={volunteer.title} description={volunteer.organization} />
      <div className="space-y-2 text-sm">
        {volunteer.location && <p>Location: {volunteer.location}</p>}
        {volunteer.isRemote && <Badge variant="secondary">Remote</Badge>}
        <p className="text-muted-foreground">{volunteer.description}</p>
        {volunteer.contactEmail && (
          <p>
            Contact:{" "}
            <a
              href={`mailto:${volunteer.contactEmail}`}
              className="text-primary underline"
            >
              {volunteer.contactEmail}
            </a>
          </p>
        )}
        {volunteer.contactUrl && (
          <a
            href={volunteer.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Learn more
          </a>
        )}
      </div>
    </div>
  );
}
