import type { Itinerary, Companion, Activity, Accommodation, Comment, Location } from "./models"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://planyourtrip-mc.onrender.com/api"
console.log("API URL:", API_URL)

export function generateId(): string {
  if (typeof window === "undefined") {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()
  console.log(`API Request: ${options.method || "GET"} ${endpoint}`, {
    hasToken: !!token,
    bodyLength: options.body ? (options.body as string).length : 0,
  })

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    })

    console.log(`API Response: ${options.method || "GET"} ${endpoint}`, {
      status: response.status,
      ok: response.ok,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
      console.error(`API Error: ${options.method || "GET"} ${endpoint}`, {
        status: response.status,
        error: errorData,
      })
      throw new Error(errorData.message || "API request failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API Request Failed: ${options.method || "GET"} ${endpoint}`, error)
    throw error
  }
}

export async function getItineraries(): Promise<Itinerary[]> {
  try {
    console.log("Fetching all itineraries")
    const data = await apiRequest("/itineraries")
    console.log(`Fetched ${data.length} itineraries`)
    return data
  } catch (error) {
    console.error("Error fetching itineraries:", error)
    return []
  }
}

export async function getItinerary(id: string): Promise<Itinerary | undefined> {
  try {
    console.log(`Fetching itinerary: ${id}`)
    const data = await apiRequest(`/itineraries/${id}`)
    console.log(`Fetched itinerary: ${data.destination}`)
    return data
  } catch (error) {
    console.error(`Error fetching itinerary ${id}:`, error)
    return undefined
  }
}

export async function saveItinerary(itinerary: Itinerary): Promise<Itinerary | undefined> {
  try {
    console.log(`Saving itinerary: ${itinerary.destination}`, { id: itinerary._id })

    if (itinerary._id) {
      console.log(`Updating existing itinerary: ${itinerary._id}`)
      return await apiRequest(`/itineraries/${itinerary._id}`, {
        method: "PUT",
        body: JSON.stringify(itinerary),
      })
    } else {
      console.log(`Creating new itinerary`)
      return await apiRequest("/itineraries", {
        method: "POST",
        body: JSON.stringify(itinerary),
      })
    }
  } catch (error) {
    console.error("Error saving itinerary:", error)
    return undefined
  }
}

export async function testDatabaseConnection(): Promise<any> {
  try {
    console.log("Testing database connection")
    return await apiRequest("/test-db")
  } catch (error) {
    console.error("Database connection test failed:", error)
    throw error
  }
}

export async function checkServerHealth(): Promise<any> {
  try {
    console.log("Checking server health")
    return await apiRequest("/health")
  } catch (error) {
    console.error("Server health check failed:", error)
    throw error
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
    console.log("Saving accommodation:", accommodation)

    if (accommodation._id) {
      return await apiRequest(`/accommodations/${accommodation._id}`, {
        method: "PUT",
        body: JSON.stringify(accommodation),
      })
    } else {
      const savedAccommodation = await apiRequest("/accommodations", {
        method: "POST",
        body: JSON.stringify(accommodation),
      })

      console.log("Accommodation saved successfully:", savedAccommodation)
      return savedAccommodation
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
    console.log("Saving location:", location)

    if (location._id) {
      const updatedLocation = await apiRequest(`/locations/${location._id}`, {
        method: "PUT",
        body: JSON.stringify(location),
      })
      return updatedLocation
    } else {
      const savedLocation = await apiRequest("/locations", {
        method: "POST",
        body: JSON.stringify(location),
      })
      return savedLocation
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
    if (companion._id) {
      return await apiRequest(`/companions/${companion._id}`, {
        method: "PUT",
        body: JSON.stringify(companion),
      })
    } else {
      return await apiRequest("/companions", {
        method: "POST",
        body: JSON.stringify(companion),
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

export async function addDayToItinerary(
  itineraryId: string,
  day: Itinerary["days"][0],
): Promise<Itinerary | undefined> {
  try {
    console.log(`Adding day to itinerary ${itineraryId}:`, day)

    const updatedItinerary = await apiRequest(`/itineraries/${itineraryId}/days`, {
      method: "POST",
      body: JSON.stringify(day),
    })

    console.log("Day added successfully, updated itinerary:", updatedItinerary)
    return updatedItinerary
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
    return await apiRequest(`/itineraries/${itineraryId}/days/${dayId}/activities`, {
      method: "POST",
      body: JSON.stringify(activity),
    })
  } catch (error) {
    console.error("Error adding activity to day:", error)
    return undefined
  }
}

export async function updateActivity(
  itineraryId: string,
  dayId: string,
  activityId: string,
  activity: Activity,
): Promise<Itinerary | undefined> {
  try {
    return await apiRequest(`/itineraries/${itineraryId}/days/${dayId}/activities/${activityId}`, {
      method: "PUT",
      body: JSON.stringify(activity),
    })
  } catch (error) {
    console.error("Error updating activity:", error)
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
    const commentWithDate = {
      ...comment,
      date: new Date().toISOString(),
    }

    return await apiRequest("/comments", {
      method: "POST",
      body: JSON.stringify(commentWithDate),
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return undefined
  }
}

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

  const currency = "INR"

  itinerary.days.forEach((day) => {
    day.activities.forEach((activity) => {
      if (activity.expense && activity.expense.amount) {
        let amount = activity.expense.amount
        if (activity.expense.currency !== currency) {
          amount = activity.expense.amount
        }

        totalAmount += amount

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

export async function updateChecklistItem(
  itineraryId: string,
  itemId: string,
  completed: boolean,
): Promise<Itinerary | undefined> {
  try {
    return await apiRequest(`/itineraries/${itineraryId}/checklist/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ completed }),
    })
  } catch (error) {
    console.error(`Error updating checklist item ${itemId}:`, error)
    return undefined
  }
}
