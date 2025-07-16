// Type definitions for the application

export interface Activity {
  id: string
  time: string
  title: string
  description: string
  type: "food" | "activity" | "travel" | "accommodation" | "must-visit"
  expense?: {
    amount: number
    currency: string
    category?: string
  }
  image?: string
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
  title: string
  completed: boolean
  notes?: string
}

export interface TipItem {
  id: string
  title: string
  description: string
  category: "money-saving" | "safety" | "cultural" | "transportation" | "accommodation" | "general"
  icon?: string
}

export interface Itinerary {
  id: string
  destination: string
  image?: string
  description: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  status: "online" | "completed"
  season?: string
  rating: number
  reviewCount: number
  locations: string[]
  days: ItineraryDay[]
  travellersCount?: number
  totalBudget?: number
  metadata?: {
    checklist?: ChecklistItem[]
    tips?: TipItem[]
    [key: string]: any
  }
}

export interface Location {
  id: string
  name: string
  dates: string
  destinationId: string
}

export interface Accommodation {
  id: string
  name: string
  location: string
  dates: string
  destinationId: string
}

export interface Companion {
  id: string
  name: string
  relationship: string
  bio: string
  image?: string
  instagramId?: string
}

export interface Comment {
  id: string
  name: string
  date: string
  content: string
  rating: number
  itineraryId: string
}

export interface User {
  username: string
  isAdmin: boolean
}
