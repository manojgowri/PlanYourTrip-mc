export interface Itinerary {
  _id: string
  destination: string
  startDate: string
  endDate: string
  duration: string // e.g., "9 Days / 8 Nights"
  category: string // e.g., "Adventure", "Relaxation"
  season: string // e.g., "Summer", "Winter"
  image: string
  description: string
  totalBudget: number
  travellersCount?: number // New field for group trips
  travelRecommendation?: string // New field for solo/friends/family
  reviewsCount?: number // New field for dynamic review counts
  days: ItineraryDay[]
  preTripChecklist?: PreTripChecklistItem[] // Array of checklist items
  tips?: Tip[] // Array of tips
}

export interface ItineraryDay {
  dayNumber: number
  date?: string // Optional date for the day
  activities: Activity[]
}

export interface Activity {
  _id: string
  name: string
  time: string
  location?: string
  description?: string
  expense?: number // Optional expense for the activity
  notes?: string
  type?: string // e.g., "Must visit place", "Restaurant", "Activity"
}

export interface PreTripChecklistItem {
  _id: string
  item: string
  completed: boolean
}

export interface Tip {
  _id: string
  title: string
  content: string
  category: string // e.g., "money", "safety", "culture"
}

export interface Companion {
  _id: string
  name: string
  title: string
  image: string
  instagramId?: string // Changed to Instagram ID
}
