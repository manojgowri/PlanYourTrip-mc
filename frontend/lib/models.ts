export interface Activity {
  id: string
  time: string
  title: string
  description: string
  type: "food" | "activity" | "travel" | "accommodation" | "must-visit"
  expense?: {
    amount: number
    currency: string
    category: string
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

export interface Itinerary {
  id: string
  destination: string
  image: string
  description: string
  startDate: string
  endDate: string
  days: ItineraryDay[]
  status: "online" | "completed"
  season: string
  rating: number
  reviewCount: number
  locations: string[]
  isCompleted?: boolean
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
  image: string
}

export interface Comment {
  id: string
  name: string
  date: string
  content: string
  rating: number
  itineraryId: string
}

export interface Location {
  id: string
  name: string
  dates: string
  destinationId: string
}

export interface User {
  id: string
  username: string
  isAdmin: boolean
}
