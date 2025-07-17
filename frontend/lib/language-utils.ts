// Available languages
export const languages = {
  en: { code: "en", name: "English", flag: "🇺🇸" },
  vi: { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  es: { code: "es", name: "Spanish", flag: "🇪🇸" },
  fr: { code: "fr", name: "French", flag: "🇫🇷" },
  de: { code: "de", name: "German", flag: "🇩🇪" },
  hi: { code: "hi", name: "हिंदी", flag: "🇮🇳" }, // Added Hindi language
}

// Default language
export const defaultLanguage = "en"

// Get browser language
export function getBrowserLanguage(): string {
  if (typeof navigator === "undefined") return defaultLanguage

  const browserLang = navigator.language.split("-")[0]
  return languages[browserLang as keyof typeof languages] ? browserLang : defaultLanguage
}

// Get language from local storage or browser
export function getPreferredLanguage(): string {
  if (typeof window === "undefined") return defaultLanguage

  const storedLang = localStorage.getItem("preferredLanguage")
  if (storedLang && languages[storedLang as keyof typeof languages]) {
    return storedLang
  }

  return getBrowserLanguage()
}

// Set preferred language
export function setPreferredLanguage(langCode: string): void {
  if (typeof window === "undefined") return

  if (languages[langCode as keyof typeof languages]) {
    localStorage.setItem("preferredLanguage", langCode)
  }
}

// Translation dictionaries
type TranslationDictionary = Record<string, string>

const translations: Record<string, TranslationDictionary> = {
  en: {
    welcome: "Welcome to Plan Your Trip Amigos",
    home: "Home",
    itineraries: "Itineraries",
    companions: "Companions",
    admin: "Admin",
    login: "Login",
    logout: "Logout",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    addTrip: "Add Trip",
    viewDetails: "View Details",
    editTrip: "Edit Trip",
    deleteTrip: "Delete Trip",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    loading: "Loading...",
    error: "An error occurred",
    offline: "You are offline",
  },
  vi: {
    welcome: "Chào mừng đến với Plan Your Trip Amigos",
    home: "Trang chủ",
    itineraries: "Lịch trình",
    companions: "Bạn đồng hành",
    admin: "Quản trị",
    login: "Đăng nhập",
    logout: "Đăng xuất",
    darkMode: "Chế độ tối",
    lightMode: "Chế độ sáng",
    addTrip: "Thêm chuyến đi",
    viewDetails: "Xem chi tiết",
    editTrip: "Chỉnh sửa",
    deleteTrip: "Xóa",
    saveChanges: "Lưu thay đổi",
    cancel: "Hủy",
    loading: "Đang tải...",
    error: "Đã xảy ra lỗi",
    offline: "Bạn đang ngoại tuyến",
  },
  es: {
    welcome: "Bienvenido a Plan Your Trip Amigos",
    home: "Inicio",
    itineraries: "Itinerarios",
    companions: "Compañeros",
    admin: "Admin",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    darkMode: "Modo oscuro",
    lightMode: "Modo claro",
    addTrip: "Agregar viaje",
    viewDetails: "Ver detalles",
    editTrip: "Editar viaje",
    deleteTrip: "Eliminar viaje",
    saveChanges: "Guardar cambios",
    cancel: "Cancelar",
    loading: "Cargando...",
    error: "Ocurrió un error",
    offline: "Estás desconectado",
  },
  fr: {
    welcome: "Bienvenue à Plan Your Trip Amigos",
    home: "Accueil",
    itineraries: "Itinéraires",
    companions: "Compagnons",
    admin: "Admin",
    login: "Connexion",
    logout: "Déconnexion",
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    addTrip: "Ajouter un voyage",
    viewDetails: "Voir les détails",
    editTrip: "Éditer le voyage",
    deleteTrip: "Supprimer le voyage",
    saveChanges: "Enregistrer les modifications",
    cancel: "Annuler",
    loading: "Chargement...",
    error: "Une erreur s'est produite",
    offline: "Vous êtes hors ligne",
  },
  de: {
    welcome: "Willkommen bei Plan Your Trip Amigos",
    home: "Startseite",
    itineraries: "Reisen",
    companions: "Mitfahrer",
    admin: "Admin",
    login: "Anmelden",
    logout: "Abmelden",
    darkMode: "Dunkler Modus",
    lightMode: "Heller Modus",
    addTrip: "Reise hinzufügen",
    viewDetails: "Details anzeigen",
    editTrip: "Reise bearbeiten",
    deleteTrip: "Reise löschen",
    saveChanges: "Änderungen speichern",
    cancel: "Abbrechen",
    loading: "Laden...",
    error: "Ein Fehler ist aufgetreten",
    offline: "Sie sind offline",
  },
  hi: {
    welcome: "Plan Your Trip Amigos में आपका स्वागत है",
    home: "होम",
    itineraries: "यात्रा योजना",
    companions: "साथी",
    admin: "प्रशासक",
    login: "लॉग इन करें",
    logout: "लॉग आउट करें",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    addTrip: "यात्रा जोड़ें",
    viewDetails: "विवरण देखें",
    editTrip: "यात्रा संपादित करें",
    deleteTrip: "यात्रा हटाएं",
    saveChanges: "परिवर्तन बचाएं",
    cancel: "रद्द करें",
    loading: "लोड हो रहा है...",
    error: "कोई त्रुटि हुई है",
    offline: "आप ऑफ़लाइन हैं",
  },
  // Add more languages as needed
}

// Translate a key
export function translate(key: string, language = getPreferredLanguage()): string {
  const langDict = translations[language] || translations[defaultLanguage]
  return langDict[key] || key
}

// Language selector component props
export interface LanguageSelectorProps {
  onChange?: (langCode: string) => void
}

// Get language name
export const getLanguageName = (code: string): string => {
  switch (code) {
    case "en":
      return "English"
    case "es":
      return "Español"
    case "fr":
      return "Français"
    case "de":
      return "Deutsch"
    case "hi":
      return "हिंदी"
    default:
      return "Unknown"
  }
}

// Get language code
export const getLanguageCode = (name: string): string => {
  switch (name) {
    case "English":
      return "en"
    case "Español":
      return "es"
    case "Français":
      return "fr"
    case "Deutsch":
      return "de"
    case "हिंदी":
      return "hi"
    default:
      return "en" // Default to English
  }
}
