import { describe, it, expect } from 'vitest';
import { formatDateOnly, parseDateOnlyLocal } from '@/utils/common/dateUtils';

describe('dateUtils timezone-safe dates', () => {
  it('formatDateOnly keeps YYYY-MM-DD calendar day (not shifted like naive Date)', () => {
    expect(formatDateOnly('2026-06-20', 'en-US')).toBe('6/20/2026');
    expect(new Date('2026-06-20').toLocaleDateString('en-US')).toBe('6/19/2026');
  });

  it('parseDateOnlyLocal uses local calendar components', () => {
    const d = parseDateOnlyLocal('2026-06-20');
    expect(d?.getFullYear()).toBe(2026);
    expect(d?.getMonth()).toBe(5);
    expect(d?.getDate()).toBe(20);
  });
});
