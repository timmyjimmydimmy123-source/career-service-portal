import Link from "next/link";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { getCurrentUser } from "@/lib/auth";

const links = [
  { href: "/admin/alumni", label: "Alumni" },
  { href: "/admin/volunteer", label: "Volunteer" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/settings", label: "Settings" },
];

export async function AdminNavbar() {
  const admin = await getCurrentUser();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
        <Link href="/admin" className="font-semibold">
          Admin
        </Link>
        <nav aria-label="Admin" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
          {admin?.role === "SUPER_ADMIN" && (
            <Link href="/admin/users" className="hover:underline">
              Users
            </Link>
          )}
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
