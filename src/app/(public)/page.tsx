import Link from "next/link";
import { GraduationCap, Briefcase, HeartHandshake, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AlumniCard } from "@/components/cards/AlumniCard";
import { JobCard } from "@/components/cards/JobCard";
import { VolunteerCard } from "@/components/cards/VolunteerCard";
import { HeroSearch } from "@/components/home/HeroSearch";

export const revalidate = 60;

const FEATURES = [
  {
    href: "/alumni",
    title: "Alumni",
    description: "Browse profiles from graduates working across every industry.",
    icon: GraduationCap,
  },
  {
    href: "/jobs",
    title: "Jobs",
    description: "Explore first-job listings suited for students.",
    icon: Briefcase,
  },
  {
    href: "/volunteer",
    title: "Volunteer",
    description: "Find service opportunities to give back to the community.",
    icon: HeartHandshake,
  },
];

export default async function HomePage() {
  const [alumniCount, jobCount, volunteerCount, recentAlumni, recentJobs, recentVolunteer] =
    await Promise.all([
      prisma.alumni.count({ where: { status: "PUBLISHED" } }),
      prisma.job.count({ where: { status: "PUBLISHED" } }),
      prisma.volunteer.count({ where: { status: "PUBLISHED" } }),
      prisma.alumni.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.job.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { postedDate: "desc" },
        take: 3,
      }),
      prisma.volunteer.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

  const stats = [
    { label: "Alumni profiles", value: alumniCount },
    { label: "Open job listings", value: jobCount },
    { label: "Volunteer opportunities", value: volunteerCount },
  ];

  return (
    <div className="space-y-20 pb-8">
      {/* Hero */}
      <section className="space-y-8 pt-4 text-center sm:pt-10">
        <div className="mx-auto max-w-2xl space-y-4">
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            For our school community
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Your bridge to alumni, service, and your first career step.
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Connect with graduates who&apos;ve been where you are, find meaningful
            ways to serve, and discover entry-level jobs built for students.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <HeroSearch />
        </div>

        <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-2 text-sm text-muted-foreground">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold text-foreground">{stat.value}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section aria-label="Explore the portal" className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <feature.icon className="size-5" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <h2 className="font-semibold">{feature.title}</h2>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
              Browse {feature.title}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>

      {/* Recently added jobs */}
      {recentJobs.length > 0 && (
        <SectionBlock title="Recently Added Jobs" viewAllHref="/jobs">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </SectionBlock>
      )}

      {/* Recently added volunteer opportunities */}
      {recentVolunteer.length > 0 && (
        <SectionBlock title="Recently Added Volunteer Opportunities" viewAllHref="/volunteer">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentVolunteer.map((v) => (
              <VolunteerCard key={v.id} volunteer={v} />
            ))}
          </div>
        </SectionBlock>
      )}

      {/* Recently added alumni */}
      {recentAlumni.length > 0 && (
        <SectionBlock title="Recently Added Alumni" viewAllHref="/alumni">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentAlumni.map((person) => (
              <AlumniCard key={person.id} alumni={person} />
            ))}
          </div>
        </SectionBlock>
      )}
    </div>
  );
}

function SectionBlock({
  title,
  viewAllHref,
  children,
}: {
  title: string;
  viewAllHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      {children}
    </section>
  );
}
