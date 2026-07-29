import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { inviteAdmin, setAdminActive, deleteAdmin } from "@/lib/actions/admins";

export default async function AdminUsersPage() {
  const currentAdmin = await getCurrentUser();
  if (!currentAdmin || currentAdmin.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Users"
        description="Invite and manage admin accounts."
      />

      <div className="divide-y rounded-lg border">
        {admins.map((admin) => (
          <div key={admin.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-medium">{admin.fullName}</p>
              <p className="text-sm text-muted-foreground">{admin.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">{admin.role}</Badge>
              <Badge variant={admin.isActive ? "secondary" : "destructive"}>
                {admin.isActive ? "Active" : "Inactive"}
              </Badge>
              {admin.id !== currentAdmin.id && (
                <>
                  <ToggleActiveButton
                    isActive={admin.isActive}
                    action={setAdminActive.bind(null, admin.id, !admin.isActive)}
                  />
                  <DeleteButton action={deleteAdmin.bind(null, admin.id)} />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Invite Admin</h2>
        <form action={inviteAdmin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Full name</label>
            <Input name="fullName" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input name="email" type="email" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Role</label>
            <select
              name="role"
              defaultValue="EDITOR"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="EDITOR">Editor</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <Button type="submit" className="mt-2">
            Send invite
          </Button>
        </form>
      </div>
    </div>
  );
}
