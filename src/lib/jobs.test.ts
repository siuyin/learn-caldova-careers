import { describe, it, expect } from 'vitest';
import { filterJobs, sortByNewest, formatPostedDate } from './jobs';
import type { Job } from '../types/job';

function makeJob(slug: string, postedDate: string): Job {
  return {
    slug,
    title: `Role ${slug}`,
    department: 'Technology',
    location: 'Remote',
    type: 'Full-time',
    remote: true,
    postedDate,
    summary: 'A role.',
  };
}

describe('filterJobs', () => {
  const jobs: Job[] = [
    {
      ...makeJob('financial-analyst', '2027-04-05'),
      department: 'Finance',
      location: 'Woodinville, WA, USA',
    },
    {
      ...makeJob('financial-reconciliation-specialist', '2027-03-01'),
      department: 'Finance',
      location: 'Helsinki, Finland',
    },
    {
      ...makeJob('frontend-engineer', '2027-01-06'),
      department: 'Technology',
      location: 'Remote (US & Canada)',
    },
  ];

  it('filters by department', () => {
    expect(filterJobs(jobs, { department: 'Finance' }).map((job) => job.slug)).toEqual([
      'financial-analyst',
      'financial-reconciliation-specialist',
    ]);
  });

  it('filters by location', () => {
    expect(filterJobs(jobs, { location: 'Helsinki, Finland' }).map((job) => job.slug)).toEqual([
      'financial-reconciliation-specialist',
    ]);
  });

  it('combines department and location filters with AND', () => {
    expect(
      filterJobs(jobs, { department: 'Finance', location: 'Woodinville, WA, USA' }).map(
        (job) => job.slug,
      ),
    ).toEqual(['financial-analyst']);
  });

  it('returns all jobs when filters are reset', () => {
    expect(filterJobs(jobs).map((job) => job.slug)).toEqual([
      'financial-analyst',
      'financial-reconciliation-specialist',
      'frontend-engineer',
    ]);
  });

  it('returns no jobs when no roles match', () => {
    expect(filterJobs(jobs, { department: 'Finance', location: 'Remote (US & Canada)' })).toEqual(
      [],
    );
  });
});

describe('sortByNewest', () => {
  it('orders jobs by posted date, newest first', () => {
    const jobs = [
      makeJob('a', '2027-01-01'),
      makeJob('b', '2027-03-15'),
      makeJob('c', '2027-02-10'),
    ];
    expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
  });

  it('does not mutate the input array', () => {
    const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
    const original = jobs.map((j) => j.slug);
    sortByNewest(jobs);
    expect(jobs.map((j) => j.slug)).toEqual(original);
  });
});

describe('formatPostedDate', () => {
  it('formats an ISO date as a readable string', () => {
    expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
  });

  it('returns the raw value when the date is unparseable', () => {
    expect(formatPostedDate('not-a-date')).toBe('not-a-date');
  });
});
