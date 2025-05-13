import type { Itinerary, Companion, User } from "./models"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://planyourtrip-mc.onrender.com"

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("API Error:", response.status, errorData)
    throw new Error(errorData.message || `API error: ${response.status}`)
  }
  return response.json()
}

// Authentication
export async function login(username: string, password: string): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  })

  return handleResponse(response)
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

// Itineraries
export async function fetchItineraries(): Promise<Itinerary[]> {
  try {
    const response = await fetch(`${API_URL}/api/itineraries`)
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching itineraries:", error)
    return []
  }
}

export async function fetchItinerary(id: string): Promise<Itinerary | null> {
  try {
    const response = await fetch(`${API_URL}/api/itineraries/${id}`)
    return handleResponse(response)
  } catch (error) {
    console.error(`Error fetching itinerary ${id}:`, error)
    return null
  }
}

export async function createItinerary(itinerary: Partial<Itinerary>): Promise<Itinerary> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${API_URL}/api/itineraries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itinerary),
    credentials: "include",
  })

  return handleResponse(response)
}

export async function updateItinerary(
  id: string,
  updates: Partial<Itinerary>,
): Promise<{ message: string; id: string }> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${API_URL}/api/itineraries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
    credentials: "include",
  })

  return handleResponse(response)
}

export async function deleteItinerary(id: string): Promise<{ message: string; id: string }> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${API_URL}/api/itineraries/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  return handleResponse(response)
}

// Companions
export async function fetchCompanions(): Promise<Companion[]> {
  try {
    const response = await fetch(`${API_URL}/api/companions`)
    return handleResponse(response)
  } catch (error) {
    console.error("Error fetching companions:", error)
    return []
  }
}

export async function fetchCompanion(id: string): Promise<Companion | null> {
  try {
    const response = await fetch(`${API_URL}/api/companions/${id}`)
    return handleResponse(response)
  } catch (error) {
    console.error(`Error fetching companion ${id}:`, error)
    return null
  }
}

export async function createCompanion(companion: Partial<Companion>): Promise<Companion> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${API_URL}/api/companions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(companion),
    credentials: "include",
  })

  return handleResponse(response)
}

export async function updateCompanion(
  id: string,
  updates: Partial<Companion>,
): Promise<{ message: string; id: string }> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Authentication required")
  }

  console.log(`Updating companion ${id} with:`, updates)

  const response = await fetch(`${API_URL}/api/companions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
    credentials: "include",
  })

  return handleResponse(response)
}

export async function deleteCompanion(id: string): Promise<{ message: string; id: string }> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${API_URL}/api/companions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })

  return handleResponse(response)
}

// Database test
export async function testDatabaseConnection(): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/test-db`)
    return handleResponse(response)
  } catch (error) {
    console.error("Error testing database connection:", error)
    return { status: "error", message: error instanceof Error ? error.message : "Unknown error" }
  }
}
