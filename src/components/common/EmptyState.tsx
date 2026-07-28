export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
