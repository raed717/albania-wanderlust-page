/**
 * Format a date to a readable string
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

/**
 * Format a date range
 */
export function formatDateRange(
  start: Date | string,
  end: Date | string,
): string {
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = typeof end === "string" ? new Date(end) : end;

  const startStr = formatDate(startDate, { month: "short", day: "numeric" });
  const endStr = formatDate(endDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startStr} - ${endStr}`;
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(d);
}

/**
 * Calculate number of nights between two dates
 */
export function calculateNights(
  checkIn: Date | string,
  checkOut: Date | string,
): number {
  const start = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const end = typeof checkOut === "string" ? new Date(checkOut) : checkOut;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
