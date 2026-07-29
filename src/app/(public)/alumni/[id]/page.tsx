import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/common/PageHeader";

export default async function AlumniDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const alumni = await prisma.alumni.findUnique({ where: { id } });

  if (!alumni || alumni.status !== "PUBLISHED") notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={alumni.fullName}
        description={`Class of ${alumni.graduationYear}`}
      />
      <div className="space-y-2 text-sm">
        {alumni.currentTitle && alumni.currentCompany && (
          <p>
            {alumni.currentTitle} at {alumni.currentCompany}
          </p>
        )}
        {alumni.industry && <p>Industry: {alumni.industry}</p>}
        <p className="text-muted-foreground">{alumni.bio}</p>
        {alumni.linkedinUrl && (
          <a
            href={alumni.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}
