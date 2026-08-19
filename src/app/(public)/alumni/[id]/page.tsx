import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, GraduationCap, Link2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { resolveImageUrl } from "@/lib/storage";

export default async function AlumniDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const alumni = await prisma.alumni.findUnique({ where: { id } });

  if (!alumni || alumni.status !== "PUBLISHED") notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/alumni"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Alumni
      </Link>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardContent className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URLs can't be domain-allowlisted for next/image */}
          <img
            src={resolveImageUrl(alumni.photoUrl, "avatar")}
            alt=""
            className="size-24 shrink-0 rounded-full object-cover ring-1 ring-border"
          />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{alumni.fullName}</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <GraduationCap className="size-4" aria-hidden="true" />
              Class of {alumni.graduationYear}
            </p>
            {(alumni.currentTitle || alumni.currentCompany) && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="size-4" aria-hidden="true" />
                {alumni.currentTitle}
                {alumni.currentTitle && alumni.currentCompany && " at "}
                {alumni.currentCompany}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {alumni.industry && <Badge variant="secondary">{alumni.industry}</Badge>}
              {alumni.linkedinUrl && (
                <a
                  href={alumni.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-muted"
                >
                  <Link2 className="size-3.5" aria-hidden="true" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardContent className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            About
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {alumni.bio}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
