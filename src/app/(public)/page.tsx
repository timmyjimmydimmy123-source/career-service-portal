import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const sections = [
  {
    href: "/alumni",
    title: "Alumni",
    description: "Browse profiles from graduates working across every industry.",
  },
  {
    href: "/volunteer",
    title: "Volunteer",
    description: "Find service opportunities in the community.",
  },
  {
    href: "/jobs",
    title: "Jobs",
    description: "Explore first-job listings suited for students.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Career &amp; Service Portal
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Connect with alumni, find volunteer opportunities, and discover
          first jobs — all in one place.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {section.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
