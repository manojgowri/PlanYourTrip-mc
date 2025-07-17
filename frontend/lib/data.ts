// This file simulates data fetching and manipulation from a backend/database.
// In a real application, these would be API calls (e.g., using fetch or a library like Axios).

import type { TravelItinerary, ChecklistItem, Tip, Expense, Comment, Activity } from "./models"

// --- Mock Data Store ---
let mockItineraries: TravelItinerary[] = [
  {
    _id: "itinerary-1",
    destination: "Hanoi",
    location: "Vietnam",
    startDate: "2024-09-15T00:00:00.000Z",
    endDate: "2024-09-22T00:00:00.000Z",
    imageUrl: "/placeholder.svg?height=400&width=600&text=Hanoi",
    companions: [
      { _id: "comp-1", name: "Alice", role: "Friend" },
      { _id: "comp-2", name: "Bob", role: "Family" },
    ],
    days: [
      {
        _id: "day-1",
        title: "Arrival & Old Quarter",
        description: "Arrive in Hanoi, check into hotel, explore the Old Quarter.",
        date: "2024-09-15T00:00:00.000Z",
        activities: [
          {
            _id: "act-1-1",
            title: "Check-in at Hotel",
            description: "Settle into accommodation.",
            time: "14:00",
            location: "Old Quarter Hotel",
            type: "relaxation",
          },
          {
            _id: "act-1-2",
            title: "Explore Old Quarter",
            description: "Wander through the historic streets.",
            time: "16:00",
            location: "Old Quarter",
            type: "sightseeing",
            imageUrl: "/placeholder.svg?height=150&width=200&text=Old+Quarter",
          },
          {
            _id: "act-1-3",
            title: "Dinner at Cha Ca Thang Long",
            description: "Try the famous grilled fish.",
            time: "19:00",
            location: "Cha Ca Thang Long",
            type: "food",
          },
        ],
      },
      {
        _id: "day-2",
        title: "Cultural Immersion",
        description: "Visit historical sites and enjoy local culture.",
        date: "2024-09-16T00:00:00.000Z",
        activities: [
          {
            _id: "act-2-1",
            title: "Hoan Kiem Lake & Ngoc Son Temple",
            description: "Morning stroll and temple visit.",
            time: "09:00",
            location: "Hoan Kiem Lake",
            type: "sightseeing",
          },
          {
            _id: "act-2-2",
            title: "Water Puppet Show",
            description: "Traditional Vietnamese water puppet performance.",
            time: "15:00",
            location: "Thang Long Water Puppet Theatre",
            type: "culture",
            imageUrl: "/placeholder.svg?height=150&width=200&text=Puppet+Show",
          },
        ],
      },
    ],
    expenses: [
      { _id: "exp-1", description: "Flight Tickets", amount: 800 },
      { _id: "exp-2", description: "Accommodation (7 nights)", amount: 350 },
      { _id: "exp-3", description: "Food & Drinks", amount: 200 },
    ],
    comments: [
      { _id: "comm-1", author: "Alice", text: "Excited for this trip!", timestamp: "2024-08-01T10:00:00.000Z" },
      {
        _id: "comm-2",
        author: "Bob",
        text: "Don't forget the mosquito repellent!",
        timestamp: "2024-08-02T11:30:00.000Z",
      },
    ],
    completed: false,
  },
  {
    _id: "itinerary-2",
    destination: "Ho Chi Minh City",
    location: "Vietnam",
    startDate: "2024-10-01T00:00:00.000Z",
    endDate: "2024-10-07T00:00:00.000Z",
    imageUrl: "/placeholder.svg?height=400&width=600&text=HCMC",
    companions: [{ _id: "comp-3", name: "Charlie", role: "Solo" }],
    days: [
      {
        _id: "day-3",
        title: "Arrival & City Tour",
        description: "Arrive, check-in, and explore central HCMC.",
        date: "2024-10-01T00:00:00.000Z",
        activities: [
          {
            _id: "act-3-1",
            title: "War Remnants Museum",
            description: "Learn about Vietnam's history.",
            time: "10:00",
            location: "HCMC",
            type: "sightseeing",
          },
        ],
      },
    ],
    expenses: [{ _id: "exp-4", description: "Flight", amount: 600 }],
    comments: [],
    completed: false,
  },
]

