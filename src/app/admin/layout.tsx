import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentUser();

  if (!admin || !admin.isActive) {
    redirect("/login");
  }

  return (
    <div>
      <AdminNavbar />
      <main id="main-content" className="mx-auto max-w-5xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
