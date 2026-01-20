import { describe, it, expect } from 'vitest';
import { 
  sortBySponsored, 
  isSponsored, 
  countSponsored, 
  separateSponsored 
} from '@/utils/sponsoredUtils';

describe('sponsoredUtils', () => {
  describe('sortBySponsored', () => {
    it('should place sponsored items first', () => {
      const items = [
        { id: '1', name: 'Regular 1', is_sponsored: false },
        { id: '2', name: 'Sponsored 1', is_sponsored: true },
        { id: '3', name: 'Regular 2', is_sponsored: false },
        { id: '4', name: 'Sponsored 2', is_sponsored: true },
      ];

      const sorted = sortBySponsored(items);

      expect(sorted[0].is_sponsored).toBe(true);
      expect(sorted[1].is_sponsored).toBe(true);
      expect(sorted[2].is_sponsored).toBe(false);
      expect(sorted[3].is_sponsored).toBe(false);
    });

    it('should handle empty arrays', () => {
      expect(sortBySponsored([])).toEqual([]);
    });

    it('should handle arrays with no sponsored items', () => {
      const items = [
        { id: '1', name: 'Regular 1', is_sponsored: false },
        { id: '2', name: 'Regular 2' }, // undefined is_sponsored
      ];

      const sorted = sortBySponsored(items);
      expect(sorted).toHaveLength(2);
      expect(sorted.every(item => item.is_sponsored !== true)).toBe(true);
    });

    it('should handle arrays with only sponsored items', () => {
      const items = [
        { id: '1', name: 'Sponsored 1', is_sponsored: true },
        { id: '2', name: 'Sponsored 2', is_sponsored: true },
      ];

      const sorted = sortBySponsored(items);
      expect(sorted).toHaveLength(2);
      expect(sorted.every(item => item.is_sponsored === true)).toBe(true);
    });

    it('should preserve relative order within groups', () => {
      const items = [
        { id: '1', name: 'Regular 1', is_sponsored: false },
        { id: '2', name: 'Sponsored 1', is_sponsored: true },
        { id: '3', name: 'Regular 2', is_sponsored: false },
        { id: '4', name: 'Sponsored 2', is_sponsored: true },
      ];

      const sorted = sortBySponsored(items);

      // Sponsored items maintain their relative order
      expect(sorted[0].id).toBe('2'); // Sponsored 1 comes before Sponsored 2
      expect(sorted[1].id).toBe('4');

      // Regular items maintain their relative order
      expect(sorted[2].id).toBe('1'); // Regular 1 comes before Regular 2
      expect(sorted[3].id).toBe('3');
    });
  });

  describe('isSponsored', () => {
    it('should return true for sponsored items', () => {
      expect(isSponsored({ is_sponsored: true })).toBe(true);
    });

    it('should return false for non-sponsored items', () => {
      expect(isSponsored({ is_sponsored: false })).toBe(false);
    });

    it('should return false for items without is_sponsored field', () => {
      expect(isSponsored({ name: 'test' })).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isSponsored(null)).toBe(false);
      expect(isSponsored(undefined)).toBe(false);
    });
  });

  describe('countSponsored', () => {
    it('should count sponsored items correctly', () => {
      const items = [
        { id: '1', is_sponsored: true },
        { id: '2', is_sponsored: false },
        { id: '3', is_sponsored: true },
        { id: '4' }, // undefined
      ];

      expect(countSponsored(items)).toBe(2);
    });

    it('should return 0 for empty arrays', () => {
      expect(countSponsored([])).toBe(0);
    });

    it('should return 0 when no sponsored items exist', () => {
      const items = [
        { id: '1', is_sponsored: false },
        { id: '2' },
      ];

      expect(countSponsored(items)).toBe(0);
    });
  });

  describe('separateSponsored', () => {
    it('should separate items into sponsored and regular arrays', () => {
      const items = [
        { id: '1', name: 'Regular 1', is_sponsored: false },
        { id: '2', name: 'Sponsored 1', is_sponsored: true },
        { id: '3', name: 'Regular 2', is_sponsored: false },
        { id: '4', name: 'Sponsored 2', is_sponsored: true },
      ];

      const { sponsored, regular } = separateSponsored(items);

      expect(sponsored).toHaveLength(2);
      expect(regular).toHaveLength(2);
      expect(sponsored.every(item => item.is_sponsored === true)).toBe(true);
      expect(regular.every(item => item.is_sponsored !== true)).toBe(true);
    });

    it('should handle empty arrays', () => {
      const { sponsored, regular } = separateSponsored([]);
      expect(sponsored).toEqual([]);
      expect(regular).toEqual([]);
    });

    it('should handle arrays with no sponsored items', () => {
      const items = [{ id: '1' }, { id: '2', is_sponsored: false }];
      const { sponsored, regular } = separateSponsored(items);

      expect(sponsored).toHaveLength(0);
      expect(regular).toHaveLength(2);
    });
  });
});
