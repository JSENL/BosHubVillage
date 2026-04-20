import { describe, expect, it } from 'vitest';
import { dateOnlySortKey, formatDateOnly } from '@/utils/common/dateUtils';

describe('date-only accuracy for admin displays', () => {
  it('shows the same calendar day for DATE values regardless of timezone context', () => {
    // Native JS parsing can shift date-only strings when formatted in some timezones.
    const timezoneShifted = new Date('2026-04-24').toLocaleDateString('en-US', {
      timeZone: 'America/Los_Angeles',
    });
    expect(timezoneShifted).toBe('4/23/2026');

    // Our formatter keeps the stored calendar day stable.
    expect(formatDateOnly('2026-04-24', 'en-US')).toBe('4/24/2026');
  });

  it('keeps ISO timestamps anchored to their date portion', () => {
    expect(formatDateOnly('2026-04-23T23:59:00.000Z', 'en-US')).toBe('4/23/2026');
    expect(formatDateOnly('2026-04-23T01:00:00-05:00', 'en-US')).toBe('4/23/2026');
  });

  it('sorts date-only strings in correct chronological order', () => {
    const dates = ['2026-04-24', '2026-04-23', '2026-05-01'];
    const sorted = [...dates].sort((a, b) => dateOnlySortKey(a) - dateOnlySortKey(b));
    expect(sorted).toEqual(['2026-04-23', '2026-04-24', '2026-05-01']);
  });
});

