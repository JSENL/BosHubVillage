import { describe, it, expect, beforeEach } from "vitest";
import i18n from "@/i18n/config";

describe("French Translations", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("fr");
  });

  describe("Navigation translations", () => {
    it("should have French translation for backToHome", () => {
      expect(i18n.t("navigation.backToHome")).toBe("Retour à l'accueil");
    });

    it("should have French translation for news", () => {
      expect(i18n.t("navigation.news")).toBe("Culture");
    });

    it("should have French translation for submit", () => {
      expect(i18n.t("navigation.submit")).toBe("Soumettre");
    });

    it("should have French translation for submitEvent", () => {
      expect(i18n.t("navigation.submitEvent")).toBe("Soumettre un Événement");
    });

    it("should have French translation for submitBusiness", () => {
      expect(i18n.t("navigation.submitBusiness")).toBe("Soumettre une Entreprise");
    });

    it("should have French translation for signIn", () => {
      expect(i18n.t("navigation.signIn")).toBe("Se Connecter");
    });

    it("should have French translation for signOut", () => {
      expect(i18n.t("navigation.signOut")).toBe("Se Déconnecter");
    });
  });

  describe("Card translations", () => {
    it("should have French translation for viewDetails", () => {
      expect(i18n.t("cards.viewDetails")).toBe("Voir les Détails");
    });

    it("should have French translation for free", () => {
      expect(i18n.t("cards.free")).toBe("Gratuit");
    });

    it("should have French translation for location", () => {
      expect(i18n.t("cards.location")).toBe("Emplacement");
    });

    it("should have French translation for date", () => {
      expect(i18n.t("cards.date")).toBe("Date");
    });

    it("should have French translation for time", () => {
      expect(i18n.t("cards.time")).toBe("Heure");
    });

    it("should have French translation for price", () => {
      expect(i18n.t("cards.price")).toBe("Prix");
    });
  });

  describe("Item types translations", () => {
    it("should have French translation for events", () => {
      expect(i18n.t("itemTypes.events")).toBe("Événements");
    });

    it("should have French translation for news", () => {
      expect(i18n.t("itemTypes.news")).toBe("Culture");
    });

    it("should have French translation for businesses", () => {
      expect(i18n.t("itemTypes.businesses")).toBe("Entreprises");
    });

    it("should have French translation for localresources", () => {
      expect(i18n.t("itemTypes.localresources")).toBe("Services Locaux");
    });
  });

  describe("Filter translations", () => {
    it("should have French translation for filters", () => {
      expect(i18n.t("filters.filters")).toBe("Filtres");
    });

    it("should have French translation for category", () => {
      expect(i18n.t("filters.category")).toBe("Catégorie");
    });

    it("should have French translation for allCategories", () => {
      expect(i18n.t("filters.allCategories")).toBe("Toutes les Catégories");
    });

    it("should have French translation for clearAll", () => {
      expect(i18n.t("filters.clearAll")).toBe("Tout Effacer");
    });

    it("should have French translation for neighborhood", () => {
      expect(i18n.t("filters.neighborhood")).toBe("Quartier");
    });
  });

  describe("Common UI translations", () => {
    it("should have French translation for submit", () => {
      expect(i18n.t("common.submit")).toBe("Soumettre");
    });

    it("should have French translation for cancel", () => {
      expect(i18n.t("common.cancel")).toBe("Annuler");
    });

    it("should have French translation for save", () => {
      expect(i18n.t("common.save")).toBe("Enregistrer");
    });

    it("should have French translation for delete", () => {
      expect(i18n.t("common.delete")).toBe("Supprimer");
    });

    it("should have French translation for edit", () => {
      expect(i18n.t("common.edit")).toBe("Modifier");
    });

    it("should have French translation for search", () => {
      expect(i18n.t("common.search")).toBe("Rechercher");
    });

    it("should have French translation for loading", () => {
      expect(i18n.t("common.loading")).toBe("Chargement...");
    });

    it("should have French translation for noResults", () => {
      expect(i18n.t("common.noResults")).toBe("Aucun résultat trouvé");
    });
  });

  describe("Form translations", () => {
    it("should have French translation for enterTitle", () => {
      expect(i18n.t("forms.enterTitle")).toBe("Entrez le titre");
    });

    it("should have French translation for enterDescription", () => {
      expect(i18n.t("forms.enterDescription")).toBe("Entrez la description");
    });

    it("should have French translation for required", () => {
      expect(i18n.t("forms.required")).toBe("Ce champ est requis");
    });

    it("should have French translation for invalidEmail", () => {
      expect(i18n.t("forms.invalidEmail")).toBe("Veuillez entrer un email valide");
    });
  });

  describe("Message translations", () => {
    it("should have French translation for messageSent", () => {
      expect(i18n.t("messages.messageSent")).toBe("Message envoyé avec succès");
    });

    it("should have French translation for saveSuccess", () => {
      expect(i18n.t("messages.saveSuccess")).toBe("Enregistré avec succès");
    });

    it("should have French translation for deleteSuccess", () => {
      expect(i18n.t("messages.deleteSuccess")).toBe("Supprimé avec succès");
    });

    it("should have French translation for confirmDelete", () => {
      expect(i18n.t("messages.confirmDelete")).toBe("Êtes-vous sûr de vouloir supprimer cet élément?");
    });
  });

  describe("Location translations", () => {
    it("should have French translation for allNeighborhoods", () => {
      expect(i18n.t("location.allNeighborhoods")).toBe("Tous les Quartiers");
    });

    it("should have French translation for allVillages", () => {
      expect(i18n.t("location.allVillages")).toBe("Tous les Villages");
    });

    it("should have French translation for neighborhood", () => {
      expect(i18n.t("location.neighborhood")).toBe("Quartier");
    });

    it("should have French translation for village", () => {
      expect(i18n.t("location.village")).toBe("Village");
    });
  });

  describe("Discovery translations", () => {
    it("should have French translation for followingFeed", () => {
      expect(i18n.t("discovery.followingFeed")).toBe("Fil d'Abonnements");
    });

    it("should have French translation for discoverPeople", () => {
      expect(i18n.t("discovery.discoverPeople")).toBe("Découvrir des Personnes");
    });

    it("should have French translation for similarInterests", () => {
      expect(i18n.t("discovery.similarInterests")).toBe("Intérêts Similaires");
    });

    it("should have French translation for trending", () => {
      expect(i18n.t("discovery.trending")).toBe("Tendances");
    });

    it("should have French translation for nearYou", () => {
      expect(i18n.t("discovery.nearYou")).toBe("Près de Vous");
    });

    it("should have French translation for noRecentActivity", () => {
      expect(i18n.t("discovery.noRecentActivity")).toBe("Aucune activité récente des personnes que vous suivez.");
    });
  });

  describe("Bookmarks translations", () => {
    it("should have French translation for yourBookmarks", () => {
      expect(i18n.t("bookmarks.yourBookmarks")).toBe("Vos Favoris");
    });

    it("should have French translation for noBookmarks", () => {
      expect(i18n.t("bookmarks.noBookmarks")).toContain("Aucun favori");
    });

    it("should have French translation for moreBookmarks with interpolation", () => {
      expect(i18n.t("bookmarks.moreBookmarks", { count: 5 })).toBe("+5 favoris supplémentaires");
    });
  });

  describe("Saved searches translations", () => {
    it("should have French translation for title", () => {
      expect(i18n.t("savedSearches.title")).toBe("Recherches Sauvegardées");
    });

    it("should have French translation for signInPrompt", () => {
      expect(i18n.t("savedSearches.signInPrompt")).toBe("Connectez-vous pour sauvegarder des recherches et être notifié des nouvelles correspondances.");
    });
  });

  describe("No untranslated English text", () => {
    it("navigation keys should not return English when in French mode", () => {
      expect(i18n.t("navigation.backToHome")).not.toBe("Back to Home");
      expect(i18n.t("navigation.news")).not.toBe("News");
      expect(i18n.t("navigation.submit")).not.toBe("Submit");
      expect(i18n.t("navigation.signIn")).not.toBe("Sign In");
      expect(i18n.t("navigation.signOut")).not.toBe("Sign Out");
    });

    it("common UI keys should not return English when in French mode", () => {
      expect(i18n.t("common.submit")).not.toBe("Submit");
      expect(i18n.t("common.cancel")).not.toBe("Cancel");
      expect(i18n.t("common.save")).not.toBe("Save");
      expect(i18n.t("common.delete")).not.toBe("Delete");
      expect(i18n.t("common.edit")).not.toBe("Edit");
      expect(i18n.t("common.search")).not.toBe("Search");
      expect(i18n.t("common.loading")).not.toBe("Loading...");
    });

    it("discovery keys should not return English when in French mode", () => {
      expect(i18n.t("discovery.discoverPeople")).not.toBe("Discover People");
      expect(i18n.t("discovery.followingFeed")).not.toBe("Following Feed");
      expect(i18n.t("bookmarks.yourBookmarks")).not.toBe("Your Bookmarks");
      expect(i18n.t("savedSearches.title")).not.toBe("Saved Searches");
    });
  });

  describe("Language switching works correctly", () => {
    it("should switch from English to French correctly", () => {
      i18n.changeLanguage("en");
      expect(i18n.t("navigation.signIn")).toBe("Sign In");

      i18n.changeLanguage("fr");
      expect(i18n.t("navigation.signIn")).toBe("Se Connecter");
    });

    it("should switch from French to English correctly", () => {
      i18n.changeLanguage("fr");
      expect(i18n.t("navigation.signIn")).toBe("Se Connecter");

      i18n.changeLanguage("en");
      expect(i18n.t("navigation.signIn")).toBe("Sign In");
    });

    it("should switch discovery components from English to French correctly", () => {
      i18n.changeLanguage("en");
      expect(i18n.t("discovery.discoverPeople")).toBe("Discover People");
      expect(i18n.t("location.allNeighborhoods")).toBe("All Neighborhoods");

      i18n.changeLanguage("fr");
      expect(i18n.t("discovery.discoverPeople")).toBe("Découvrir des Personnes");
      expect(i18n.t("location.allNeighborhoods")).toBe("Tous les Quartiers");
    });
  });
});
