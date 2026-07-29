import Link from "next/link";

const links = [
  { href: "/alumni", label: "Alumni" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/jobs", label: "Jobs" },
];

export function PublicNavbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
        <Link href="/" className="font-semibold">
          Career &amp; Service Portal
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="hover:underline">
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
