import type { Job } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

function toDateInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function JobForm({
  job,
  action,
}: {
  job?: Job;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 max-w-lg">
      <Field label="Title">
        <Input name="title" defaultValue={job?.title} required />
      </Field>
      <Field label="Company">
        <Input name="company" defaultValue={job?.company} required />
      </Field>
      <ImageUploadField
        name="imageUrl"
        label="Company logo"
        kind="logo"
        defaultValue={job?.imageUrl}
      />
      <Field label="Description">
        <textarea
          name="description"
          defaultValue={job?.description}
          required
          rows={4}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </Field>
      <Field label="Location">
        <Input name="location" defaultValue={job?.location ?? ""} />
      </Field>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="isRemote"
          defaultChecked={job?.isRemote}
          className="size-4"
        />
        Remote
      </label>
      <Field label="Job type">
        <select
          name="jobType"
          defaultValue={job?.jobType ?? "FULL_TIME"}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="APPRENTICESHIP">Apprenticeship</option>
        </select>
      </Field>
      <Field label="Apply URL">
        <Input name="applyUrl" defaultValue={job?.applyUrl ?? ""} />
      </Field>
      <Field label="Contact email">
        <Input name="contactEmail" defaultValue={job?.contactEmail ?? ""} />
      </Field>
      <Field label="Salary range">
        <Input name="salaryRange" defaultValue={job?.salaryRange ?? ""} />
      </Field>
      <Field label="Expires at">
        <Input
          name="expiresAt"
          type="date"
          defaultValue={toDateInputValue(job?.expiresAt)}
        />
      </Field>
      <Field label="Status">
        <select
          name="status"
          defaultValue={job?.status ?? "PUBLISHED"}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </Field>
      <Button type="submit" className="mt-2">
        {job ? "Save changes" : "Create job listing"}
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
