import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional class names with Tailwind conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format date/time helper for helpdesk preview
 */
export function formatRelativeTime(minutesAgo: number): string {
  if (minutesAgo < 1) return 'Just now';
  if (minutesAgo === 1) return '1 min ago';
  if (minutesAgo < 60) return `${minutesAgo} mins ago`;
  const hours = Math.floor(minutesAgo / 60);
  return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
}
