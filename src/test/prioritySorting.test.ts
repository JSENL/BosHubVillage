import { describe, it, expect } from 'vitest';
import { sortBySponsored, separateSponsored } from '@/utils/sponsoredUtils';
import { UnifiedItem } from '@/types/unifiedItem';

describe('Priority Sorting Integration', () => {
  const createMockUnifiedItem = (overrides: Partial<UnifiedItem> = {}): UnifiedItem => ({
    id: 'test-1',
    title: 'Test Item',
    description: 'Test description',
    latitude: 42.3,
    longitude: -71.1,
    type: 'business',
    is_sponsored: false,
    ...overrides
  });

  describe('sortBySponsored with UnifiedItem', () => {
    it('should sort sponsored UnifiedItems to the front', () => {
      const items: UnifiedItem[] = [
        createMockUnifiedItem({ id: '1', title: 'Regular Business', type: 'business', is_sponsored: false }),
        createMockUnifiedItem({ id: '2', title: 'Sponsored Event', type: 'event', is_sponsored: true }),
        createMockUnifiedItem({ id: '3', title: 'Regular News', type: 'news', is_sponsored: false }),
        createMockUnifiedItem({ id: '4', title: 'Sponsored Business', type: 'business', is_sponsored: true }),
        createMockUnifiedItem({ id: '5', title: 'Regular Service', type: 'local-service', is_sponsored: false }),
      ];

      const sorted = sortBySponsored(items);

      // First two should be sponsored
      expect(sorted[0].is_sponsored).toBe(true);
      expect(sorted[1].is_sponsored).toBe(true);

      // Rest should be non-sponsored
      expect(sorted[2].is_sponsored).toBe(false);
      expect(sorted[3].is_sponsored).toBe(false);
      expect(sorted[4].is_sponsored).toBe(false);
    });

    it('should maintain type diversity in sorted results', () => {
      const items: UnifiedItem[] = [
        createMockUnifiedItem({ id: '1', type: 'business', is_sponsored: false }),
        createMockUnifiedItem({ id: '2', type: 'event', is_sponsored: true }),
        createMockUnifiedItem({ id: '3', type: 'news', is_sponsored: true }),
        createMockUnifiedItem({ id: '4', type: 'local-service', is_sponsored: false }),
      ];

      const sorted = sortBySponsored(items);

      // Sponsored items first (event and news)
      expect(sorted[0].type).toBe('event');
      expect(sorted[0].is_sponsored).toBe(true);
      expect(sorted[1].type).toBe('news');
      expect(sorted[1].is_sponsored).toBe(true);

      // Then non-sponsored
      expect(sorted[2].type).toBe('business');
      expect(sorted[3].type).toBe('local-service');
    });
  });

  describe('separateSponsored with UnifiedItem', () => {
    it('should correctly separate sponsored and regular UnifiedItems', () => {
      const items: UnifiedItem[] = [
        createMockUnifiedItem({ id: '1', title: 'Regular 1', is_sponsored: false }),
        createMockUnifiedItem({ id: '2', title: 'Sponsored 1', is_sponsored: true }),
        createMockUnifiedItem({ id: '3', title: 'Regular 2', is_sponsored: false }),
        createMockUnifiedItem({ id: '4', title: 'Sponsored 2', is_sponsored: true }),
        createMockUnifiedItem({ id: '5', title: 'Regular 3' }), // undefined is_sponsored
      ];

      const { sponsored, regular } = separateSponsored(items);

      expect(sponsored).toHaveLength(2);
      expect(regular).toHaveLength(3);

      // Verify sponsored items
      expect(sponsored.every(item => item.is_sponsored === true)).toBe(true);
      expect(sponsored.map(i => i.id)).toEqual(['2', '4']);

      // Verify regular items
      expect(regular.every(item => item.is_sponsored !== true)).toBe(true);
      expect(regular.map(i => i.id)).toEqual(['1', '3', '5']);
    });

    it('should work with mixed item types', () => {
      const items: UnifiedItem[] = [
        createMockUnifiedItem({ id: '1', type: 'event', is_sponsored: true }),
        createMockUnifiedItem({ id: '2', type: 'business', is_sponsored: false }),
        createMockUnifiedItem({ id: '3', type: 'news', is_sponsored: true }),
        createMockUnifiedItem({ id: '4', type: 'local-service', is_sponsored: false }),
      ];

      const { sponsored, regular } = separateSponsored(items);

      expect(sponsored).toHaveLength(2);
      expect(sponsored.map(i => i.type)).toEqual(['event', 'news']);

      expect(regular).toHaveLength(2);
      expect(regular.map(i => i.type)).toEqual(['business', 'local-service']);
    });
  });

  describe('Real-world filtering scenario', () => {
    it('should work correctly in a homepage filtering flow', () => {
      // Simulate what happens in RefactoredIndex.tsx
      const allItems: UnifiedItem[] = [
        createMockUnifiedItem({ id: '1', type: 'event', title: 'Community Meetup', is_sponsored: false }),
        createMockUnifiedItem({ id: '2', type: 'business', title: 'Premium Restaurant', is_sponsored: true }),
        createMockUnifiedItem({ id: '3', type: 'news', title: 'Local News', is_sponsored: false }),
        createMockUnifiedItem({ id: '4', type: 'event', title: 'Featured Concert', is_sponsored: true }),
        createMockUnifiedItem({ id: '5', type: 'local-service', title: 'Community Center', is_sponsored: false }),
      ];

      // Step 1: Filter items (simulating type filter for 'all')
      const filteredItems = allItems.filter(item => true); // No filter applied

      // Step 2: Sort by sponsored
      const sortedItems = sortBySponsored(filteredItems);

      // Verify sponsored items come first
      expect(sortedItems[0].id).toBe('2'); // Premium Restaurant (sponsored)
      expect(sortedItems[1].id).toBe('4'); // Featured Concert (sponsored)
      
      // Verify non-sponsored items follow
      expect(sortedItems[2].is_sponsored).toBe(false);
      expect(sortedItems[3].is_sponsored).toBe(false);
      expect(sortedItems[4].is_sponsored).toBe(false);
    });

    it('should handle filtering by type while maintaining sponsored priority', () => {
      const allItems: UnifiedItem[] = [
        createMockUnifiedItem({ id: '1', type: 'event', is_sponsored: false }),
        createMockUnifiedItem({ id: '2', type: 'event', is_sponsored: true }),
        createMockUnifiedItem({ id: '3', type: 'business', is_sponsored: true }), // This should be filtered out
        createMockUnifiedItem({ id: '4', type: 'event', is_sponsored: false }),
      ];

      // Filter only events
      const filteredItems = allItems.filter(item => item.type === 'event');
      const sortedItems = sortBySponsored(filteredItems);

      expect(sortedItems).toHaveLength(3);
      expect(sortedItems[0].id).toBe('2'); // Sponsored event first
      expect(sortedItems[0].is_sponsored).toBe(true);
      expect(sortedItems[1].is_sponsored).toBe(false);
      expect(sortedItems[2].is_sponsored).toBe(false);
    });
  });
});
