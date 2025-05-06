// API-based data service

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

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Helper function to generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

// Helper function for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API request failed")
  }

  return response.json()
}

// Data access functions
export async function getItineraries(): Promise<Itinerary[]> {
  try {
    return await apiRequest("/itineraries")
  } catch (error) {
    console.error("Error fetching itineraries:", error)
    return []
  }
}

export async function getItinerary(id: string): Promise<Itinerary | undefined> {
  try {
    return await apiRequest(`/itineraries/${id}`)
  } catch (error) {
    console.error(`Error fetching itinerary ${id}:`, error)
    return undefined
  }
}

export async function saveItinerary(itinerary: Itinerary): Promise<Itinerary | undefined> {
  try {
    if (itinerary.id) {
      // Update existing itinerary
      return await apiRequest(`/itineraries/${itinerary.id}`, {
        method: "PUT",
        body: JSON.stringify(itinerary),
      })
    } else {
      // Create new itinerary with generated ID
      const newItinerary = {
        ...itinerary,
        id: generateId(),
      }
      return await apiRequest("/itineraries", {
        method: "POST",
        body: JSON.stringify(newItinerary),
      })
    }
  } catch (error) {
    console.error("Error saving itinerary:", error)
    return undefined
  }
}

export async function deleteItinerary(id: string): Promise<boolean> {
  try {
    await apiRequest(`/itineraries/${id}`, {
      method: "DELETE",
    })
    return true
  } catch (error) {
    console.error(`Error deleting itinerary ${id}:`, error)
    return false
  }
}

export async function getAccommodations(destinationId?: string): Promise<Accommodation[]> {
  try {
    const endpoint = destinationId ? `/accommodations?destinationId=${destinationId}` : "/accommodations"
    return await apiRequest(endpoint)
  } catch (error) {
    console.error("Error fetching accommodations:", error)
    return []
  }
}

export async function saveAccommodation(accommodation: Accommodation): Promise<Accommodation | undefined> {
  try {
    if (accommodation.id) {
      // Update existing accommodation
      return await apiRequest(`/accommodations/${accommodation.id}`, {
        method: "PUT",
        body: JSON.stringify(accommodation),
      })
    } else {
      // Create new accommodation with generated ID
      const newAccommodation = {
        ...accommodation,
        id: generateId(),
      }
      return await apiRequest("/accommodations", {
        method: "POST",
        body: JSON.stringify(newAccommodation),
      })
    }
  } catch (error) {
    console.error("Error saving accommodation:", error)
    return undefined
  }
}

export async function deleteAccommodation(id: string): Promise<boolean> {
  try {
    await apiRequest(`/accommodations/${id}`, {
      method: "DELETE",
    })
    return true
  } catch (error) {
    console.error(`Error deleting accommodation ${id}:`, error)
    return false
  }
}

export async function getLocations(destinationId?: string): Promise<Location[]> {
  try {
    const endpoint = destinationId ? `/locations?destinationId=${destinationId}` : "/locations"
    return await apiRequest(endpoint)
  } catch (error) {
    console.error("Error fetching locations:", error)
    return []
  }
}

export async function saveLocation(location: Location): Promise<Location | undefined> {
  try {
    if (location.id) {
      // Update existing location
      return await apiRequest(`/locations/${location.id}`, {
        method: "PUT",
        body: JSON.stringify(location),
      })
    } else {
      // Create new location with generated ID
      const newLocation = {
        ...location,
        id: generateId(),
      }
      return await apiRequest("/locations", {
        method: "POST",
        body: JSON.stringify(newLocation),
      })
    }
  } catch (error) {
    console.error("Error saving location:", error)
    return undefined
  }
}

export async function deleteLocation(id: string): Promise<boolean> {
  try {
    await apiRequest(`/locations/${id}`, {
      method: "DELETE",
    })
    return true
  } catch (error) {
    console.error(`Error deleting location ${id}:`, error)
    return false
  }
}

export async function getCompanions(): Promise<Companion[]> {
  try {
    return await apiRequest("/companions")
  } catch (error) {
    console.error("Error fetching companions:", error)
    return []
  }
}

