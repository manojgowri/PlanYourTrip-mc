export interface Activity {
  id: string
  name: string
  description?: string
  time?: string
  location?: string
  type: "sightseeing" | "food" | "transport" | "accommodation" | "flight" | "must-visit"
  image?: string
  expense?: number
}

export interface ItineraryDay {
  id: string
  day: number
  date: string
  location: string
  activities: Activity[]
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface TipItem {
  id: string
  title: string
  description: string
  category: "money-saving" | "safety" | "cultural" | "navigation" | "photography" | "food" | "timing" | "general"
}

export interface ItineraryMetadata {
  checklist?: ChecklistItem[]
  tips?: TipItem[]
  customFields?: Record<string, any>
}

export interface Itinerary {
  id: string
  destination: string
  slug: string
  description?: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  locations: string[]
  days: ItineraryDay[]
  image?: string
  rating: number
  reviewCount: number
  status: "upcoming" | "completed"
  season?: "spring" | "summer" | "autumn" | "winter"
  totalBudget?: number
  travellersCount?: number
  travelStyle?: "solo" | "couple" | "friends" | "family" | "group"
  metadata?: ItineraryMetadata
}

export interface Comment {
  id: string
  itineraryId: string
  author: string
  content: string
  date: string
  rating?: number
}

export interface Accommodation {
  id: string
  itineraryId: string
  name: string
  location: string
  dates: string
  image?: string
}

export interface Companion {
  id: string
  name: string
  role?: string
  bio?: string
  image?: string
  instagramId?: string
  isActive: boolean
}
