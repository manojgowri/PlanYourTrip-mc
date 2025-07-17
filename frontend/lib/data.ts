import type { Itinerary, Companion, Activity } from "./models"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Itinerary Functions
export async function getItineraries(): Promise<Itinerary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/itineraries`, {
      next: { revalidate: 0 }, // Ensure no caching for fresh data
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch itineraries: ${res.statusText}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error in getItineraries:", error)
    return []
  }
}

export async function getItineraryById(id: string): Promise<Itinerary | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/itineraries/${id}`, {
      next: { revalidate: 0 }, // Ensure no caching for fresh data
    })
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Itinerary with ID ${id} not found.`)
        return null
      }
      throw new Error(`Failed to fetch itinerary by ID: ${res.statusText}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error(`Error in getItineraryById for ID ${id}:`, error)
    return null
  }
}

export async function saveItinerary(itinerary: Itinerary): Promise<Itinerary | null> {
  try {
    const method = itinerary._id ? "PUT" : "POST"
    const url = itinerary._id ? `${API_BASE_URL}/api/itineraries/${itinerary._id}` : `${API_BASE_URL}/api/itineraries`

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itinerary),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(`Failed to save itinerary: ${res.statusText} - ${errorData.message}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error in saveItinerary:", error)
    return null
  }
}

export async function deleteItinerary(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/itineraries/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      throw new Error(`Failed to delete itinerary: ${res.statusText}`)
    }
    return true
  } catch (error) {
    console.error("Error in deleteItinerary:", error)
    return false
  }
}

export async function markItineraryAsComplete(id: string): Promise<Itinerary | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/itineraries/${id}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "completed" }),
    })
    if (!res.ok) {
      throw new Error(`Failed to mark itinerary as complete: ${res.statusText}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error in markItineraryAsComplete:", error)
    return null
  }
}

// Companion Functions
export async function getCompanions(): Promise<Companion[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/companions`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch companions: ${res.statusText}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error in getCompanions:", error)
    return []
  }
}

export async function saveCompanion(companion: Companion): Promise<Companion | null> {
  try {
    const method = companion._id ? "PUT" : "POST"
    const url = companion._id ? `${API_BASE_URL}/api/companions/${companion._id}` : `${API_BASE_URL}/api/companions`

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companion),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(`Failed to save companion: ${res.statusText} - ${errorData.message}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error in saveCompanion:", error)
    return null
  }
}

export async function deleteCompanion(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/companions/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      throw new Error(`Failed to delete companion: ${res.statusText}`)
    }
    return true
  } catch (error) {
    console.error("Error in deleteCompanion:", error)
    return false
  }
}

// Activity Functions
export async function saveActivity(itineraryId: string, dayId: string, activity: Activity): Promise<Activity | null> {
  try {
    const method = activity._id ? "PUT" : "POST"
    const url = activity._id
      ? `${API_BASE_URL}/api/itineraries/${itineraryId}/days/${dayId}/activities/${activity._id}`
      : `${API_BASE_URL}/api/itineraries/${itineraryId}/days/${dayId}/activities`

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activity),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(`Failed to save activity: ${res.statusText} - ${errorData.message}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error in saveActivity:", error)
    return null
  }
}

export async function deleteActivity(itineraryId: string, dayId: string, activityId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}/days/${dayId}/activities/${activityId}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      throw new Error(`Failed to delete activity: ${res.statusText}`)
    }
    return true
  } catch (error) {
    console.error("Error in deleteActivity:", error)
    return false
  }
}

// Health Checks
export async function testDatabaseConnection(): Promise<{ message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/db-test`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) {
      throw new Error(`Database connection test failed: ${res.statusText}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error in testDatabaseConnection:", error)
    return { message: "Failed to connect to database" }
  }
}

export async function checkServerHealth(): Promise<{ message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) {
      throw new Error(`Server health check failed: ${res.statusText}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error in checkServerHealth:", error)
    return { message: "Server unhealthy" }
  }
}
