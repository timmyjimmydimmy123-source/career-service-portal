import type { Volunteer } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function toDateInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function VolunteerForm({
  volunteer,
  action,
}: {
  volunteer?: Volunteer;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 max-w-lg">
      <Field label="Title">
        <Input name="title" defaultValue={volunteer?.title} required />
      </Field>
      <Field label="Organization">
        <Input name="organization" defaultValue={volunteer?.organization} required />
      </Field>
      <Field label="Description">
        <textarea
          name="description"
          defaultValue={volunteer?.description}
          required
          rows={4}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </Field>
      <Field label="Location">
        <Input name="location" defaultValue={volunteer?.location ?? ""} />
      </Field>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="isRemote"
          defaultChecked={volunteer?.isRemote}
          className="size-4"
        />
        Remote
      </label>
      <Field label="Contact email">
        <Input name="contactEmail" defaultValue={volunteer?.contactEmail ?? ""} />
      </Field>
      <Field label="Contact URL">
        <Input name="contactUrl" defaultValue={volunteer?.contactUrl ?? ""} />
      </Field>
      <Field label="Start date">
        <Input
          name="startDate"
          type="date"
          defaultValue={toDateInputValue(volunteer?.startDate)}
        />
      </Field>
      <Field label="End date">
        <Input
          name="endDate"
          type="date"
          defaultValue={toDateInputValue(volunteer?.endDate)}
        />
      </Field>
      <Field label="Status">
        <select
          name="status"
          defaultValue={volunteer?.status ?? "PUBLISHED"}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </Field>
      <Button type="submit" className="mt-2">
        {volunteer ? "Save changes" : "Create opportunity"}
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
