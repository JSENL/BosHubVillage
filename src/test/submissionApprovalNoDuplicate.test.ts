import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(srcRoot, '..');

function readSrc(relativePath: string): string {
  return readFileSync(join(srcRoot, relativePath), 'utf-8');
}

function readRepo(relativePath: string): string {
  return readFileSync(join(repoRoot, relativePath), 'utf-8');
}

describe('submission approval — no duplicate publishes', () => {
  it('DB approval triggers delete submissions only (no insert into published tables)', () => {
    const migration = readRepo(
      'supabase/migrations/20260526120000_approval_triggers_delete_only.sql'
    );
    expect(migration).not.toMatch(/INSERT\s+INTO\s+public\.events/i);
    expect(migration).not.toMatch(/INSERT\s+INTO\s+public\.local_resources/i);
    expect(migration).toMatch(/DELETE FROM public\.event_submissions WHERE id = NEW\.id/);
    expect(migration).toMatch(/DELETE FROM public\.local_resources_submissions WHERE id = NEW\.id/);
  });

  it('PendingEventSubmissions does not insert into events (hook publishes once)', () => {
    const src = readSrc('components/admin/PendingEventSubmissions.tsx');
    expect(src).not.toMatch(/\.from\(\s*['"]events['"]\s*\)[\s\S]*?\.insert/);
    expect(src).toMatch(/useEventSubmissionOperations/);
  });

  it('local resource submission card uses shared approval hook (no inline publish)', () => {
    const src = readSrc('components/LocalServiceSubmissionCard.tsx');
    expect(src).not.toMatch(/\.from\(\s*['"]local_resources['"]\s*\)[\s\S]*?\.insert/);
    expect(src).toMatch(/uselocalresourcesubmissionOperations/);
  });

  it('useEventSubmissionOperations inserts into events exactly once per approval', () => {
    const src = readSrc('hooks/useEventSubmissionOperations.tsx');
    const inserts = src.match(/\.from\(\s*['"]events['"]\s*\)\s*\.insert/g) ?? [];
    expect(inserts).toHaveLength(1);
  });

  it('useBusinessSubmissionOperations inserts into business exactly once per approval', () => {
    const src = readSrc('hooks/useBusinessSubmissionOperations.tsx');
    const inserts = src.match(/\.from\(\s*['"]business['"]\s*\)\s*\.insert/g) ?? [];
    expect(inserts).toHaveLength(1);
  });

  it('useLocalServiceSubmissionOperations inserts into local_resources exactly once per approval', () => {
    const src = readSrc('hooks/useLocalServiceSubmissionOperations.tsx');
    const inserts = src.match(/\.from\(\s*['"]local_resources['"]\s*\)\s*\.insert/g) ?? [];
    expect(inserts).toHaveLength(1);
  });
});

describe('useEventSubmissionOperations approve flow', () => {
  const insertMock = vi.fn();
  const updateMock = vi.fn();
  const selectMock = vi.fn();
  const singleMock = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    insertMock.mockReset();
    updateMock.mockReset();
    selectMock.mockReset();
    singleMock.mockReset();

    singleMock.mockResolvedValue({
      data: {
        id: 'sub-1',
        title: 'Test Event',
        description: 'Desc',
        category: 'Community',
        date: '2026-06-01',
        start_time: null,
        end_time: null,
        location: 'Boston',
        price: 0,
        max_attendees: null,
        is_recurring: false,
        recurring_pattern: null,
        latitude: 42.3,
        longitude: -71.1,
        submitted_by: 'user-1',
        image_url: null,
      },
      error: null,
    });

    insertMock.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: { id: 'event-1' }, error: null }),
      }),
    });

    updateMock.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    selectMock.mockReturnValue({
      eq: vi.fn().mockReturnValue({ single: singleMock }),
    });

    vi.doMock('@/integrations/supabase/client', () => ({
      supabase: {
        from: vi.fn((table: string) => {
          if (table === 'event_submissions') {
            return { select: selectMock, update: updateMock };
          }
          if (table === 'events') {
            return { insert: insertMock };
          }
          return {};
        }),
        functions: { invoke: vi.fn().mockResolvedValue({ data: null, error: null }) },
      },
    }));

    vi.doMock('@/hooks/useAuth', () => ({
      useAuth: () => ({ user: { id: 'admin-1' } }),
    }));

    vi.doMock('@/hooks/useAutoTranslate', () => ({
      useAutoTranslate: () => ({ translateContent: vi.fn() }),
    }));

    vi.doMock('sonner', () => ({
      toast: { success: vi.fn(), error: vi.fn() },
    }));
  });

  it('calls events.insert once when approving', async () => {
    const { useEventSubmissionOperations } = await import(
      '@/hooks/useEventSubmissionOperations'
    );
    const { approveSubmission } = useEventSubmissionOperations();
    await approveSubmission('sub-1', 'looks good');

    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledTimes(1);
  });
});
