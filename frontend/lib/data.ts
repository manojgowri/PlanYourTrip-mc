import type { Itinerary, Companion, Activity, Tip } from "./models"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function fetchItineraries(): Promise<Itinerary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching itineraries:", error)
    return []
  }
}

export async function fetchItineraryById(id: string): Promise<Itinerary | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${id}`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching itinerary with ID ${id}:`, error)
    return null
  }
}

export async function createItinerary(itineraryData: Partial<Itinerary>): Promise<Itinerary | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itineraryData),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating itinerary:", error)
    return null
  }
}

export async function updateItinerary(id: string, itineraryData: Partial<Itinerary>): Promise<Itinerary | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itineraryData),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error updating itinerary with ID ${id}:`, error)
    return null
  }
}

export async function deleteItinerary(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error(`Error deleting itinerary with ID ${id}:`, error)
    return false
  }
}

export async function fetchCompanions(): Promise<Companion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/companions`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching companions:", error)
    return []
  }
}

export async function createCompanion(companionData: Partial<Companion>): Promise<Companion | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/companions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companionData),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating companion:", error)
    return null
  }
}

export async function updateCompanion(id: string, companionData: Partial<Companion>): Promise<Companion | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/companions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companionData),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error updating companion with ID ${id}:`, error)
    return null
  }
}

export async function deleteCompanion(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/companions/${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error(`Error deleting companion with ID ${id}:`, error)
    return false
  }
}

export async function fetchActivities(itineraryId: string): Promise<Activity[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}/activities`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching activities for itinerary ${itineraryId}:`, error)
    return []
  }
}

export async function addActivity(itineraryId: string, activityData: Partial<Activity>): Promise<Activity | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityData),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error adding activity to itinerary ${itineraryId}:`, error)
    return null
  }
}

export async function updateActivity(
  itineraryId: string,
  activityId: string,
  activityData: Partial<Activity>,
): Promise<Activity | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}/activities/${activityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityData),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error updating activity ${activityId} for itinerary ${itineraryId}:`, error)
    return null
  }
}

export async function deleteActivity(itineraryId: string, activityId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}/activities/${activityId}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error(`Error deleting activity ${activityId} for itinerary ${itineraryId}:`, error)
    return false
  }
}

export async function fetchTips(itineraryId: string): Promise<Tip[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}/tips`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching tips for itinerary ${itineraryId}:`, error)
    return []
  }
}

export async function addTip(itineraryId: string, tipData: Partial<Tip>): Promise<Tip | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}/tips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tipData),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error adding tip to itinerary ${itineraryId}:`, error)
    return null
  }
}

export async function updateTip(itineraryId: string, tipId: string, tipData: Partial<Tip>): Promise<Tip | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}/tips/${tipId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tipData),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error updating tip ${tipId} for itinerary ${itineraryId}:`, error)
    return null
  }
}

export async function deleteTip(itineraryId: string, tipId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}/tips/${tipId}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error(`Error deleting tip ${tipId} for itinerary ${itineraryId}:`, error)
    return false
  }
}
