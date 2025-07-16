export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  category: string
}

export interface TravelTip {
  id: string
  title: string
  content: string
  category: "money-saving" | "safety" | "cultural" | "navigation" | "photography" | "food" | "timing" | "general"
}

export interface Expense {
  amount: number
  currency: string
  description?: string
}

export interface Activity {
  id: string
  name: string
  type: string
  time: string
  location: string
  description?: string
  expense?: Expense
  image?: string
}

export interface ItineraryDay {
  id: string
  day: number
  date: string
  location: string
  activities: Activity[]
}

export interface Itinerary {
  id: string
  destination: string
  description: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  totalBudget?: number
  travellersCount?: number
  travelStyle?: "solo" | "couple" | "group" | "family"
  image: string
  rating: number
  reviewCount: number
  locations: string[]
  days: ItineraryDay[]
  status: "draft" | "published" | "completed"
  season?: string
  metadata?: {
    checklist?: ChecklistItem[]
    tips?: TravelTip[]
    [key: string]: any
  }
}

export interface Accommodation {
  id: string
  name: string
  type: string
  location: string
  dates: string
  price?: number
  rating?: number
  image?: string
  destinationId?: string
}

export interface Location {
  id: string
  name: string
  type: string
  description?: string
  coordinates?: {
    lat: number
    lng: number
  }
  destinationId?: string
}

export interface Companion {
  id: string
  name: string
  role?: string
  bio?: string
  image?: string
  socialMedia?: {
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  expertise?: string[]
  languages?: string[]
}

export interface Comment {
  id: string
  author: string
  content: string
  date: string
  rating?: number
  itineraryId: string
}

export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "user"
  profile?: {
    name: string
    avatar?: string
  }
}
