import { describe, it, expect } from 'vitest';
import { formatTimeRange } from '@/utils/common/dateUtils';

describe('formatTimeRange returns 12-hour format', () => {
  it('formats morning time correctly', () => {
    expect(formatTimeRange('09:30')).toBe('9:30 AM');
  });

  it('formats afternoon time correctly', () => {
    expect(formatTimeRange('14:00')).toBe('2:00 PM');
  });

  it('formats midnight correctly', () => {
    expect(formatTimeRange('00:00')).toBe('12:00 AM');
  });

  it('formats noon correctly', () => {
    expect(formatTimeRange('12:00')).toBe('12:00 PM');
  });

  it('formats a time range correctly', () => {
    expect(formatTimeRange('09:00', '17:30')).toBe('9:00 AM - 5:30 PM');
  });

  it('does not contain 24-hour times like 13-23', () => {
    const result = formatTimeRange('22:45', '23:59');
    expect(result).toBe('10:45 PM - 11:59 PM');
    expect(result).not.toMatch(/\b(1[3-9]|2[0-3]):/);
  });

  it('returns empty string when no times provided', () => {
    expect(formatTimeRange()).toBe('');
  });
});