const mockChecklists: { [itineraryId: string]: ChecklistItem[] } = {
  "itinerary-1": [
    { _id: "chk-1-1", item: "Book flights", completed: true },
    { _id: "chk-1-2", item: "Reserve accommodation", completed: true },
    { _id: "chk-1-3", item: "Get travel insurance", completed: false },
    { _id: "chk-1-4", item: "Pack essentials", completed: false },
    { _id: "chk-1-5", item: "Research local customs", completed: true },
  ],
  "itinerary-2": [
    { _id: "chk-2-1", item: "Visa application", completed: false },
    { _id: "chk-2-2", item: "Currency exchange", completed: false },
  ],
}

const mockTips: { [itineraryId: string]: Tip[] } = {
  "itinerary-1": [
    {
      _id: "tip-1-1",
      title: "Local SIM Card",
      content: "Buy a local SIM card at the airport for easy navigation and communication.",
    },
    {
      _id: "tip-1-2",
      title: "Bargaining",
      content: "Bargaining is common in markets. Start with half the asking price.",
    },
  ],
  "itinerary-2": [
    {
      _id: "tip-2-1",
      title: "Motorbike Taxis",
      content: "Use ride-hailing apps like Grab for motorbike taxis to avoid scams.",
    },
  ],
}

// --- Utility to simulate API delay ---
const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- Itinerary Functions ---
export async function getTravelItineraries(): Promise<TravelItinerary[]> {
  await simulateDelay(500)
  return mockItineraries
}

export async function getItineraryById(id: string): Promise<TravelItinerary | null> {
  await simulateDelay(500)
  return mockItineraries.find((it) => it._id === id) || null
}

export async function addTravelItinerary(
  newItinerary: Omit<TravelItinerary, "_id" | "completed" | "days" | "expenses" | "comments">,
): Promise<TravelItinerary> {
  await simulateDelay(500)
  const id = `itinerary-${Date.now()}`
  const itinerary: TravelItinerary = {
    _id: id,
    ...newItinerary,
    companions: [], // Start with empty companions
    days: [], // Start with empty days
    expenses: [], // Start with empty expenses
    comments: [], // Start with empty comments
    completed: false,
  }
  mockItineraries.push(itinerary)
  return itinerary
}

export async function updateTravelItinerary(
  id: string,
  updatedFields: Partial<TravelItinerary>,
): Promise<TravelItinerary | null> {
  await simulateDelay(500)
  const index = mockItineraries.findIndex((it) => it._id === id)
  if (index > -1) {
    mockItineraries[index] = { ...mockItineraries[index], ...updatedFields }
    return mockItineraries[index]
  }
  return null
}

export async function deleteTravelItinerary(id: string): Promise<boolean> {
  await simulateDelay(500)
  const initialLength = mockItineraries.length
  mockItineraries = mockItineraries.filter((it) => it._id !== id)
  delete mockChecklists[id]
  delete mockTips[id]
  return mockItineraries.length < initialLength
}

export async function updateItineraryCompletionStatus(
  itineraryId: string,
  completed: boolean,
): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary) {
    itinerary.completed = completed
    return { ...itinerary } // Return a copy to ensure reactivity if used in state
  }
  return null
}

// --- Checklist Functions ---
export async function getChecklistItems(itineraryId: string): Promise<ChecklistItem[]> {
  await simulateDelay(300)
  return mockChecklists[itineraryId] || []
}

