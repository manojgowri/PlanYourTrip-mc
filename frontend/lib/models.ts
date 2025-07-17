export interface Itinerary {
  _id: string
  destination: string
  startDate: string
  endDate: string
  image?: string
  description?: string
  status: "online" | "completed"
  season?: string
  locations?: string[]
  rating?: number
  reviewsCount?: number
  totalBudget: number
  travellersCount: number
  category: string
  days: ItineraryDay[]
  accommodations?: Accommodation[]
  preTripChecklist?: ChecklistItem[]
  tips?: Tip[]
  travelRecommendation?: string
}

export interface ItineraryDay {
  _id: string
  dayNumber: number
  date: string
  location: string
  activities: Activity[]
}

export interface Activity {
  _id: string
  name: string
  time: string
  location?: string
  description?: string
  type: "sightseeing" | "food" | "adventure" | "relaxation" | "must-visit" | string
  expense?: {
    amount: number
    currency: string
  }
  image?: string
  notes?: string
  mustVisit?: boolean
}

export interface Accommodation {
  _id: string
  name: string
  location: string
  dates: string
  itineraryId: string
}

export interface Companion {
  _id: string
  name: string
  relation: string
  image?: string
  instagramId?: string
}

export interface Comment {
  _id: string
  itineraryId: string
  author: string
  date: string
  text: string
}

export interface Location {
  _id: string
  name: string
  description?: string
  itineraryId?: string
}

export interface ChecklistItem {
  _id: string
  item: string
  completed: boolean
}

export interface Tip {
  _id: string
  tip: string
}
