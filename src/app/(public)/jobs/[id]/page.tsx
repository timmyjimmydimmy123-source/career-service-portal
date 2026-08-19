import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Laptop,
  Calendar,
  DollarSign,
  Mail,
  ExternalLink,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resolveImageUrl } from "@/lib/storage";
import { formatDate } from "@/lib/dates";

const JOB_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
  APPRENTICESHIP: "Apprenticeship",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job || job.status !== "PUBLISHED") notFound();

  const facts = [
    job.location && { icon: MapPin, label: job.location },
    job.isRemote && { icon: Laptop, label: "Remote" },
    { icon: Calendar, label: `Posted ${formatDate(job.postedDate)}` },
    job.expiresAt && { icon: Calendar, label: `Apply by ${formatDate(job.expiresAt)}` },
    job.salaryRange && { icon: DollarSign, label: job.salaryRange },
  ].filter(Boolean) as { icon: typeof MapPin; label: string }[];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Jobs
      </Link>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URLs can't be domain-allowlisted for next/image */}
            <img
              src={resolveImageUrl(job.imageUrl, "logo")}
              alt=""
              className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-border"
            />
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight">{job.title}</h1>
              <p className="text-muted-foreground">{job.company}</p>
              <Badge variant="secondary">{JOB_TYPE_LABEL[job.jobType]}</Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border/70 pt-4 text-sm text-muted-foreground">
            {facts.map((fact, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <fact.icon className="size-4" aria-hidden="true" />
                {fact.label}
              </span>
            ))}
          </div>

          {(job.applyUrl || job.contactEmail) && (
            <div className="flex flex-wrap gap-3 border-t border-border/70 pt-4">
              {job.applyUrl && (
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg">
                    Apply Now
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </Button>
                </a>
              )}
              {job.contactEmail && (
                <a href={`mailto:${job.contactEmail}`}>
                  <Button variant="outline" size="lg">
                    <Mail className="size-4" aria-hidden="true" />
                    Contact
                  </Button>
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardContent className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Description
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {job.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
