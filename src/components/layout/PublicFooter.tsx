import Link from "next/link";

const links = [
  { href: "/alumni", label: "Alumni" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/jobs", label: "Jobs" },
  { href: "/login", label: "Admin Login" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border/70 bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Career &amp; Service Portal</p>
          <p className="text-sm text-muted-foreground">
            Connecting our school community with alumni, service, and career opportunities.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border/70 px-6 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Career &amp; Service Portal
      </div>
    </footer>
  );
}
