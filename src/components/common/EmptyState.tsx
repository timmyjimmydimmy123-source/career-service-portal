import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";
import Link from "next/link";

export function EmptyState({
  message,
  icon: Icon = SearchX,
  actionHref,
  actionLabel,
}: {
  message: string;
  icon?: LucideIcon;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="text-sm font-medium text-primary hover:underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
