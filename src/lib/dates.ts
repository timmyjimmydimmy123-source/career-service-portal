const DAY_MS = 24 * 60 * 60 * 1000;

export function isRecent(date: Date, withinDays = 14) {
  return Date.now() - new Date(date).getTime() <= withinDays * DAY_MS;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(date),
  );
}

export function formatDateRange(start: Date | null, end: Date | null) {
  if (!start && !end) return null;
  if (start && end) return `${formatDate(start)} - ${formatDate(end)}`;
  return formatDate((start ?? end) as Date);
}
