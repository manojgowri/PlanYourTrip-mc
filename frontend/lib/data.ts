import type { Itinerary, Activity, Accommodation, ChecklistItem, Tip } from "./models"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Helper function for API calls
async function fetchApi(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "An unknown error occurred" }))
    throw new Error(errorData.message || `API call failed: ${response.statusText}`)
  }
  return response.json()
}

// Itinerary functions
export async function getItineraries(): Promise<Itinerary[]> {
  return fetchApi("/api/itineraries")
}

export async function getItineraryById(id: string): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${id}`)
}

export async function saveItinerary(itinerary: Itinerary): Promise<Itinerary> {
  const method = itinerary._id ? "PUT" : "POST"
  const endpoint = itinerary._id ? `/api/itineraries/${itinerary._id}` : "/api/itineraries"
  return fetchApi(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itinerary),
  })
}

export async function deleteItinerary(id: string): Promise<{ message: string }> {
  return fetchApi(`/api/itineraries/${id}`, { method: "DELETE" })
}

export async function markItineraryAsComplete(id: string): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${id}/complete`, { method: "PATCH" })
}

// Activity functions
export async function addActivity(itineraryId: string, dayIndex: number, activity: Activity): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/days/${dayIndex}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activity),
  })
}

export async function updateActivity(
  itineraryId: string,
  dayIndex: number,
  activityId: string,
  activity: Activity,
): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/days/${dayIndex}/activities/${activityId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activity),
  })
}

export async function deleteActivity(itineraryId: string, dayIndex: number, activityId: string): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/days/${dayIndex}/activities/${activityId}`, {
    method: "DELETE",
  })
}

// Accommodation functions
export async function addAccommodation(itineraryId: string, accommodation: Accommodation): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/accommodations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accommodation),
  })
}

export async function updateAccommodation(
  itineraryId: string,
  accommodationId: string,
  accommodation: Accommodation,
): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/accommodations/${accommodationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accommodation),
  })
}

export async function deleteAccommodation(itineraryId: string, accommodationId: string): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/accommodations/${accommodationId}`, {
    method: "DELETE",
  })
}

// Checklist functions
export async function addChecklistItem(itineraryId: string, item: ChecklistItem): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/checklist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
}

export async function updateChecklistItem(itineraryId: string, itemId: string, completed: boolean): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/checklist/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  })
}

export async function deleteChecklistItem(itineraryId: string, itemId: string): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/checklist/${itemId}`, {
    method: "DELETE",
  })
}

// Tip functions
export async function addTip(itineraryId: string, tip: Tip): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/tips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tip),
  })
}

export async function updateTip(itineraryId: string, tipId: string, tip: Tip): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/tips/${tipId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tip),
  })
}

export async function deleteTip(itineraryId: string, tipId: string): Promise<Itinerary> {
  return fetchApi(`/api/itineraries/${itineraryId}/tips/${tipId}`, {
    method: "DELETE",
  })
}

// Health check functions
export async function testDatabaseConnection(): Promise<{ message: string }> {
  return fetchApi("/api/health/db")
}

export async function checkServerHealth(): Promise<{ message: string }> {
  return fetchApi("/api/health/server")
}
