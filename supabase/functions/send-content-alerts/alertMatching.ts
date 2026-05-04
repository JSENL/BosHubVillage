/** Pure matching helpers shared with Vitest (no Deno imports). */

export type ItemType = "event" | "news" | "local-resource";

export interface ItemDetails {
  id: string;
  title: string;
  description: string;
  neighborhood: string | null;
  link: string;
  creatorId: string | null;
}

export function normalize(v: string | null | undefined): string {
  return (v || "").trim().toLowerCase();
}

export function matchesSavedSearch(
  searchCriteria: Record<string, unknown> | null,
  item: ItemDetails,
  itemType: ItemType,
): boolean {
  if (!searchCriteria) return false;
  const selectedType = normalize(String(searchCriteria.selectedType || searchCriteria.selected_type || ""));
  if (selectedType && selectedType !== itemType && !(selectedType === "local-service" && itemType === "local-resource")) {
    return false;
  }

  const selectedNeighborhood = normalize(
    String(searchCriteria.selectedNeighborhood || searchCriteria.selected_neighborhood || ""),
  );
  if (selectedNeighborhood && normalize(item.neighborhood) !== selectedNeighborhood) {
    return false;
  }

  const searchTerm = normalize(String(searchCriteria.searchTerm || searchCriteria.search_term || ""));
  if (searchTerm) {
    const haystack = `${item.title} ${item.description}`.toLowerCase();
    if (!haystack.includes(searchTerm)) return false;
  }

  return true;
}

/** Combines Smart Alert keywords with profile interests (deduped, lowercased). */
export function mergeKeywordFilters(keywordsFromPrefs: string[], interestsFromProfile: string[]): string[] {
  const fromPrefs = keywordsFromPrefs.map(normalize).filter(Boolean);
  const fromProfile = interestsFromProfile.map(normalize).filter(Boolean);
  return [...new Set([...fromPrefs, ...fromProfile])];
}

export function itemMatchesKeywordFilters(
  keywordsFromPrefs: string[],
  interestsFromProfile: string[],
  title: string,
  description: string,
): boolean {
  const keywords = mergeKeywordFilters(keywordsFromPrefs, interestsFromProfile);
  const haystack = `${title} ${description}`.toLowerCase();
  return keywords.length === 0 || keywords.some((k) => haystack.includes(k));
}
