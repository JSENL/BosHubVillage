import { describe, it, expect } from 'vitest';
import type { UnifiedItem } from '@/types/unifiedItem';
import { CULTURE_SPOTLIGHT_MAX_ITEMS } from '@/constants/cultureSpotlight';
import { getNeighborhoodCultureSpotlightItems } from '@/utils/culture/getNeighborhoodCultureSpotlightItems';

function newsUnified(id: string, dateIso: string): UnifiedItem {
  return {
    id,
    title: `Story ${id}`,
    description: 'Body',
    latitude: null,
    longitude: null,
    type: 'news',
    date: dateIso,
    content: '',
    originalData: { id, title: `Story ${id}`, date_posted: dateIso },
  };
}

describe('Neighborhood culture spotlight vs admin published pool', () => {
  it(`shows at most ${CULTURE_SPOTLIGHT_MAX_ITEMS} cards when many are published`, () => {
    const many = Array.from({ length: 10 }, (_, i) =>
      newsUnified(`n${i}`, `2026-01-${String(20 - i).padStart(2, '0')}T12:00:00.000Z`),
    );
    const spotlight = getNeighborhoodCultureSpotlightItems(many);
    expect(spotlight).toHaveLength(CULTURE_SPOTLIGHT_MAX_ITEMS);
  });

  it('shows every published item when count is below the cap', () => {
    const four = ['a', 'b', 'c', 'd'].map((id, i) =>
      newsUnified(id, `2026-02-${String(i + 1).padStart(2, '0')}T12:00:00.000Z`),
    );
    expect(getNeighborhoodCultureSpotlightItems(four)).toHaveLength(4);
  });

  it('drops a deleted article from the spotlight list (same feed admin cache updates)', () => {
    const ids = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7'];
    // n1 newest … n7 oldest so the first slot is n1 before delete
    const full = ids.map((id, i) =>
      newsUnified(id, `2026-03-${String(15 - i).padStart(2, '0')}T12:00:00.000Z`),
    );
    const before = getNeighborhoodCultureSpotlightItems(full);
    expect(before.map((x) => x.id)).toContain('n1');
    expect(before).toHaveLength(6);

    const afterAdminDelete = full.filter((x) => x.id !== 'n1');
    const after = getNeighborhoodCultureSpotlightItems(afterAdminDelete);
    expect(after.map((x) => x.id)).not.toContain('n1');
    expect(after).toHaveLength(6);
    expect(after[0]?.id).toBe('n2');
  });

  it('a deleted story id never appears in spotlight items when absent from the unified list', () => {
    const feed = [
      newsUnified('still-here', '2026-05-10T12:00:00.000Z'),
      newsUnified('also-here', '2026-05-09T12:00:00.000Z'),
    ];
    const spotlight = getNeighborhoodCultureSpotlightItems(feed);
    expect(spotlight.some((x) => x.id === 'deleted-from-supabase')).toBe(false);
    expect(spotlight.map((x) => x.id)).toEqual(['still-here', 'also-here']);
  });
});
