// Available languages
export const languages = {
  en: { code: "en", name: "English", flag: "🇺🇸" },
  vi: { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  es: { code: "es", name: "Spanish", flag: "🇪🇸" },
  fr: { code: "fr", name: "French", flag: "🇫🇷" },
  de: { code: "de", name: "German", flag: "🇩🇪" },
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
    case "vi":
      return "Tiếng Việt"
    default:
      return "Unknown"
  }
}
