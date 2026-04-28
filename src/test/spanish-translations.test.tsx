import { describe, it, expect, beforeEach } from "vitest";
import i18n from "@/i18n/config";

describe("Spanish Translations", () => {
  beforeEach(async () => {
    // Set language to Spanish before each test
    await i18n.changeLanguage("es");
  });

  describe("Navigation translations", () => {
    it("should have Spanish translation for backToHome", () => {
      expect(i18n.t("navigation.backToHome")).toBe("Volver al Inicio");
    });

    it("should have Spanish translation for news", () => {
      expect(i18n.t("navigation.news")).toBe("Cultura");
    });

    it("should have Spanish translation for submit", () => {
      expect(i18n.t("navigation.submit")).toBe("Enviar");
    });

    it("should have Spanish translation for submitEvent", () => {
      expect(i18n.t("navigation.submitEvent")).toBe("Enviar Evento");
    });

    it("should have Spanish translation for submitBusiness", () => {
      expect(i18n.t("navigation.submitBusiness")).toBe("Enviar Negocio");
    });

    it("should have Spanish translation for signIn", () => {
      expect(i18n.t("navigation.signIn")).toBe("Iniciar Sesión");
    });

    it("should have Spanish translation for signOut", () => {
      expect(i18n.t("navigation.signOut")).toBe("Cerrar Sesión");
    });
  });

  describe("Card translations", () => {
    it("should have Spanish translation for viewDetails", () => {
      expect(i18n.t("cards.viewDetails")).toBe("Ver Detalles");
    });

    it("should have Spanish translation for free", () => {
      expect(i18n.t("cards.free")).toBe("Gratis");
    });

    it("should have Spanish translation for location", () => {
      expect(i18n.t("cards.location")).toBe("Ubicación");
    });

    it("should have Spanish translation for date", () => {
      expect(i18n.t("cards.date")).toBe("Fecha");
    });

    it("should have Spanish translation for time", () => {
      expect(i18n.t("cards.time")).toBe("Hora");
    });

    it("should have Spanish translation for price", () => {
      expect(i18n.t("cards.price")).toBe("Precio");
    });
  });

  describe("Item types translations", () => {
    it("should have Spanish translation for events", () => {
      expect(i18n.t("itemTypes.events")).toBe("Eventos");
    });

    it("should have Spanish translation for news", () => {
      expect(i18n.t("itemTypes.news")).toBe("Cultura");
    });

    it("should have Spanish translation for businesses", () => {
      expect(i18n.t("itemTypes.businesses")).toBe("Negocios");
    });

    it("should have Spanish translation for localresources", () => {
      expect(i18n.t("itemTypes.localresources")).toBe("Servicios Locales");
    });
  });

  describe("Filter translations", () => {
    it("should have Spanish translation for filters", () => {
      expect(i18n.t("filters.filters")).toBe("Filtros");
    });

    it("should have Spanish translation for category", () => {
      expect(i18n.t("filters.category")).toBe("Categoría");
    });

    it("should have Spanish translation for allCategories", () => {
      expect(i18n.t("filters.allCategories")).toBe("Todas las Categorías");
    });

    it("should have Spanish translation for clearAll", () => {
      expect(i18n.t("filters.clearAll")).toBe("Limpiar Todo");
    });

    it("should have Spanish translation for neighborhood", () => {
      expect(i18n.t("filters.neighborhood")).toBe("Barrio");
    });
  });

  describe("Common UI translations", () => {
    it("should have Spanish translation for submit", () => {
      expect(i18n.t("common.submit")).toBe("Enviar");
    });

    it("should have Spanish translation for cancel", () => {
      expect(i18n.t("common.cancel")).toBe("Cancelar");
    });

    it("should have Spanish translation for save", () => {
      expect(i18n.t("common.save")).toBe("Guardar");
    });

    it("should have Spanish translation for delete", () => {
      expect(i18n.t("common.delete")).toBe("Eliminar");
    });

    it("should have Spanish translation for edit", () => {
      expect(i18n.t("common.edit")).toBe("Editar");
    });

    it("should have Spanish translation for search", () => {
      expect(i18n.t("common.search")).toBe("Buscar");
    });

    it("should have Spanish translation for loading", () => {
      expect(i18n.t("common.loading")).toBe("Cargando...");
    });

    it("should have Spanish translation for noResults", () => {
      expect(i18n.t("common.noResults")).toBe("No se encontraron resultados");
    });
  });

  describe("Form translations", () => {
    it("should have Spanish translation for enterTitle", () => {
      expect(i18n.t("forms.enterTitle")).toBe("Ingrese título");
    });

    it("should have Spanish translation for enterDescription", () => {
      expect(i18n.t("forms.enterDescription")).toBe("Ingrese descripción");
    });

    it("should have Spanish translation for required", () => {
      expect(i18n.t("forms.required")).toBe("Este campo es requerido");
    });

    it("should have Spanish translation for invalidEmail", () => {
      expect(i18n.t("forms.invalidEmail")).toBe("Por favor ingrese un correo válido");
    });
  });

  describe("Message translations", () => {
    it("should have Spanish translation for messageSent", () => {
      expect(i18n.t("messages.messageSent")).toBe("Mensaje enviado exitosamente");
    });

    it("should have Spanish translation for saveSuccess", () => {
      expect(i18n.t("messages.saveSuccess")).toBe("Guardado exitosamente");
    });

    it("should have Spanish translation for deleteSuccess", () => {
      expect(i18n.t("messages.deleteSuccess")).toBe("Eliminado exitosamente");
    });

    it("should have Spanish translation for confirmDelete", () => {
      expect(i18n.t("messages.confirmDelete")).toBe("¿Está seguro de que desea eliminar este elemento?");
    });
  });

  describe("FAQ translations", () => {
    it("should have Spanish translation for title", () => {
      expect(i18n.t("faq.title")).toBe("Preguntas Frecuentes");
    });

    it("should have Spanish translation for stillHaveQuestions", () => {
      expect(i18n.t("faq.stillHaveQuestions")).toBe("¿Aún tienes preguntas?");
    });

    it("should have Spanish translation for events", () => {
      expect(i18n.t("faq.events")).toBe("Eventos");
    });

    it("should have Spanish translation for businesses", () => {
      expect(i18n.t("faq.businesses")).toBe("Negocios");
    });
  });

  describe("Types translations", () => {
    it("should have Spanish translation for all types", () => {
      expect(i18n.t("types.all")).toBe("Todos los Tipos");
    });

    it("should have Spanish translation for events type", () => {
      expect(i18n.t("types.events")).toBe("Eventos");
    });

    it("should have Spanish translation for businesses type", () => {
      expect(i18n.t("types.businesses")).toBe("Negocios");
    });

    it("should have Spanish translation for news type", () => {
      expect(i18n.t("types.news")).toBe("Cultura");
    });

    it("should have Spanish translation for services type", () => {
      expect(i18n.t("types.services")).toBe("Servicios Locales");
    });
  });

  describe("No untranslated English text", () => {
    it("navigation keys should not return English when in Spanish mode", () => {
      const spanishNavigation = {
        backToHome: i18n.t("navigation.backToHome"),
        news: i18n.t("navigation.news"),
        submit: i18n.t("navigation.submit"),
        signIn: i18n.t("navigation.signIn"),
        signOut: i18n.t("navigation.signOut"),
      };

      // None should be English
      expect(spanishNavigation.backToHome).not.toBe("Back to Home");
      expect(spanishNavigation.news).not.toBe("News");
      expect(spanishNavigation.submit).not.toBe("Submit");
      expect(spanishNavigation.signIn).not.toBe("Sign In");
      expect(spanishNavigation.signOut).not.toBe("Sign Out");
    });

    it("common UI keys should not return English when in Spanish mode", () => {
      const spanishCommon = {
        submit: i18n.t("common.submit"),
        cancel: i18n.t("common.cancel"),
        save: i18n.t("common.save"),
        delete: i18n.t("common.delete"),
        edit: i18n.t("common.edit"),
        search: i18n.t("common.search"),
        loading: i18n.t("common.loading"),
      };

      expect(spanishCommon.submit).not.toBe("Submit");
      expect(spanishCommon.cancel).not.toBe("Cancel");
      expect(spanishCommon.save).not.toBe("Save");
      expect(spanishCommon.delete).not.toBe("Delete");
      expect(spanishCommon.edit).not.toBe("Edit");
      expect(spanishCommon.search).not.toBe("Search");
      expect(spanishCommon.loading).not.toBe("Loading...");
    });

    it("filter keys should not return English when in Spanish mode", () => {
      const spanishFilters = {
        filters: i18n.t("filters.filters"),
        category: i18n.t("filters.category"),
        clearAll: i18n.t("filters.clearAll"),
        location: i18n.t("filters.location"),
      };

      expect(spanishFilters.filters).not.toBe("Filters");
      expect(spanishFilters.category).not.toBe("Category");
      expect(spanishFilters.clearAll).not.toBe("Clear All");
      expect(spanishFilters.location).not.toBe("Location");
    });
  });

  describe("Language switching works correctly", () => {
    it("should switch from English to Spanish correctly", () => {
      // First set to English
      i18n.changeLanguage("en");
      expect(i18n.t("navigation.signIn")).toBe("Sign In");

      // Then switch to Spanish
      i18n.changeLanguage("es");
      expect(i18n.t("navigation.signIn")).toBe("Iniciar Sesión");
    });

    it("should switch from Spanish to English correctly", () => {
      // First set to Spanish
      i18n.changeLanguage("es");
      expect(i18n.t("navigation.signIn")).toBe("Iniciar Sesión");

      // Then switch to English
      i18n.changeLanguage("en");
      expect(i18n.t("navigation.signIn")).toBe("Sign In");
    });
  });
});
