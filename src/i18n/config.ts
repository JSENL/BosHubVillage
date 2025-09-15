import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files for focused components
const resources = {
  en: { 
    translation: {
      // Navigation
      navigation: {
        backToHome: "Back to Home",
        news: "News", 
        submit: "Submit",
        submitEvent: "Submit Event",
        submitBusiness: "Submit Business",
        submitNews: "Submit News",
        submitLocalService: "Submit Local Service",
        contactAdmin: "Contact Admin",
        myMessages: "My Messages",
        mySubmissions: "My Submissions",
        businessDashboard: "Business Dashboard",
        adminDashboard: "Admin Dashboard",
        signOut: "Sign Out",
        signIn: "Sign In"
      },
      // Cards
      cards: {
        viewDetails: "View Details",
        free: "Free",
        location: "Location",
        date: "Date",
        time: "Time",
        price: "Price",
        added: "Added",
        source: "Source"
      },
      // Item types
      itemTypes: {
        events: "Events",
        news: "News", 
        businesses: "Businesses",
        localServices: "Local Services"
      },
      // FAQ Section
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know about using our community platform",
        stillHaveQuestions: "Still Have Questions?",
        contactMessage: "If you can't find the answer you're looking for, feel free to reach out to our support team or use the contact form.",
        gettingStarted: "Getting Started",
        gettingStartedDesc: "Learn about getting started features and how to use them",
        events: "Events", 
        eventsDesc: "Learn about events features and how to use them",
        businesses: "Businesses",
        businessesDesc: "Learn about businesses features and how to use them",
        localServices: "Local Services",
        localServicesDesc: "Learn about local services features and how to use them",
        newsUpdates: "News & Updates",
        newsUpdatesDesc: "Learn about news & updates features and how to use them",
        mapFeatures: "Map Features",
        mapFeaturesDesc: "Learn about map features features and how to use them",
        searchFilters: "Search & Filters",
        searchFiltersDesc: "Learn about search & filters features and how to use them",
        userFeatures: "User Features",
        userFeaturesDesc: "Learn about user features features and how to use them",
        commentsRatings: "Comments & Ratings",
        commentsRatingsDesc: "Learn about comments & ratings features and how to use them",
        messaging: "Messaging",
        messagingDesc: "Learn about messaging features and how to use them",
        languagesAccessibility: "Languages & Accessibility",
        languagesAccessibilityDesc: "Learn about languages & accessibility features and how to use them",
        submissionProcess: "Submission Process",
        submissionProcessDesc: "Learn about submission process features and how to use them"
      }
    }
  },
  es: { 
    translation: {
      navigation: {
        backToHome: "Volver al Inicio",
        news: "Noticias",
        submit: "Enviar",
        submitEvent: "Enviar Evento",
        submitBusiness: "Enviar Negocio", 
        submitNews: "Enviar Noticia",
        submitLocalService: "Enviar Servicio Local",
        contactAdmin: "Contactar Administrador",
        myMessages: "Mis Mensajes",
        mySubmissions: "Mis Envíos",
        businessDashboard: "Panel de Negocio",
        adminDashboard: "Panel de Administrador",
        signOut: "Cerrar Sesión",
        signIn: "Iniciar Sesión"
      },
      cards: {
        viewDetails: "Ver Detalles",
        free: "Gratis",
        location: "Ubicación",
        date: "Fecha",
        time: "Hora",
        price: "Precio",
        added: "Agregado",
        source: "Fuente"
      },
      itemTypes: {
        events: "Eventos",
        news: "Noticias",
        businesses: "Negocios", 
        localServices: "Servicios Locales"
      },
      faq: {
        title: "Preguntas Frecuentes",
        subtitle: "Todo lo que necesitas saber sobre el uso de nuestra plataforma comunitaria",
        stillHaveQuestions: "¿Aún tienes preguntas?",
        contactMessage: "Si no puedes encontrar la respuesta que buscas, no dudes en contactar a nuestro equipo de soporte o usar el formulario de contacto.",
        gettingStarted: "Comenzando",
        gettingStartedDesc: "Aprende sobre las funciones de inicio y cómo usarlas",
        events: "Eventos",
        eventsDesc: "Aprende sobre las funciones de eventos y cómo usarlas",
        businesses: "Negocios",
        businessesDesc: "Aprende sobre las funciones de negocios y cómo usarlas",
        localServices: "Servicios Locales",
        localServicesDesc: "Aprende sobre las funciones de servicios locales y cómo usarlas",
        newsUpdates: "Noticias y Actualizaciones",
        newsUpdatesDesc: "Aprende sobre las funciones de noticias y actualizaciones y cómo usarlas",
        mapFeatures: "Funciones del Mapa",
        mapFeaturesDesc: "Aprende sobre las funciones del mapa y cómo usarlas",
        searchFilters: "Búsqueda y Filtros",
        searchFiltersDesc: "Aprende sobre las funciones de búsqueda y filtros y cómo usarlas",
        userFeatures: "Funciones de Usuario",
        userFeaturesDesc: "Aprende sobre las funciones de usuario y cómo usarlas",
        commentsRatings: "Comentarios y Calificaciones",
        commentsRatingsDesc: "Aprende sobre las funciones de comentarios y calificaciones y cómo usarlas",
        messaging: "Mensajería",
        messagingDesc: "Aprende sobre las funciones de mensajería y cómo usarlas",
        languagesAccessibility: "Idiomas y Accesibilidad",
        languagesAccessibilityDesc: "Aprende sobre las funciones de idiomas y accesibilidad y cómo usarlas",
        submissionProcess: "Proceso de Envío",
        submissionProcessDesc: "Aprende sobre las funciones del proceso de envío y cómo usarlas"
      }
    }
  },
  fr: { 
    translation: {
      navigation: {
        backToHome: "Retour à l'accueil",
        news: "Actualités",
        submit: "Soumettre",
        submitEvent: "Soumettre un Événement",
        submitBusiness: "Soumettre une Entreprise",
        submitNews: "Soumettre une Actualité", 
        submitLocalService: "Soumettre un Service Local",
        contactAdmin: "Contacter l'Administrateur",
        myMessages: "Mes Messages",
        mySubmissions: "Mes Soumissions",
        businessDashboard: "Tableau de Bord Entreprise",
        adminDashboard: "Tableau de Bord Admin",
        signOut: "Se Déconnecter",
        signIn: "Se Connecter"
      },
      cards: {
        viewDetails: "Voir les Détails",
        free: "Gratuit", 
        location: "Emplacement",
        date: "Date",
        time: "Heure",
        price: "Prix",
        added: "Ajouté",
        source: "Source"
      },
      itemTypes: {
        events: "Événements",
        news: "Actualités",
        businesses: "Entreprises",
        localServices: "Services Locaux"
      },
      faq: {
        title: "Questions Fréquemment Posées",
        subtitle: "Tout ce que vous devez savoir sur l'utilisation de notre plateforme communautaire",
        stillHaveQuestions: "Vous avez encore des questions ?",
        contactMessage: "Si vous ne trouvez pas la réponse que vous cherchez, n'hésitez pas à contacter notre équipe de support ou à utiliser le formulaire de contact.",
        gettingStarted: "Commencer",
        gettingStartedDesc: "Apprenez les fonctionnalités de démarrage et comment les utiliser",
        events: "Événements",
        eventsDesc: "Apprenez les fonctionnalités d'événements et comment les utiliser",
        businesses: "Entreprises",
        businessesDesc: "Apprenez les fonctionnalités d'entreprises et comment les utiliser",
        localServices: "Services Locaux",
        localServicesDesc: "Apprenez les fonctionnalités de services locaux et comment les utiliser",
        newsUpdates: "Actualités et Mises à Jour",
        newsUpdatesDesc: "Apprenez les fonctionnalités d'actualités et mises à jour et comment les utiliser",
        mapFeatures: "Fonctionnalités de Carte",
        mapFeaturesDesc: "Apprenez les fonctionnalités de carte et comment les utiliser",
        searchFilters: "Recherche et Filtres",
        searchFiltersDesc: "Apprenez les fonctionnalités de recherche et filtres et comment les utiliser",
        userFeatures: "Fonctionnalités Utilisateur",
        userFeaturesDesc: "Apprenez les fonctionnalités utilisateur et comment les utiliser",
        commentsRatings: "Commentaires et Évaluations",
        commentsRatingsDesc: "Apprenez les fonctionnalités de commentaires et évaluations et comment les utiliser",
        messaging: "Messagerie",
        messagingDesc: "Apprenez les fonctionnalités de messagerie et comment les utiliser",
        languagesAccessibility: "Langues et Accessibilité",
        languagesAccessibilityDesc: "Apprenez les fonctionnalités de langues et accessibilité et comment les utiliser",
        submissionProcess: "Processus de Soumission",
        submissionProcessDesc: "Apprenez les fonctionnalités du processus de soumission et comment les utiliser"
      }
    }
  },
  vi: { 
    translation: {
      navigation: {
        backToHome: "Về Trang Chủ",
        news: "Tin Tức",
        submit: "Gửi",
        submitEvent: "Gửi Sự Kiện",
        submitBusiness: "Gửi Doanh Nghiệp",
        submitNews: "Gửi Tin Tức",
        submitLocalService: "Gửi Dịch Vụ Địa Phương",
        contactAdmin: "Liên Hệ Quản Trị",
        myMessages: "Tin Nhắn Của Tôi",
        mySubmissions: "Bài Gửi Của Tôi",
        businessDashboard: "Bảng Điều Khiển Doanh Nghiệp",
        adminDashboard: "Bảng Điều Khiển Quản Trị",
        signOut: "Đăng Xuất",
        signIn: "Đăng Nhập"
      },
      cards: {
        viewDetails: "Xem Chi Tiết",
        free: "Miễn Phí",
        location: "Vị Trí",
        date: "Ngày",
        time: "Thời Gian", 
        price: "Giá",
        added: "Đã Thêm",
        source: "Nguồn"
      },
      itemTypes: {
        events: "Sự Kiện",
        news: "Tin Tức",
        businesses: "Doanh Nghiệp",
        localServices: "Dịch Vụ Địa Phương"
      },
      faq: {
        title: "Câu Hỏi Thường Gặp",
        subtitle: "Mọi thứ bạn cần biết về việc sử dụng nền tảng cộng đồng của chúng tôi",
        stillHaveQuestions: "Vẫn có câu hỏi?",
        contactMessage: "Nếu bạn không thể tìm thấy câu trả lời mà bạn đang tìm kiếm, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi hoặc sử dụng biểu mẫu liên hệ.",
        gettingStarted: "Bắt Đầu",
        gettingStartedDesc: "Tìm hiểu về các tính năng bắt đầu và cách sử dụng chúng",
        events: "Sự Kiện",
        eventsDesc: "Tìm hiểu về các tính năng sự kiện và cách sử dụng chúng",
        businesses: "Doanh Nghiệp",
        businessesDesc: "Tìm hiểu về các tính năng doanh nghiệp và cách sử dụng chúng",
        localServices: "Dịch Vụ Địa Phương",
        localServicesDesc: "Tìm hiểu về các tính năng dịch vụ địa phương và cách sử dụng chúng",
        newsUpdates: "Tin Tức và Cập Nhật",
        newsUpdatesDesc: "Tìm hiểu về các tính năng tin tức và cập nhật và cách sử dụng chúng",
        mapFeatures: "Tính Năng Bản Đồ",
        mapFeaturesDesc: "Tìm hiểu về các tính năng bản đồ và cách sử dụng chúng",
        searchFilters: "Tìm Kiếm và Bộ Lọc",
        searchFiltersDesc: "Tìm hiểu về các tính năng tìm kiếm và bộ lọc và cách sử dụng chúng",
        userFeatures: "Tính Năng Người Dùng",
        userFeaturesDesc: "Tìm hiểu về các tính năng người dùng và cách sử dụng chúng",
        commentsRatings: "Bình Luận và Đánh Giá",
        commentsRatingsDesc: "Tìm hiểu về các tính năng bình luận và đánh giá và cách sử dụng chúng",
        messaging: "Nhắn Tin",
        messagingDesc: "Tìm hiểu về các tính năng nhắn tin và cách sử dụng chúng",
        languagesAccessibility: "Ngôn Ngữ và Khả Năng Truy Cập",
        languagesAccessibilityDesc: "Tìm hiểu về các tính năng ngôn ngữ và khả năng truy cập và cách sử dụng chúng",
        submissionProcess: "Quy Trình Gửi",
        submissionProcessDesc: "Tìm hiểu về các tính năng quy trình gửi và cách sử dụng chúng"
      }
    }
  },
  pt: { 
    translation: {
      navigation: {
        backToHome: "Voltar ao Início",
        news: "Notícias",
        submit: "Enviar",
        submitEvent: "Enviar Evento",
        submitBusiness: "Enviar Negócio",
        submitNews: "Enviar Notícia",
        submitLocalService: "Enviar Serviço Local",
        contactAdmin: "Contatar Administrador",
        myMessages: "Minhas Mensagens",
        mySubmissions: "Minhas Submissões",
        businessDashboard: "Painel de Negócios",
        adminDashboard: "Painel do Administrador",
        signOut: "Sair",
        signIn: "Entrar"
      },
      cards: {
        viewDetails: "Ver Detalhes",
        free: "Grátis",
        location: "Localização",
        date: "Data",
        time: "Hora",
        price: "Preço",
        added: "Adicionado",
        source: "Fonte"
      },
      itemTypes: {
        events: "Eventos",
        news: "Notícias",
        businesses: "Negócios",
        localServices: "Serviços Locais"
      },
      faq: {
        title: "Perguntas Frequentes",
        subtitle: "Tudo o que você precisa saber sobre o uso de nossa plataforma comunitária",
        stillHaveQuestions: "Ainda tem dúvidas?",
        contactMessage: "Se você não conseguir encontrar a resposta que está procurando, sinta-se à vontade para entrar em contato com nossa equipe de suporte ou usar o formulário de contato.",
        gettingStarted: "Começando",
        gettingStartedDesc: "Aprenda sobre recursos de início e como usá-los",
        events: "Eventos",
        eventsDesc: "Aprenda sobre recursos de eventos e como usá-los",
        businesses: "Negócios",
        businessesDesc: "Aprenda sobre recursos de negócios e como usá-los",
        localServices: "Serviços Locais",
        localServicesDesc: "Aprenda sobre recursos de serviços locais e como usá-los",
        newsUpdates: "Notícias e Atualizações",
        newsUpdatesDesc: "Aprenda sobre recursos de notícias e atualizações e como usá-los",
        mapFeatures: "Recursos do Mapa",
        mapFeaturesDesc: "Aprenda sobre recursos do mapa e como usá-los",
        searchFilters: "Pesquisa e Filtros",
        searchFiltersDesc: "Aprenda sobre recursos de pesquisa e filtros e como usá-los",
        userFeatures: "Recursos do Usuário",
        userFeaturesDesc: "Aprenda sobre recursos do usuário e como usá-los",
        commentsRatings: "Comentários e Avaliações",
        commentsRatingsDesc: "Aprenda sobre recursos de comentários e avaliações e como usá-los",
        messaging: "Mensagens",
        messagingDesc: "Aprenda sobre recursos de mensagens e como usá-los",
        languagesAccessibility: "Idiomas e Acessibilidade",
        languagesAccessibilityDesc: "Aprenda sobre recursos de idiomas e acessibilidade e como usá-los",
        submissionProcess: "Processo de Submissão",
        submissionProcessDesc: "Aprenda sobre recursos do processo de submissão e como usá-los"
      }
    }
  }
};

// Get initial language from localStorage or default to English
const getInitialLanguage = () => {
  try {
    return localStorage.getItem('language') || 'en';
  } catch {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;