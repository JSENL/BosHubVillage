import { describe, it, expect } from 'vitest';
import { getQuickBrowseItems } from '@/utils/quickBrowseUtils';
import { UnifiedItem } from '@/types/unifiedItem';

const makeItem = (overrides: Partial<UnifiedItem> & { id: string }): UnifiedItem => ({
  title: `Item ${overrides.id}`,
  description: '',
  latitude: null,
  longitude: null,
  type: 'business',
  ...overrides,
});

const futureDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

describe('getQuickBrowseItems', () => {
  it('returns at most 10 items', () => {
    const items = Array.from({ length: 20 }, (_, i) =>
      makeItem({ id: String(i) })
    );
    const result = getQuickBrowseItems(items);
    expect(result).toHaveLength(10);
  });

  it('returns fewer than 10 if input is smaller', () => {
    const items = [makeItem({ id: '1' }), makeItem({ id: '2' })];
    const result = getQuickBrowseItems(items);
    expect(result).toHaveLength(2);
  });

  it('prioritizes sponsored items first', () => {
    const items = [
      makeItem({ id: 'regular', is_sponsored: false }),
      makeItem({ id: 'sponsored', is_sponsored: true }),
    ];
    const result = getQuickBrowseItems(items);
    expect(result[0].id).toBe('sponsored');
  });

  it('prioritizes upcoming events over regular items', () => {
    const items = [
      makeItem({ id: 'biz', type: 'business' }),
      makeItem({ id: 'upcoming', type: 'event', date: futureDate(3) }),
    ];
    const result = getQuickBrowseItems(items);
    expect(result[0].id).toBe('upcoming');
  });

  it('sorts upcoming events soonest first', () => {
    const items = [
      makeItem({ id: 'later', type: 'event', date: futureDate(10) }),
      makeItem({ id: 'sooner', type: 'event', date: futureDate(2) }),
    ];
    const result = getQuickBrowseItems(items);
    expect(result[0].id).toBe('sooner');
    expect(result[1].id).toBe('later');
  });

  it('sponsored items come before upcoming events', () => {
    const items = [
      makeItem({ id: 'upcoming', type: 'event', date: futureDate(1) }),
      makeItem({ id: 'sponsored', type: 'business', is_sponsored: true }),
    ];
    const result = getQuickBrowseItems(items);
    expect(result[0].id).toBe('sponsored');
    expect(result[1].id).toBe('upcoming');
  });

  it('full priority ordering: sponsored > upcoming events > others, capped at 10', () => {
    const items = [
      ...Array.from({ length: 5 }, (_, i) => makeItem({ id: `reg-${i}`, type: 'news' })),
      ...Array.from({ length: 5 }, (_, i) =>
        makeItem({ id: `event-${i}`, type: 'event', date: futureDate(i + 1) })
      ),
      ...Array.from({ length: 5 }, (_, i) =>
        makeItem({ id: `spon-${i}`, type: 'business', is_sponsored: true })
      ),
    ];
    const result = getQuickBrowseItems(items);
    expect(result).toHaveLength(10);
    // First 5 should be sponsored
    expect(result.slice(0, 5).every(i => i.is_sponsored)).toBe(true);
    // Next 5 should be upcoming events
    expect(result.slice(5, 10).every(i => i.type === 'event')).toBe(true);
  });
});
