import Link from "next/link";
import type { Alumni } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resolveImageUrl } from "@/lib/storage";

export function AlumniCard({ alumni }: { alumni: Alumni }) {
  return (
    <Link href={`/alumni/${alumni.id}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader className="flex-row items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URLs can't be domain-allowlisted for next/image */}
          <img
            src={resolveImageUrl(alumni.photoUrl, "avatar")}
            alt=""
            className="size-10 shrink-0 rounded-full object-cover"
          />
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
