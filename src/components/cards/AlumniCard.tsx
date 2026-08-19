import Link from "next/link";
import type { Alumni } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, GraduationCap, ArrowRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/storage";
import { isRecent } from "@/lib/dates";

export function AlumniCard({ alumni }: { alumni: Alumni }) {
  return (
    <Link
      href={`/alumni/${alumni.id}`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full gap-3 rounded-2xl border-border/80 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md">
        <CardHeader className="flex-row items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URLs can't be domain-allowlisted for next/image */}
          <img
            src={resolveImageUrl(alumni.photoUrl, "avatar")}
            alt=""
            className="size-14 shrink-0 rounded-full object-cover ring-1 ring-border"
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="truncate font-semibold leading-tight">{alumni.fullName}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <GraduationCap className="size-3.5 shrink-0" aria-hidden="true" />
              Class of {alumni.graduationYear}
            </p>
          </div>
          {isRecent(alumni.createdAt) && (
            <Badge variant="highlight" className="shrink-0">
              New
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {(alumni.currentTitle || alumni.currentCompany) && (
            <p className="flex items-start gap-1.5 text-sm">
              <Building2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>
                {alumni.currentTitle}
                {alumni.currentTitle && alumni.currentCompany && " at "}
                {alumni.currentCompany}
              </span>
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            {alumni.industry ? (
              <Badge variant="secondary">{alumni.industry}</Badge>
            ) : (
              <span />
            )}
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-90 transition-opacity group-hover:opacity-100">
              View Profile
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
