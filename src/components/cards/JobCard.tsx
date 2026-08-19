import Link from "next/link";
import type { Job } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Laptop, Calendar, ArrowRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/storage";
import { isRecent, formatDate } from "@/lib/dates";

const JOB_TYPE_LABEL: Record<Job["jobType"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
  APPRENTICESHIP: "Apprenticeship",
};

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full gap-3 rounded-2xl border-border/80 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md">
        <CardHeader className="flex-row items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URLs can't be domain-allowlisted for next/image */}
          <img
            src={resolveImageUrl(job.imageUrl, "logo")}
            alt=""
            className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-border"
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="truncate font-semibold leading-tight">{job.title}</p>
            <p className="truncate text-sm text-muted-foreground">{job.company}</p>
          </div>
          {isRecent(job.postedDate) && (
            <Badge variant="highlight" className="shrink-0">
              New
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden="true" />
                {job.location}
              </span>
            )}
            {job.isRemote && (
              <span className="flex items-center gap-1">
                <Laptop className="size-3.5" aria-hidden="true" />
                Remote
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" aria-hidden="true" />
              Posted {formatDate(job.postedDate)}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{JOB_TYPE_LABEL[job.jobType]}</Badge>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-90 transition-opacity group-hover:opacity-100">
              View Job
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
