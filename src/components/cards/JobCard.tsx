import Link from "next/link";
import type { Job } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const JOB_TYPE_LABEL: Record<Job["jobType"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
  APPRENTICESHIP: "Apprenticeship",
};

export function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{job.company}</p>
          {job.location && <p>{job.location}</p>}
          <Badge variant="secondary">{JOB_TYPE_LABEL[job.jobType]}</Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
