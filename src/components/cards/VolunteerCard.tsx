import Link from "next/link";
import type { Volunteer } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  return (
    <Link href={`/volunteer/${volunteer.id}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle>{volunteer.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{volunteer.organization}</p>
          {volunteer.location && <p>{volunteer.location}</p>}
          {volunteer.isRemote && <Badge variant="secondary">Remote</Badge>}
        </CardContent>
      </Card>
    </Link>
  );
}