export async function updateChecklistItem(
  itineraryId: string,
  itemId: string,
  completed: boolean,
): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const checklist = mockChecklists[itineraryId]
  if (checklist) {
    const item = checklist.find((i) => i._id === itemId)
    if (item) {
      item.completed = completed
      // Return the parent itinerary to simulate a full update if needed
      return mockItineraries.find((it) => it._id === itineraryId) || null
    }
  }
  return null
}

// --- Tip Functions ---
export async function getTips(itineraryId: string): Promise<Tip[]> {
  await simulateDelay(300)
  return mockTips[itineraryId] || []
}

export async function addTip(itineraryId: string, title: string, content: string): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary) {
    if (!mockTips[itineraryId]) {
      mockTips[itineraryId] = []
    }
    const newTip: Tip = { _id: `tip-${Date.now()}`, title, content }
    mockTips[itineraryId].push(newTip)
    return { ...itinerary, tips: mockTips[itineraryId] } // Simulate returning updated itinerary
  }
  return null
}

export async function deleteTip(itineraryId: string, tipId: string): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary && mockTips[itineraryId]) {
    mockTips[itineraryId] = mockTips[itineraryId].filter((tip) => tip._id !== tipId)
    return { ...itinerary, tips: mockTips[itineraryId] }
  }
  return null
}

// --- Expense Functions ---
export async function addExpenseItem(
  itineraryId: string,
  description: string,
  amount: number,
): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary) {
    const newExpense: Expense = { _id: `exp-${Date.now()}`, description, amount }
    itinerary.expenses.push(newExpense)
    return { ...itinerary }
  }
  return null
}

export async function updateExpenseItem(
  itineraryId: string,
  expenseId: string,
  newAmount: number,
): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary) {
    const expense = itinerary.expenses.find((exp) => exp._id === expenseId)
    if (expense) {
      expense.amount = newAmount
      return { ...itinerary }
    }
  }
  return null
}

export async function deleteExpenseItem(itineraryId: string, expenseId: string): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary) {
    itinerary.expenses = itinerary.expenses.filter((exp) => exp._id !== expenseId)
    return { ...itinerary }
  }
  return null
}

// --- Comment Functions ---
export async function addComment(itineraryId: string, author: string, text: string): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary) {
    const newComment: Comment = { _id: `comm-${Date.now()}`, author, text, timestamp: new Date().toISOString() }
    itinerary.comments.push(newComment)
    return { ...itinerary }
  }
  return null
}

export async function deleteComment(itineraryId: string, commentId: string): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary) {
    itinerary.comments = itinerary.comments.filter((comment) => comment._id !== commentId)
    return { ...itinerary }
  }
  return null
}

// --- Activity Functions ---
export async function addActivityToDay(
  itineraryId: string,
  dayId: string,
  activityData: Omit<Activity, "_id">,
): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary) {
    const day = itinerary.days.find((d) => d._id === dayId)
    if (day) {
      const newActivity: Activity = { _id: `act-${Date.now()}`, ...activityData }
      day.activities.push(newActivity)
      return { ...itinerary }
    }
  }
  return null
}

export async function updateActivityInDay(
  itineraryId: string,
  dayId: string,
  activityId: string,
  updatedActivityData: Partial<Omit<Activity, "_id">>,
): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary) {
    const day = itinerary.days.find((d) => d._id === dayId)
    if (day) {
      const activityIndex = day.activities.findIndex((a) => a._id === activityId)
      if (activityIndex > -1) {
        day.activities[activityIndex] = { ...day.activities[activityIndex], ...updatedActivityData }
        return { ...itinerary }
      }
    }
  }
  return null
}

export async function deleteActivityFromDay(
  itineraryId: string,
  dayId: string,
  activityId: string,
): Promise<TravelItinerary | null> {
  await simulateDelay(300)
  const itinerary = mockItineraries.find((it) => it._id === itineraryId)
  if (itinerary) {
    const day = itinerary.days.find((d) => d._id === dayId)
    if (day) {
      day.activities = day.activities.filter((a) => a._id !== activityId)
      return { ...itinerary }
    }
  }
  return null
}
