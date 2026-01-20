import { describe, it, expect, beforeEach } from "vitest";
import i18n from "@/i18n/config";

describe("Discovery Components Spanish Translations", () => {
  beforeEach(() => {
    // Set language to Spanish before each test
    i18n.changeLanguage("es");
  });

  describe("Location Filter translations", () => {
    it("should have Spanish translation for allNeighborhoods", () => {
      expect(i18n.t("location.allNeighborhoods")).toBe("Todos los Barrios");
    });

    it("should have Spanish translation for allVillages", () => {
      expect(i18n.t("location.allVillages")).toBe("Todas las Aldeas");
    });

    it("should have Spanish translation for neighborhood", () => {
      expect(i18n.t("location.neighborhood")).toBe("Barrio");
    });

    it("should have Spanish translation for village", () => {
      expect(i18n.t("location.village")).toBe("Aldea");
    });

    it("should NOT return English 'All Neighborhoods' in Spanish mode", () => {
      expect(i18n.t("location.allNeighborhoods")).not.toBe("All Neighborhoods");
    });

    it("should NOT return English 'All Villages' in Spanish mode", () => {
      expect(i18n.t("location.allVillages")).not.toBe("All Villages");
    });
  });

  describe("Following Feed translations", () => {
    it("should have Spanish translation for followingFeed", () => {
      expect(i18n.t("discovery.followingFeed")).toBe("Feed de Seguidos");
    });

    it("should have Spanish translation for all", () => {
      expect(i18n.t("discovery.all")).toBe("Todos");
    });

    it("should have Spanish translation for posts", () => {
      expect(i18n.t("discovery.posts")).toBe("Publicaciones");
    });

    it("should have Spanish translation for activity", () => {
      expect(i18n.t("discovery.activity")).toBe("Actividad");
    });

    it("should have Spanish translation for noRecentActivity", () => {
      expect(i18n.t("discovery.noRecentActivity")).toBe("No hay actividad reciente de las personas que sigues.");
    });

    it("should have Spanish translation for startFollowing", () => {
      expect(i18n.t("discovery.startFollowing")).toBe("¡Comienza a seguir usuarios para ver sus actualizaciones aquí!");
    });

    it("should have Spanish translation for viewAllActivity", () => {
      expect(i18n.t("discovery.viewAllActivity")).toBe("Ver Toda la Actividad");
    });

    it("should NOT return English 'Following Feed' in Spanish mode", () => {
      expect(i18n.t("discovery.followingFeed")).not.toBe("Following Feed");
    });

    it("should NOT return English 'All' in Spanish mode", () => {
      expect(i18n.t("discovery.all")).not.toBe("All");
    });

    it("should NOT return English 'Posts' in Spanish mode", () => {
      expect(i18n.t("discovery.posts")).not.toBe("Posts");
    });

    it("should NOT return English 'Activity' in Spanish mode", () => {
      expect(i18n.t("discovery.activity")).not.toBe("Activity");
    });
  });

  describe("Saved Searches translations", () => {
    it("should have Spanish translation for title", () => {
      expect(i18n.t("savedSearches.title")).toBe("Búsquedas Guardadas");
    });

    it("should have Spanish translation for signInPrompt", () => {
      expect(i18n.t("savedSearches.signInPrompt")).toBe("Inicia sesión para guardar búsquedas y recibir notificaciones de nuevas coincidencias.");
    });

    it("should have Spanish translation for noSavedSearches", () => {
      expect(i18n.t("savedSearches.noSavedSearches")).toContain("Aún no hay búsquedas guardadas");
    });

    it("should NOT return English 'Saved Searches' in Spanish mode", () => {
      expect(i18n.t("savedSearches.title")).not.toBe("Saved Searches");
    });
  });

  describe("Bookmarks translations", () => {
    it("should have Spanish translation for yourBookmarks", () => {
      expect(i18n.t("bookmarks.yourBookmarks")).toBe("Tus Marcadores");
    });

    it("should have Spanish translation for noBookmarks", () => {
      expect(i18n.t("bookmarks.noBookmarks")).toContain("Aún no hay marcadores");
    });

    it("should have Spanish translation for moreBookmarks with interpolation", () => {
      expect(i18n.t("bookmarks.moreBookmarks", { count: 5 })).toBe("+5 marcadores más");
    });

    it("should NOT return English 'Your Bookmarks' in Spanish mode", () => {
      expect(i18n.t("bookmarks.yourBookmarks")).not.toBe("Your Bookmarks");
    });
  });

  describe("Discover People translations", () => {
    it("should have Spanish translation for discoverPeople", () => {
      expect(i18n.t("discovery.discoverPeople")).toBe("Descubrir Personas");
    });

    it("should have Spanish translation for forYou", () => {
      expect(i18n.t("discovery.forYou")).toBe("Para Ti");
    });

    it("should have Spanish translation for more", () => {
      expect(i18n.t("discovery.more")).toBe("Más");
    });

    it("should have Spanish translation for discoverNewPeople", () => {
      expect(i18n.t("discovery.discoverNewPeople")).toBe("Descubre nuevas personas");
    });

    it("should have Spanish translation for completeProfile", () => {
      expect(i18n.t("discovery.completeProfile")).toBe("Completa tu perfil para obtener mejores recomendaciones");
    });

    it("should have Spanish translation for refresh", () => {
      expect(i18n.t("discovery.refresh")).toBe("Actualizar");
    });

    it("should have Spanish translation for similarInterests", () => {
      expect(i18n.t("discovery.similarInterests")).toBe("Intereses Similares");
    });

    it("should have Spanish translation for trending", () => {
      expect(i18n.t("discovery.trending")).toBe("Tendencias");
    });

    it("should have Spanish translation for nearYou", () => {
      expect(i18n.t("discovery.nearYou")).toBe("Cerca de Ti");
    });

    it("should have Spanish translation for noMatchesFound", () => {
      expect(i18n.t("discovery.noMatchesFound")).toBe("No se encontraron coincidencias");
    });

    it("should have Spanish translation for addInterests", () => {
      expect(i18n.t("discovery.addInterests")).toBe("Agrega intereses y ubicación a tu perfil para mejores coincidencias");
    });

    it("should have Spanish translation for tryAgain", () => {
      expect(i18n.t("discovery.tryAgain")).toBe("Intentar de nuevo");
    });

    it("should have Spanish translation for newUser", () => {
      expect(i18n.t("discovery.newUser")).toBe("Nuevo usuario");
    });

    it("should have Spanish translation for sameLocation", () => {
      expect(i18n.t("discovery.sameLocation")).toBe("Misma ubicación");
    });

    it("should NOT return English 'Discover People' in Spanish mode", () => {
      expect(i18n.t("discovery.discoverPeople")).not.toBe("Discover People");
    });

    it("should NOT return English 'For You' in Spanish mode", () => {
      expect(i18n.t("discovery.forYou")).not.toBe("For You");
    });

    it("should NOT return English 'Similar Interests' in Spanish mode", () => {
      expect(i18n.t("discovery.similarInterests")).not.toBe("Similar Interests");
    });

    it("should NOT return English 'Trending' in Spanish mode", () => {
      expect(i18n.t("discovery.trending")).not.toBe("Trending");
    });

    it("should NOT return English 'Near You' in Spanish mode", () => {
      expect(i18n.t("discovery.nearYou")).not.toBe("Near You");
    });
  });

  describe("Language switching for discovery components", () => {
    it("should switch location filters from English to Spanish correctly", () => {
      i18n.changeLanguage("en");
      expect(i18n.t("location.allNeighborhoods")).toBe("All Neighborhoods");
      expect(i18n.t("location.allVillages")).toBe("All Villages");

      i18n.changeLanguage("es");
      expect(i18n.t("location.allNeighborhoods")).toBe("Todos los Barrios");
      expect(i18n.t("location.allVillages")).toBe("Todas las Aldeas");
    });

    it("should switch discovery components from English to Spanish correctly", () => {
      i18n.changeLanguage("en");
      expect(i18n.t("discovery.discoverPeople")).toBe("Discover People");
      expect(i18n.t("discovery.followingFeed")).toBe("Following Feed");
      expect(i18n.t("bookmarks.yourBookmarks")).toBe("Your Bookmarks");
      expect(i18n.t("savedSearches.title")).toBe("Saved Searches");

      i18n.changeLanguage("es");
      expect(i18n.t("discovery.discoverPeople")).toBe("Descubrir Personas");
      expect(i18n.t("discovery.followingFeed")).toBe("Feed de Seguidos");
      expect(i18n.t("bookmarks.yourBookmarks")).toBe("Tus Marcadores");
      expect(i18n.t("savedSearches.title")).toBe("Búsquedas Guardadas");
    });
  });
});
