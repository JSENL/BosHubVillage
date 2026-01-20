/**
 * Utility functions for handling sponsored listings
 */

interface SponsoredItem {
  is_sponsored?: boolean;
  [key: string]: any;
}

/**
 * Sorts an array of items so that sponsored items appear first.
 * Preserves the relative order of items within each group (sponsored vs non-sponsored).
 */
export function sortBySponsored<T extends SponsoredItem>(items: T[]): T[] {
  if (!items || items.length === 0) return items;
  
  const sponsored = items.filter(item => item.is_sponsored === true);
  const regular = items.filter(item => item.is_sponsored !== true);
  
  return [...sponsored, ...regular];
}

/**
 * Checks if an item is sponsored
 */
export function isSponsored(item: SponsoredItem | null | undefined): boolean {
  return item?.is_sponsored === true;
}

/**
 * Counts the number of sponsored items in an array
 */
export function countSponsored<T extends SponsoredItem>(items: T[]): number {
  if (!items || items.length === 0) return 0;
  return items.filter(item => item.is_sponsored === true).length;
}

/**
 * Separates items into sponsored and regular arrays
 */
export function separateSponsored<T extends SponsoredItem>(items: T[]): {
  sponsored: T[];
  regular: T[];
} {
  if (!items || items.length === 0) {
    return { sponsored: [], regular: [] };
  }
  
  return {
    sponsored: items.filter(item => item.is_sponsored === true),
    regular: items.filter(item => item.is_sponsored !== true),
  };
}
