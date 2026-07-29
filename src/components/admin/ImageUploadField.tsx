"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { resolveImageUrl, validateImageFile } from "@/lib/storage";
import { uploadImage } from "@/lib/actions/storage";

export function ImageUploadField({
  name,
  label,
  defaultValue,
  kind,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  kind: "avatar" | "logo";
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<string | null>(null);

  async function handleFile(file: File) {
    const validationError = validateImageFile(file);
    if (validationError) {
      setStatus(validationError);
      return;
    }

    setStatus("Uploading...");
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImage(formData);

    if ("error" in result) {
      setStatus(result.error);
      return;
    }

    setUrl(result.url);
    setStatus(null);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URLs can't be domain-allowlisted for next/image */}
        <img
          src={resolveImageUrl(url, kind)}
          alt=""
          className="size-12 rounded-md object-cover ring-1 ring-foreground/10"
        />
        <Input
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL"
        />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="text-sm"
      />
      {status && <p className="text-xs text-muted-foreground">{status}</p>}
    </div>
  );
}
