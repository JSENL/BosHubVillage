import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Contract tests: each user-facing submission flow must call Supabase `.from('<table>')`
 * for the pending-review table (and secondary tables where applicable).
 * Catches accidental renames or copy-paste to the wrong table.
 */
const srcRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

function readSrc(relativePath: string): string {
  return readFileSync(join(srcRoot, relativePath), 'utf-8');
}

describe('submission forms → Supabase tables', () => {
  it('SubmitBusiness inserts into business_submissions', () => {
    const src = readSrc('pages/SubmitBusiness.tsx');
    expect(src).toMatch(/\.from\(\s*['"]business_submissions['"]\s*\)/);
    expect(src).toMatch(/status:\s*['"]pending['"]/);
  });

  it('SubmitNews inserts into news_submissions and optionally news_submission_media', () => {
    const src = readSrc('pages/SubmitNews.tsx');
    expect(src).toMatch(/\.from\(\s*['"]news_submissions['"]\s*\)/);
    expect(src).toMatch(/\.from\(\s*['"]news_submission_media['"]\s*\)/);
    expect(src).toMatch(/status:\s*['"]pending['"]/);
  });

  it('SubmitLocalService inserts into local_resources_submissions', () => {
    const src = readSrc('pages/SubmitLocalService.tsx');
    expect(src).toMatch(/\.from\(\s*['"]local_resources_submissions['"]\s*\)/);
    expect(src).toMatch(/status:\s*['"]pending['"]/);
  });

  it('useEventSubmissionCreation inserts into event_submissions and optionally event_submissions_media', () => {
    const src = readSrc('hooks/useEventSubmissionCreation.tsx');
    expect(src).toMatch(/\.from\(\s*['"]event_submissions['"]\s*\)/);
    expect(src).toMatch(/\.from\(\s*['"]event_submissions_media['"]\s*\)/);
    expect(src).toMatch(/submitted_by:\s*user\.id/);
  });
});
