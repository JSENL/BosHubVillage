import { describe, it, expect } from "vitest";
import { transformDataToUnifiedItems } from "./dataTransformers";

const emptySources = {
  events: [] as any[],
  news: [] as any[],
  businesses: [] as any[],
  businessSubmissions: [] as any[],
  localresources: [] as any[],
  localresourcesubmissions: [] as any[],
};

describe("transformDataToUnifiedItems", () => {
  it("copies event translation JSON and slug onto UnifiedItem", () => {
    const items = transformDataToUnifiedItems({
      ...emptySources,
      events: [
        {
          id: "e1",
          slug: "community-fair",
          title: "Community Fair",
          description: "Fun day",
          latitude: 1,
          longitude: 2,
          location: "Park",
          address: null,
          category: "Festival",
          date: "2026-06-01",
          start_time: "10:00",
          end_time: "12:00",
          price: 0,
          neighborhoods: null,
          villages: null,
          is_sponsored: false,
          title_translations: { es: "Feria Comunitaria", fr: "Foire" },
          description_translations: { es: "Día divertido" },
          location_translations: { es: "Parque" },
          category_translations: { es: "Festival" },
        },
      ],
    });

    const event = items.find((i) => i.type === "event");
    expect(event).toBeDefined();
    expect(event!.slug).toBe("community-fair");
    expect(event!.title_translations).toEqual({ es: "Feria Comunitaria", fr: "Foire" });
    expect(event!.description_translations).toEqual({ es: "Día divertido" });
    expect(event!.location_translations).toEqual({ es: "Parque" });
    expect(event!.category_translations).toEqual({ es: "Festival" });
  });

  it("copies news translation fields onto UnifiedItem", () => {
    const items = transformDataToUnifiedItems({
      ...emptySources,
      news: [
        {
          id: "n1",
          title: "Headline",
          content: "Body",
          location: "Boston",
          Address: null,
          date_posted: "2026-01-01",
          source: "Gazette",
          villages: null,
          latitude: null,
          longitude: null,
          is_sponsored: false,
          title_translations: { pt: "Manchete" },
          content_translations: { pt: "Corpo" },
          location_translations: { pt: "Boston" },
        },
      ],
    });

    const news = items.find((i) => i.type === "news");
    expect(news!.title_translations).toEqual({ pt: "Manchete" });
    expect(news!.content_translations).toEqual({ pt: "Corpo" });
    expect(news!.location_translations).toEqual({ pt: "Boston" });
  });

  it("maps business_type_translations to category_translations for businesses", () => {
    const items = transformDataToUnifiedItems({
      ...emptySources,
      businesses: [
        {
          id: "b1",
          title: "Cafe",
          description: "Coffee",
          latitude: null,
          longitude: null,
          address: "1 Main",
          neighborhood: "Roxbury",
          business_type: "Restaurant",
          villages: null,
          is_sponsored: false,
          business_type_translations: { vi: "Nhà hàng" },
          title_translations: { vi: "Quán cà phê" },
        },
      ],
    });

    const b = items.find((i) => i.type === "business" && i.id === "b1");
    expect(b!.category_translations).toEqual({ vi: "Nhà hàng" });
    expect(b!.title_translations).toEqual({ vi: "Quán cà phê" });
  });

  it("copies local resource name/description/address translations and optional category_translations", () => {
    const items = transformDataToUnifiedItems({
      ...emptySources,
      localresources: [
        {
          id: "l1",
          name: "Plumber",
          description: "Fixes pipes",
          address: "2 Oak St",
          category: "Home services",
          neighborhood: "JP",
          village: null,
          latitude: null,
          longitude: null,
          is_sponsored: false,
          name_translations: { fr: "Plombier" },
          description_translations: { fr: "Répare" },
          address_translations: { fr: "2 rue Chêne" },
          category_translations: { fr: "Services à domicile" },
        },
      ],
    });

    const lr = items.find((i) => i.type === "local-service" && i.id === "l1");
    expect(lr!.name_translations).toEqual({ fr: "Plombier" });
    expect(lr!.title_translations).toEqual({ fr: "Plombier" });
    expect(lr!.description_translations).toEqual({ fr: "Répare" });
    expect(lr!.address_translations).toEqual({ fr: "2 rue Chêne" });
    expect(lr!.category_translations).toEqual({ fr: "Services à domicile" });
  });

  it("omits translation maps when JSON is empty or invalid", () => {
    const items = transformDataToUnifiedItems({
      ...emptySources,
      events: [
        {
          id: "e2",
          slug: "x",
          title: "T",
          description: "",
          latitude: null,
          longitude: null,
          location: "L",
          category: "C",
          date: "2026-06-02",
          start_time: null,
          end_time: null,
          price: 0,
          title_translations: {},
          description_translations: [{ not: "an object" }],
          location_translations: null,
          category_translations: { es: "   " },
        },
      ],
    });

    const event = items.find((i) => i.id === "e2");
    expect(event!.title_translations).toBeUndefined();
    expect(event!.description_translations).toBeUndefined();
    expect(event!.location_translations).toBeUndefined();
    expect(event!.category_translations).toBeUndefined();
  });
});
