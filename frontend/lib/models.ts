export interface Activity {
  id: string
  title: string
  description: string
  time: string
  type: "food" | "activity" | "travel" | "accommodation" | "must-visit"
  location?: string
  image?: string
  expense?: {
    amount: number
    currency: string
    category?: string
  }
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
  notes?: string
  completed: boolean
}

export interface TipItem {
  id: string
  title: string
  description: string
  category: "money-saving" | "safety" | "cultural" | "transportation" | "accommodation" | "general"
}

export interface Itinerary {
  id: string
  destination: string
  description: string
  image?: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  status: "online" | "completed"
  season?: string
  locations: string[]
  days: ItineraryDay[]
  travellersCount?: number
  metadata?: {
    checklist?: ChecklistItem[]
    tips?: TipItem[]
  }
}

export interface Accommodation {
  id: string
  name: string
  type: "hotel" | "hostel" | "apartment" | "resort" | "guesthouse"
  location: string
  pricePerNight: number
  currency: string
  rating: number
  amenities: string[]
  image?: string
  destinationId?: string
}

export interface Location {
  id: string
  name: string
  type: "city" | "landmark" | "beach" | "mountain" | "park" | "museum"
  description: string
  coordinates?: {
    lat: number
    lng: number
  }
  image?: string
  destinationId?: string
}

export interface Companion {
  id: string
  name: string
  role?: string
  bio?: string
  image?: string
  instagramId?: string
}

export interface Comment {
  id: string
  itineraryId: string
  author: string
  content: string
  date: string
  rating?: number
}
