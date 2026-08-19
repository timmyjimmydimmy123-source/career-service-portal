import Link from "next/link";
import type { Volunteer } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Laptop, Calendar, ArrowRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/storage";
import { isRecent, formatDateRange } from "@/lib/dates";

export function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const dateRange = formatDateRange(volunteer.startDate, volunteer.endDate);

  return (
    <Link
      href={`/volunteer/${volunteer.id}`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full gap-3 rounded-2xl border-border/80 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md">
        <CardHeader className="flex-row items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URLs can't be domain-allowlisted for next/image */}
          <img
            src={resolveImageUrl(volunteer.imageUrl, "logo")}
            alt=""
            className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-border"
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="truncate font-semibold leading-tight">{volunteer.title}</p>
            <p className="truncate text-sm text-muted-foreground">{volunteer.organization}</p>
          </div>
          {isRecent(volunteer.createdAt) && (
            <Badge variant="highlight" className="shrink-0">
              New
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {volunteer.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden="true" />
                {volunteer.location}
              </span>
            )}
            {volunteer.isRemote && (
              <span className="flex items-center gap-1">
                <Laptop className="size-3.5" aria-hidden="true" />
                Remote
              </span>
            )}
            {dateRange && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" aria-hidden="true" />
                {dateRange}
              </span>
            )}
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{volunteer.description}</p>
          <div className="flex items-center justify-end">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-90 transition-opacity group-hover:opacity-100">
              View Opportunity
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
