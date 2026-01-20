import { describe, it, expect, beforeEach } from "vitest";
import i18n from "@/i18n/config";

describe("Portuguese Translations", () => {
  beforeEach(() => {
    i18n.changeLanguage("pt");
  });

  describe("Navigation translations", () => {
    it("should have Portuguese translation for backToHome", () => {
      expect(i18n.t("navigation.backToHome")).toBe("Voltar ao Início");
    });

    it("should have Portuguese translation for news", () => {
      expect(i18n.t("navigation.news")).toBe("Notícias");
    });

    it("should have Portuguese translation for submit", () => {
      expect(i18n.t("navigation.submit")).toBe("Enviar");
    });

    it("should have Portuguese translation for submitEvent", () => {
      expect(i18n.t("navigation.submitEvent")).toBe("Enviar Evento");
    });

    it("should have Portuguese translation for submitBusiness", () => {
      expect(i18n.t("navigation.submitBusiness")).toBe("Enviar Negócio");
    });

    it("should have Portuguese translation for signIn", () => {
      expect(i18n.t("navigation.signIn")).toBe("Entrar");
    });

    it("should have Portuguese translation for signOut", () => {
      expect(i18n.t("navigation.signOut")).toBe("Sair");
    });
  });

  describe("Card translations", () => {
    it("should have Portuguese translation for viewDetails", () => {
      expect(i18n.t("cards.viewDetails")).toBe("Ver Detalhes");
    });

    it("should have Portuguese translation for free", () => {
      expect(i18n.t("cards.free")).toBe("Grátis");
    });

    it("should have Portuguese translation for location", () => {
      expect(i18n.t("cards.location")).toBe("Localização");
    });

    it("should have Portuguese translation for date", () => {
      expect(i18n.t("cards.date")).toBe("Data");
    });

    it("should have Portuguese translation for time", () => {
      expect(i18n.t("cards.time")).toBe("Hora");
    });

    it("should have Portuguese translation for price", () => {
      expect(i18n.t("cards.price")).toBe("Preço");
    });
  });

  describe("Item types translations", () => {
    it("should have Portuguese translation for events", () => {
      expect(i18n.t("itemTypes.events")).toBe("Eventos");
    });

    it("should have Portuguese translation for news", () => {
      expect(i18n.t("itemTypes.news")).toBe("Notícias");
    });

    it("should have Portuguese translation for businesses", () => {
      expect(i18n.t("itemTypes.businesses")).toBe("Negócios");
    });

    it("should have Portuguese translation for localServices", () => {
      expect(i18n.t("itemTypes.localServices")).toBe("Serviços Locais");
    });
  });

  describe("Filter translations", () => {
    it("should have Portuguese translation for filters", () => {
      expect(i18n.t("filters.filters")).toBe("Filtros");
    });

    it("should have Portuguese translation for category", () => {
      expect(i18n.t("filters.category")).toBe("Categoria");
    });

    it("should have Portuguese translation for allCategories", () => {
      expect(i18n.t("filters.allCategories")).toBe("Todas as Categorias");
    });

    it("should have Portuguese translation for clearAll", () => {
      expect(i18n.t("filters.clearAll")).toBe("Limpar Tudo");
    });

    it("should have Portuguese translation for neighborhood", () => {
      expect(i18n.t("filters.neighborhood")).toBe("Bairro");
    });
  });

  describe("Common UI translations", () => {
    it("should have Portuguese translation for submit", () => {
      expect(i18n.t("common.submit")).toBe("Enviar");
    });

    it("should have Portuguese translation for cancel", () => {
      expect(i18n.t("common.cancel")).toBe("Cancelar");
    });

    it("should have Portuguese translation for save", () => {
      expect(i18n.t("common.save")).toBe("Salvar");
    });

    it("should have Portuguese translation for delete", () => {
      expect(i18n.t("common.delete")).toBe("Excluir");
    });

    it("should have Portuguese translation for edit", () => {
      expect(i18n.t("common.edit")).toBe("Editar");
    });

    it("should have Portuguese translation for search", () => {
      expect(i18n.t("common.search")).toBe("Pesquisar");
    });

    it("should have Portuguese translation for loading", () => {
      expect(i18n.t("common.loading")).toBe("Carregando...");
    });

    it("should have Portuguese translation for noResults", () => {
      expect(i18n.t("common.noResults")).toBe("Nenhum resultado encontrado");
    });
  });

  describe("Form translations", () => {
    it("should have Portuguese translation for enterTitle", () => {
      expect(i18n.t("forms.enterTitle")).toBe("Digite o título");
    });

    it("should have Portuguese translation for enterDescription", () => {
      expect(i18n.t("forms.enterDescription")).toBe("Digite a descrição");
    });

    it("should have Portuguese translation for required", () => {
      expect(i18n.t("forms.required")).toBe("Este campo é obrigatório");
    });

    it("should have Portuguese translation for invalidEmail", () => {
      expect(i18n.t("forms.invalidEmail")).toBe("Por favor digite um email válido");
    });
  });

  describe("Message translations", () => {
    it("should have Portuguese translation for messageSent", () => {
      expect(i18n.t("messages.messageSent")).toBe("Mensagem enviada com sucesso");
    });

    it("should have Portuguese translation for saveSuccess", () => {
      expect(i18n.t("messages.saveSuccess")).toBe("Salvo com sucesso");
    });

    it("should have Portuguese translation for deleteSuccess", () => {
      expect(i18n.t("messages.deleteSuccess")).toBe("Excluído com sucesso");
    });

    it("should have Portuguese translation for confirmDelete", () => {
      expect(i18n.t("messages.confirmDelete")).toBe("Tem certeza que deseja excluir este item?");
    });
  });

  describe("Location translations", () => {
    it("should have Portuguese translation for allNeighborhoods", () => {
      expect(i18n.t("location.allNeighborhoods")).toBe("Todos os Bairros");
    });

    it("should have Portuguese translation for allVillages", () => {
      expect(i18n.t("location.allVillages")).toBe("Todas as Vilas");
    });

    it("should have Portuguese translation for neighborhood", () => {
      expect(i18n.t("location.neighborhood")).toBe("Bairro");
    });

    it("should have Portuguese translation for village", () => {
      expect(i18n.t("location.village")).toBe("Vila");
    });
  });

  describe("Discovery translations", () => {
    it("should have Portuguese translation for followingFeed", () => {
      expect(i18n.t("discovery.followingFeed")).toBe("Feed de Seguidos");
    });

    it("should have Portuguese translation for discoverPeople", () => {
      expect(i18n.t("discovery.discoverPeople")).toBe("Descobrir Pessoas");
    });

    it("should have Portuguese translation for similarInterests", () => {
      expect(i18n.t("discovery.similarInterests")).toBe("Interesses Similares");
    });

    it("should have Portuguese translation for trending", () => {
      expect(i18n.t("discovery.trending")).toBe("Em Alta");
    });

    it("should have Portuguese translation for nearYou", () => {
      expect(i18n.t("discovery.nearYou")).toBe("Perto de Você");
    });

    it("should have Portuguese translation for noRecentActivity", () => {
      expect(i18n.t("discovery.noRecentActivity")).toBe("Nenhuma atividade recente das pessoas que você segue.");
    });
  });

  describe("Bookmarks translations", () => {
    it("should have Portuguese translation for yourBookmarks", () => {
      expect(i18n.t("bookmarks.yourBookmarks")).toBe("Seus Favoritos");
    });

    it("should have Portuguese translation for noBookmarks", () => {
      expect(i18n.t("bookmarks.noBookmarks")).toContain("Nenhum favorito ainda");
    });

    it("should have Portuguese translation for moreBookmarks with interpolation", () => {
      expect(i18n.t("bookmarks.moreBookmarks", { count: 5 })).toBe("+5 favoritos adicionais");
    });
  });

  describe("Saved searches translations", () => {
    it("should have Portuguese translation for title", () => {
      expect(i18n.t("savedSearches.title")).toBe("Pesquisas Salvas");
    });

    it("should have Portuguese translation for signInPrompt", () => {
      expect(i18n.t("savedSearches.signInPrompt")).toBe("Faça login para salvar pesquisas e ser notificado sobre novas correspondências.");
    });
  });

  describe("No untranslated English text", () => {
    it("navigation keys should not return English when in Portuguese mode", () => {
      expect(i18n.t("navigation.backToHome")).not.toBe("Back to Home");
      expect(i18n.t("navigation.news")).not.toBe("News");
      expect(i18n.t("navigation.submit")).not.toBe("Submit");
      expect(i18n.t("navigation.signIn")).not.toBe("Sign In");
      expect(i18n.t("navigation.signOut")).not.toBe("Sign Out");
    });

    it("common UI keys should not return English when in Portuguese mode", () => {
      expect(i18n.t("common.submit")).not.toBe("Submit");
      expect(i18n.t("common.cancel")).not.toBe("Cancel");
      expect(i18n.t("common.save")).not.toBe("Save");
      expect(i18n.t("common.delete")).not.toBe("Delete");
      expect(i18n.t("common.edit")).not.toBe("Edit");
      expect(i18n.t("common.search")).not.toBe("Search");
      expect(i18n.t("common.loading")).not.toBe("Loading...");
    });

    it("discovery keys should not return English when in Portuguese mode", () => {
      expect(i18n.t("discovery.discoverPeople")).not.toBe("Discover People");
      expect(i18n.t("discovery.followingFeed")).not.toBe("Following Feed");
      expect(i18n.t("bookmarks.yourBookmarks")).not.toBe("Your Bookmarks");
      expect(i18n.t("savedSearches.title")).not.toBe("Saved Searches");
    });
  });

  describe("Language switching works correctly", () => {
    it("should switch from English to Portuguese correctly", () => {
      i18n.changeLanguage("en");
      expect(i18n.t("navigation.signIn")).toBe("Sign In");

      i18n.changeLanguage("pt");
      expect(i18n.t("navigation.signIn")).toBe("Entrar");
    });

    it("should switch from Portuguese to English correctly", () => {
      i18n.changeLanguage("pt");
      expect(i18n.t("navigation.signIn")).toBe("Entrar");

      i18n.changeLanguage("en");
      expect(i18n.t("navigation.signIn")).toBe("Sign In");
    });

    it("should switch discovery components from English to Portuguese correctly", () => {
      i18n.changeLanguage("en");
      expect(i18n.t("discovery.discoverPeople")).toBe("Discover People");
      expect(i18n.t("location.allNeighborhoods")).toBe("All Neighborhoods");

      i18n.changeLanguage("pt");
      expect(i18n.t("discovery.discoverPeople")).toBe("Descobrir Pessoas");
      expect(i18n.t("location.allNeighborhoods")).toBe("Todos os Bairros");
    });
  });
});
