export function PageHeader({
  title,
  description,
  count,
  countLabel,
}: {
  title: string;
  description?: string;
  count?: number;
  countLabel?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {typeof count === "number" && (
          <p className="text-sm text-muted-foreground">
            {count} {countLabel ?? "results"}
          </p>
        )}
      </div>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
