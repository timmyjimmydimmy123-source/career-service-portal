import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile, changeOwnPassword } from "@/lib/actions/profile";

export default async function AdminSettingsPage() {
  const admin = await getCurrentUser();
  if (!admin) return null;

  return (
    <div className="max-w-sm space-y-10">
      <PageHeader title="Settings" description="Manage your admin profile." />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <form action={updateProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Full name</label>
            <Input name="fullName" defaultValue={admin.fullName} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input value={admin.email} disabled />
          </div>
          <Button type="submit" className="mt-2">
            Save changes
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <form action={changeOwnPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">New password</label>
            <Input name="password" type="password" minLength={8} required />
          </div>
          <Button type="submit" className="mt-2">
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}
