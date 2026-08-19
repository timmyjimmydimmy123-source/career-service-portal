import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Laptop, Calendar, Mail, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resolveImageUrl } from "@/lib/storage";
import { formatDateRange } from "@/lib/dates";

export default async function VolunteerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const volunteer = await prisma.volunteer.findUnique({ where: { id } });

  if (!volunteer || volunteer.status !== "PUBLISHED") notFound();

  const dateRange = formatDateRange(volunteer.startDate, volunteer.endDate);
  const facts = [
    volunteer.location && { icon: MapPin, label: volunteer.location },
    volunteer.isRemote && { icon: Laptop, label: "Remote" },
    dateRange && { icon: Calendar, label: dateRange },
  ].filter(Boolean) as { icon: typeof MapPin; label: string }[];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/volunteer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Volunteer Opportunities
      </Link>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URLs can't be domain-allowlisted for next/image */}
            <img
              src={resolveImageUrl(volunteer.imageUrl, "logo")}
              alt=""
              className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-border"
            />
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight">{volunteer.title}</h1>
              <p className="text-muted-foreground">{volunteer.organization}</p>
              {volunteer.isRemote && <Badge variant="secondary">Remote</Badge>}
            </div>
          </div>

          {facts.length > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border/70 pt-4 text-sm text-muted-foreground">
              {facts.map((fact, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <fact.icon className="size-4" aria-hidden="true" />
                  {fact.label}
                </span>
              ))}
            </div>
          )}

          {(volunteer.contactEmail || volunteer.contactUrl) && (
            <div className="flex flex-wrap gap-3 border-t border-border/70 pt-4">
              {volunteer.contactUrl && (
                <a href={volunteer.contactUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg">
                    Learn More
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </Button>
                </a>
              )}
              {volunteer.contactEmail && (
                <a href={`mailto:${volunteer.contactEmail}`}>
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
            {volunteer.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
