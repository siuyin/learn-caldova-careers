/**
 * Pure, side-effect-free helpers for working with job postings.
 *
 * These operate on plain `Job[]` arrays (already loaded from the content
 * collection by the calling page) so they can be unit tested without the Astro
 * content runtime or a database.
 */
import type { Job } from '../types/job';

/** Optional department and location selections used to narrow roles. */
export interface JobFilters {
  department?: string;
  location?: string;
}

/** Minimum job fields needed by the department and location filter. */
type FilterableJob = Pick<Job, 'department' | 'location'>;

/** Return jobs matching every selected filter (does not mutate input). */
export function filterJobs<T extends FilterableJob>(
  jobs: T[],
  filters: JobFilters = {},
): T[] {
  return jobs.filter(
    (job) =>
      (!filters.department || job.department === filters.department) &&
      (!filters.location || job.location === filters.location),
  );
}

/** Return jobs sorted by posted date, newest first (does not mutate input). */
export function sortByNewest(jobs: Job[]): Job[] {
  return [...jobs].sort(
    (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime(),
  );
}

/**
 * Format an ISO-8601 date as a human-readable posted date,
 * e.g. "January 5, 2027". Falls back to the raw value if unparseable.
 */
export function formatPostedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
