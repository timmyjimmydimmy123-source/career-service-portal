import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [alumniCount, volunteerCount, jobCount] = await Promise.all([
    prisma.alumni.count(),
    prisma.volunteer.count(),
    prisma.job.count(),
  ]);

  const sections = [
    { href: "/admin/alumni", label: "Alumni", count: alumniCount },
    { href: "/admin/volunteer", label: "Volunteer Opportunities", count: volunteerCount },
    { href: "/admin/jobs", label: "Jobs", count: jobCount },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Manage portal content." />
      <div className="grid gap-4 sm:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">
                {section.count}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
