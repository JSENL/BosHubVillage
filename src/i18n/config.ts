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