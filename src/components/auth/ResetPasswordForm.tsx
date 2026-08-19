"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type Status = "verifying" | "ready" | "invalid";

export function ResetPasswordForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function establishSession() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      const code = new URLSearchParams(window.location.search).get("code");

      let sessionError: string | undefined;

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        sessionError = error?.message;
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        sessionError = error?.message;
      } else {
        const { data } = await supabase.auth.getSession();
        if (!data.session) sessionError = "No active session";
      }

      // Strip tokens/code from the URL regardless of outcome.
      window.history.replaceState(null, "", window.location.pathname);

      setStatus(sessionError ? "invalid" : "ready");
    }

    establishSession();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const password = new FormData(e.currentTarget).get("password") as string;
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    router.push("/login");
  }

  if (status === "verifying") {
    return <p className="text-sm text-muted-foreground">Verifying link...</p>;
  }

  if (status === "invalid") {
    return (
      <p className="text-sm text-destructive">
        This link is invalid or has expired. Request a new one from the{" "}
        <a href="/forgot-password" className="underline">
          forgot password
        </a>{" "}
        page.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          New password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={submitting} className="mt-2">
        {submitting ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}
