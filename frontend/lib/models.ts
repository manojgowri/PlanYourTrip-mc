export interface Itinerary {
  _id: string
  destination: string
  startDate: string
  endDate: string
  totalBudget: number
  travellersCount: number
  category: string
  status: "online" | "completed" | "draft"
  image: string
  description: string
  season: string
  locations: string[]
  rating: number
  reviewsCount: number
  days: Day[]
  accommodations: Accommodation[]
  preTripChecklist: ChecklistItem[]
  tips: Tip[]
  comments: Comment[]
}

export interface Day {
  _id: string
  dayNumber: number
  date: string
  activities: Activity[]
}

export interface Activity {
  _id: string
  name: string
  time: string
  location: string
  description: string
  image?: string
  cost: number
  type?: "Must visit place" | "Other" // Added type field
}

export interface Accommodation {
  _id: string
  name: string
  type: string
  checkInDate: string
  checkOutDate: string
  cost: number
}

export interface ChecklistItem {
  _id: string
  item: string
  isCompleted: boolean
}

export interface Tip {
  _id: string
  title: string
  description: string
}

export interface Comment {
  _id: string
  author: string
  text: string
  createdAt: string
}

export interface Companion {
  _id: string
  name: string
  relation: string
  contact: string
  image?: string
  notes?: string
}
