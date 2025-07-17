export interface Itinerary {
  _id: string
  id: string // Added for consistency, often _id is used as id
  destination: string
  startDate: string
  endDate: string
  totalBudget?: number
  travellersCount?: number
  category?: string
  status: "planning" | "booked" | "completed" | "cancelled" | "online"
  image?: string
  description?: string
  season?: string
  locations: string[]
  rating?: number
  reviewsCount?: number
  days: Day[]
  expenses?: Expense[]
  accommodations?: Accommodation[]
  preTripChecklist?: ChecklistItem[]
  tips?: Tip[]
  metadata?: {
    createdAt: string
    updatedAt: string
  }
}

export interface Day {
  date: string
  activities: Activity[]
}

export interface Activity {
  _id: string
  name: string
  time: string
  location: string
  description?: string
  cost?: number
  category?: string
  status?: "planned" | "booked" | "completed" | "cancelled"
}

export interface Expense {
  _id: string
  item: string
  cost: number
  category: string
  date: string
}

export interface Accommodation {
  _id: string
  name: string
  type: string
  checkInDate: string
  checkOutDate: string
  cost?: number
  bookingConfirmation?: string
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
