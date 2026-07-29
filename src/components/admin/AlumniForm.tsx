import type { Alumni } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export function AlumniForm({
  alumni,
  action,
}: {
  alumni?: Alumni;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 max-w-lg">
      <Field label="Full name">
        <Input name="fullName" defaultValue={alumni?.fullName} required />
      </Field>
      <ImageUploadField
        name="photoUrl"
        label="Photo"
        kind="avatar"
        defaultValue={alumni?.photoUrl}
      />
      <Field label="Graduation year">
        <Input
          name="graduationYear"
          type="number"
          defaultValue={alumni?.graduationYear}
          required
        />
      </Field>
      <Field label="Current title">
        <Input name="currentTitle" defaultValue={alumni?.currentTitle ?? ""} />
      </Field>
      <Field label="Current company">
        <Input name="currentCompany" defaultValue={alumni?.currentCompany ?? ""} />
      </Field>
      <Field label="Industry">
        <Input name="industry" defaultValue={alumni?.industry ?? ""} />
      </Field>
      <Field label="LinkedIn URL">
        <Input name="linkedinUrl" defaultValue={alumni?.linkedinUrl ?? ""} />
      </Field>
      <Field label="Bio">
        <textarea
          name="bio"
          defaultValue={alumni?.bio}
          required
          rows={4}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </Field>
      <Field label="Status">
        <select
          name="status"
          defaultValue={alumni?.status ?? "PUBLISHED"}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </Field>
      <Button type="submit" className="mt-2">
        {alumni ? "Save changes" : "Create alumni profile"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
