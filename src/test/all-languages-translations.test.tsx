import { describe, it, expect, beforeEach, afterEach } from "vitest";
import i18n from "@/i18n/config";

/**
 * Comprehensive cross-language translation tests
 * Tests all 5 languages: English, Spanish, French, Portuguese, Vietnamese
 */
describe("All Languages Translation Tests", () => {
  const languages = ["en", "es", "fr", "pt", "vi"] as const;
  
  afterEach(() => {
    // Reset to English after each test
    i18n.changeLanguage("en");
  });

  describe("Core Navigation translations exist in all languages", () => {
    const navigationKeys = [
      "navigation.backToHome",
      "navigation.news",
      "navigation.submit",
      "navigation.submitEvent",
      "navigation.submitBusiness",
      "navigation.signIn",
      "navigation.signOut",
    ];

    languages.forEach((lang) => {
      it(`should have all navigation translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        navigationKeys.forEach((key) => {
          const translation = i18n.t(key);
          // Should not return the key itself (fallback behavior)
          expect(translation).not.toBe(key);
          // Should not be empty
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Core Common UI translations exist in all languages", () => {
    const commonKeys = [
      "common.submit",
      "common.cancel",
      "common.save",
      "common.delete",
      "common.edit",
      "common.search",
      "common.loading",
      "common.noResults",
    ];

    languages.forEach((lang) => {
      it(`should have all common UI translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        commonKeys.forEach((key) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(key);
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Core Filter translations exist in all languages", () => {
    const filterKeys = [
      "filters.filters",
      "filters.category",
      "filters.allCategories",
      "filters.clearAll",
      "filters.neighborhood",
    ];

    languages.forEach((lang) => {
      it(`should have all filter translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        filterKeys.forEach((key) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(key);
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Discovery translations exist in all languages", () => {
    const discoveryKeys = [
      "discovery.followingFeed",
      "discovery.discoverPeople",
      "discovery.similarInterests",
      "discovery.trending",
      "discovery.nearYou",
      "discovery.noRecentActivity",
    ];

    languages.forEach((lang) => {
      it(`should have all discovery translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        discoveryKeys.forEach((key) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(key);
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Location translations exist in all languages", () => {
    const locationKeys = [
      "location.allNeighborhoods",
      "location.allVillages",
      "location.neighborhood",
      "location.village",
    ];

    languages.forEach((lang) => {
      it(`should have all location translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        locationKeys.forEach((key) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(key);
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Bookmarks translations exist in all languages", () => {
    const bookmarkKeys = [
      "bookmarks.yourBookmarks",
      "bookmarks.noBookmarks",
    ];

    languages.forEach((lang) => {
      it(`should have all bookmark translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        bookmarkKeys.forEach((key) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(key);
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });

    it("should handle moreBookmarks interpolation in all languages", () => {
      languages.forEach((lang) => {
        i18n.changeLanguage(lang);
        const translation = i18n.t("bookmarks.moreBookmarks", { count: 5 });
        expect(translation).toContain("5");
        expect(translation.length).toBeGreaterThan(2);
      });
    });
  });

  describe("Saved Searches translations exist in all languages", () => {
    const savedSearchesKeys = [
      "savedSearches.title",
      "savedSearches.signInPrompt",
      "savedSearches.noSavedSearches",
    ];

    languages.forEach((lang) => {
      it(`should have all saved searches translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        savedSearchesKeys.forEach((key) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(key);
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Item Types translations exist in all languages", () => {
    const itemTypeKeys = [
      "itemTypes.events",
      "itemTypes.news",
      "itemTypes.businesses",
      "itemTypes.localresources",
    ];

    languages.forEach((lang) => {
      it(`should have all item type translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        itemTypeKeys.forEach((key) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(key);
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Card translations exist in all languages", () => {
    const cardKeys = [
      "cards.viewDetails",
      "cards.free",
      "cards.location",
      "cards.date",
      "cards.time",
      "cards.price",
    ];

    languages.forEach((lang) => {
      it(`should have all card translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        cardKeys.forEach((key) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(key);
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Forms translations exist in all languages", () => {
    const formKeys = [
      "forms.enterTitle",
      "forms.enterDescription",
      "forms.required",
      "forms.invalidEmail",
    ];

    languages.forEach((lang) => {
      it(`should have all form translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        formKeys.forEach((key) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(key);
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Messages translations exist in all languages", () => {
    const messageKeys = [
      "messages.messageSent",
      "messages.saveSuccess",
      "messages.deleteSuccess",
      "messages.confirmDelete",
    ];

    languages.forEach((lang) => {
      it(`should have all message translations in ${lang}`, () => {
        i18n.changeLanguage(lang);
        messageKeys.forEach((key) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(key);
          expect(translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Each language has unique translations", () => {
    it("should have different translations for signIn across all languages", () => {
      const translations = new Set<string>();
      languages.forEach((lang) => {
        i18n.changeLanguage(lang);
        translations.add(i18n.t("navigation.signIn"));
      });
      // All 5 languages should have unique translations
      expect(translations.size).toBe(5);
    });

    it("should have different translations for loading across all languages", () => {
      const translations = new Set<string>();
      languages.forEach((lang) => {
        i18n.changeLanguage(lang);
        translations.add(i18n.t("common.loading"));
      });
      expect(translations.size).toBe(5);
    });

    it("should have different translations for discoverPeople across all languages", () => {
      const translations = new Set<string>();
      languages.forEach((lang) => {
        i18n.changeLanguage(lang);
        translations.add(i18n.t("discovery.discoverPeople"));
      });
      expect(translations.size).toBe(5);
    });
  });

  describe("Language switching works correctly", () => {
    it("should switch between all languages correctly", () => {
      const expectedTranslations = {
        en: "Sign In",
        es: "Iniciar Sesión",
        fr: "Se Connecter",
        pt: "Entrar",
        vi: "Đăng Nhập",
      };

      languages.forEach((lang) => {
        i18n.changeLanguage(lang);
        expect(i18n.t("navigation.signIn")).toBe(expectedTranslations[lang]);
      });
    });

    it("should cycle through languages correctly", () => {
      // Start with English
      i18n.changeLanguage("en");
      expect(i18n.t("common.search")).toBe("Search");

      // Switch to Spanish
      i18n.changeLanguage("es");
      expect(i18n.t("common.search")).toBe("Buscar");

      // Switch to French
      i18n.changeLanguage("fr");
      expect(i18n.t("common.search")).toBe("Rechercher");

      // Switch to Portuguese
      i18n.changeLanguage("pt");
      expect(i18n.t("common.search")).toBe("Pesquisar");

      // Switch to Vietnamese
      i18n.changeLanguage("vi");
      expect(i18n.t("common.search")).toBe("Tìm Kiếm");

      // Back to English
      i18n.changeLanguage("en");
      expect(i18n.t("common.search")).toBe("Search");
    });
  });

  describe("Non-English languages should not return English translations", () => {
    const englishTranslations = {
      "navigation.signIn": "Sign In",
      "common.loading": "Loading...",
      "discovery.discoverPeople": "Discover People",
      "bookmarks.yourBookmarks": "Your Bookmarks",
      "savedSearches.title": "Saved Searches",
    };

    const nonEnglishLanguages = ["es", "fr", "pt", "vi"] as const;

    nonEnglishLanguages.forEach((lang) => {
      it(`should not return English translations when in ${lang} mode`, () => {
        i18n.changeLanguage(lang);
        Object.entries(englishTranslations).forEach(([key, englishValue]) => {
          const translation = i18n.t(key);
          expect(translation).not.toBe(englishValue);
        });
      });
    });
  });
});
