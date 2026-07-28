export function PublicFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Career &amp; Service Portal
      </div>
    </footer>
  );
}
