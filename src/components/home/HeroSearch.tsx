"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DESTINATIONS = [
  { value: "/alumni", label: "Alumni", placeholder: "Search alumni by name or company..." },
  { value: "/jobs", label: "Jobs", placeholder: "Search jobs by title or company..." },
  { value: "/volunteer", label: "Volunteer", placeholder: "Search opportunities by title or org..." },
];

export function HeroSearch() {
  const router = useRouter();
  const [destination, setDestination] = useState(DESTINATIONS[0].value);
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
    router.push(`${destination}${params}`);
  }

  const active = DESTINATIONS.find((d) => d.value === destination) ?? DESTINATIONS[0];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:flex-row sm:items-center"
    >
      <label htmlFor="hero-destination" className="sr-only">
        Category
      </label>
      <select
        id="hero-destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="h-11 shrink-0 rounded-xl border border-input bg-transparent px-3 text-sm font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-40"
      >
        {DESTINATIONS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={active.placeholder}
          aria-label={active.placeholder}
          className="h-11 rounded-xl pl-9 text-base"
        />
      </div>

      <Button type="submit" size="lg" className="h-11 rounded-xl px-6">
        Search
      </Button>
    </form>
  );
}
