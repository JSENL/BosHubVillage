import { describe, expect, it } from "vitest";
import {
  itemMatchesKeywordFilters,
  matchesSavedSearch,
  mergeKeywordFilters,
  normalize,
  type ItemDetails,
} from "../../supabase/functions/send-content-alerts/alertMatching";

describe("send-content-alerts matching helpers", () => {
  it("normalize trims and lowercases", () => {
    expect(normalize("  Foo ")).toBe("foo");
    expect(normalize(null)).toBe("");
  });

  it("mergeKeywordFilters combines prefs and profile interests without duplicates", () => {
    expect(mergeKeywordFilters(["Music", "music"], ["Sports"])).toEqual(["music", "sports"]);
  });

  it("itemMatchesKeywordFilters matches when merged keywords appear in title or description", () => {
    expect(itemMatchesKeywordFilters(["jazz"], [], "Jazz night", "")).toBe(true);
    expect(itemMatchesKeywordFilters([], ["basketball"], "Game day", "Youth basketball league")).toBe(true);
    expect(itemMatchesKeywordFilters(["zztop"], [], "Nothing relevant", "")).toBe(false);
  });

  it("empty keyword filters match any content", () => {
    expect(itemMatchesKeywordFilters([], [], "Anything", "")).toBe(true);
  });

  it("matchesSavedSearch respects type, neighborhood, and search term", () => {
    const item: ItemDetails = {
      id: "1",
      title: "Community jazz",
      description: "Outdoor concert",
      neighborhood: "Roxbury",
      link: "/event/1",
      creatorId: null,
    };
    expect(matchesSavedSearch({ selectedType: "event", selectedNeighborhood: "Roxbury" }, item, "event")).toBe(true);
    expect(matchesSavedSearch({ selectedType: "news" }, item, "event")).toBe(false);
    expect(matchesSavedSearch({ selectedNeighborhood: "Mattapan" }, item, "event")).toBe(false);
    expect(matchesSavedSearch({ searchTerm: "jazz" }, item, "event")).toBe(true);
    expect(matchesSavedSearch({ searchTerm: "opera" }, item, "event")).toBe(false);
  });
});
