import Link from "next/link";
import type { Alumni } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AlumniCard({ alumni }: { alumni: Alumni }) {
  return (
    <Link href={`/alumni/${alumni.id}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle>{alumni.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>Class of {alumni.graduationYear}</p>
          {alumni.currentTitle && alumni.currentCompany && (
            <p>
              {alumni.currentTitle} at {alumni.currentCompany}
            </p>
          )}
          {alumni.industry && <p>{alumni.industry}</p>}
        </CardContent>
      </Card>
    </Link>
  );
}
