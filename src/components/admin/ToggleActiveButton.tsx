"use client";

import { Button } from "@/components/ui/button";

export function ToggleActiveButton({
  isActive,
  action,
}: {
  isActive: boolean;
  action: () => void;
}) {
  return (
    <form action={action}>
      <Button type="submit" variant="outline" size="sm">
        {isActive ? "Deactivate" : "Activate"}
      </Button>
    </form>
  );
}
