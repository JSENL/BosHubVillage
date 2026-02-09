import { describe, it, expect } from 'vitest';
import { formatTimeRange } from '@/utils/mapPopupUtils';

describe('Mapbox popup formatTimeRange uses 12-hour format', () => {
  it('formats evening time range to 12-hour', () => {
    expect(formatTimeRange('19:00', '23:00')).toBe('7:00 PM - 11:00 PM');
  });

  it('formats morning time range to 12-hour', () => {
    expect(formatTimeRange('09:30', '11:00')).toBe('9:30 AM - 11:00 AM');
  });

  it('formats midnight correctly', () => {
    expect(formatTimeRange('00:00', '01:00')).toBe('12:00 AM - 1:00 AM');
  });

  it('formats noon correctly', () => {
    expect(formatTimeRange('12:00', '13:00')).toBe('12:00 PM - 1:00 PM');
  });

  it('does not output 24-hour times', () => {
    const result = formatTimeRange('19:00', '00:00');
    expect(result).toBe('7:00 PM - 12:00 AM');
    expect(result).not.toMatch(/\b(1[3-9]|2[0-3]):/);
  });

  it('handles single start time', () => {
    expect(formatTimeRange('14:30', '')).toBe('2:30 PM');
  });

  it('returns Time TBD when no times', () => {
    expect(formatTimeRange('', '')).toBe('Time TBD');
  });
});