export async function saveCompanion(companion: Companion): Promise<Companion | undefined> {
  try {
    if (companion.id) {
      // Update existing companion
      return await apiRequest(`/companions/${companion.id}`, {
        method: "PUT",
        body: JSON.stringify(companion),
      })
    } else {
      // Create new companion with generated ID
      const newCompanion = {
        ...companion,
        id: generateId(),
      }
      return await apiRequest("/companions", {
        method: "POST",
        body: JSON.stringify(newCompanion),
      })
    }
  } catch (error) {
    console.error("Error saving companion:", error)
    return undefined
  }
}

export async function deleteCompanion(id: string): Promise<boolean> {
  try {
    await apiRequest(`/companions/${id}`, {
      method: "DELETE",
    })
    return true
  } catch (error) {
    console.error(`Error deleting companion ${id}:`, error)
    return false
  }
}

export async function addDayToItinerary(itineraryId: string, day: ItineraryDay): Promise<Itinerary | undefined> {
  try {
    const dayWithId = {
      ...day,
      id: day.id || generateId(),
    }

    return await apiRequest(`/itineraries/${itineraryId}/days`, {
      method: "POST",
      body: JSON.stringify(dayWithId),
    })
  } catch (error) {
    console.error("Error adding day to itinerary:", error)
    return undefined
  }
}

export async function deleteDay(itineraryId: string, dayId: string): Promise<Itinerary | undefined> {
  try {
    return await apiRequest(`/itineraries/${itineraryId}/days/${dayId}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error(`Error deleting day ${dayId}:`, error)
    return undefined
  }
}

export async function addActivityToDay(
  itineraryId: string,
  dayId: string,
  activity: Activity,
): Promise<Itinerary | undefined> {
  try {
    const activityWithId = {
      ...activity,
      id: activity.id || generateId(),
    }

    return await apiRequest(`/itineraries/${itineraryId}/days/${dayId}/activities`, {
      method: "POST",
      body: JSON.stringify(activityWithId),
    })
  } catch (error) {
    console.error("Error adding activity to day:", error)
    return undefined
  }
}

export async function deleteActivity(
  itineraryId: string,
  dayId: string,
  activityId: string,
): Promise<Itinerary | undefined> {
  try {
    return await apiRequest(`/itineraries/${itineraryId}/days/${dayId}/activities/${activityId}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error(`Error deleting activity ${activityId}:`, error)
    return undefined
  }
}

export async function markItineraryAsComplete(id: string): Promise<Itinerary | undefined> {
  try {
    return await apiRequest(`/itineraries/${id}/complete`, {
      method: "PUT",
    })
  } catch (error) {
    console.error(`Error marking itinerary ${id} as complete:`, error)
    return undefined
  }
}

export async function getComments(itineraryId: string): Promise<Comment[]> {
  try {
    return await apiRequest(`/comments?itineraryId=${itineraryId}`)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export async function addComment(comment: Comment): Promise<Comment | undefined> {
  try {
    const commentWithId = {
      ...comment,
      id: generateId(),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    }

    return await apiRequest("/comments", {
      method: "POST",
      body: JSON.stringify(commentWithId),
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return undefined
  }
}

// Authentication functions
export async function login(username: string, password: string): Promise<{ token: string; user: any } | undefined> {
  try {
    return await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export function calculateTotalExpenses(itinerary: Itinerary): {
  amount: number
  currency: string
  breakdown: Record<string, number>
} {
  let totalAmount = 0
  const breakdown: Record<string, number> = {}

  // Default to INR
  const currency = "INR"

  itinerary.days.forEach((day) => {
    day.activities.forEach((activity) => {
      if (activity.expense && activity.expense.amount) {
        // Convert to INR if needed
        let amount = activity.expense.amount
        if (activity.expense.currency !== currency) {
          // This would use the conversion function in a real app
          // For now, we'll just use the amount as is
          amount = activity.expense.amount
        }

        totalAmount += amount

        // Add to breakdown by type
        const type = activity.type
        if (!breakdown[type]) {
          breakdown[type] = 0
        }
        breakdown[type] += amount
      }
    })
  })

  return { amount: totalAmount, currency, breakdown }
}
