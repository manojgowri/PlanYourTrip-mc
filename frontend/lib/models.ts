export interface TravelItinerary {
  _id: string
  destination: string
  location: string
  startDate: string
  endDate: string
  imageUrl?: string
  companions: Companion[]
  days: ItineraryDay[]
  expenses: Expense[]
  comments: Comment[]
  completed: boolean
}

export interface Companion {
  _id: string
  name: string
  role: string
}

export interface ItineraryDay {
  _id: string
  title: string
  description: string
  date: string // ISO date string
  activities: Activity[]
}

export interface Activity {
  _id: string
  title: string
  description: string
  time: string // e.g., "10:00 AM" or "14:30"
  location: string
  type: "sightseeing" | "food" | "adventure" | "relaxation" | "shopping" | "other"
  imageUrl?: string
}

export interface ChecklistItem {
  _id: string
  item: string
  completed: boolean
}

export interface Tip {
  _id: string
  title: string
  content: string
}

export interface Expense {
  _id: string
  description: string
  amount: number
}

export interface Comment {
  _id: string
  author: string
  text: string
  timestamp: string // ISO date string
}
