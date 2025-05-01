// This is a mock data service that would be replaced with a real database in production

interface Activity {
  time: string
  title: string
  description: string
  type: "food" | "activity" | "travel" | "accommodation"
}

interface ItineraryDay {
  day: number
  date: string
  location: string
  activities: Activity[]
}

interface Itinerary {
  destination: string
  days: ItineraryDay[]
  status: "online" | "completed"
  season: string
  rating: number
  reviewCount: number
}

// Mock data
const itineraries: Record<string, Itinerary> = {
  vietnam: {
    destination: "Vietnam",
    status: "online",
    season: "Spring",
    rating: 4.7,
    reviewCount: 24,
    days: [
      {
        day: 1,
        date: "May 15, 2023",
        location: "Hanoi",
        activities: [
          {
            time: "09:00 AM",
            title: "Arrival at Noi Bai International Airport",
            description: "Check-in at Hanoi La Siesta Hotel & Spa",
            type: "travel",
          },
          {
            time: "12:00 PM",
            title: "Lunch at Bún Chả Hương Liên",
            description: "Famous spot where Anthony Bourdain dined with Barack Obama",
            type: "food",
          },
          {
            time: "02:00 PM",
            title: "Old Quarter Walking Tour",
            description: "Explore the historic streets and shops of Hanoi's Old Quarter",
            type: "activity",
          },
          {
            time: "06:00 PM",
            title: "Dinner at Cha Ca La Vong",
            description: "Try the famous fish dish that the restaurant is named after",
            type: "food",
          },
        ],
      },
      {
        day: 2,
        date: "May 16, 2023",
        location: "Hanoi",
        activities: [
          {
            time: "08:00 AM",
            title: "Breakfast at Hotel",
            description: "Continental breakfast included with stay",
            type: "food",
          },
          {
            time: "09:30 AM",
            title: "Ho Chi Minh Mausoleum",
            description: "Visit the memorial dedicated to the Vietnamese leader",
            type: "activity",
          },
          {
            time: "12:30 PM",
            title: "Lunch at Quan An Ngon",
            description: "Sample a variety of Vietnamese street food in a restaurant setting",
            type: "food",
          },
          {
            time: "03:00 PM",
            title: "Temple of Literature",
            description: "Explore Vietnam's first national university",
            type: "activity",
          },
          {
            time: "07:00 PM",
            title: "Water Puppet Show",
            description: "Evening performance at Thang Long Water Puppet Theatre",
            type: "activity",
          },
        ],
      },
      // More days would be added here
    ],
  },
  thailand: {
    destination: "Thailand",
    status: "completed",
    season: "Winter",
    rating: 4.9,
    reviewCount: 32,
    days: [
      // Thailand itinerary data would go here
    ],
  },
  japan: {
    destination: "Japan",
    status: "completed",
    season: "Spring",
    rating: 4.8,
    reviewCount: 18,
    days: [
      // Japan itinerary data would go here
    ],
  },
}

export function getItinerary(destination: string): Itinerary | null {
  return itineraries[destination.toLowerCase()] || null
}

// In a real app, you would have functions to update the itinerary
export function updateItinerary(destination: string, data: Itinerary): void {
  itineraries[destination.toLowerCase()] = data
}

// For offline mode, you would implement functions to save to localStorage
export function saveToLocalStorage(destination: string, data: Itinerary): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(`itinerary_${destination.toLowerCase()}`, JSON.stringify(data))
  }
}

export function getFromLocalStorage(destination: string): Itinerary | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(`itinerary_${destination.toLowerCase()}`)
    return data ? JSON.parse(data) : null
  }
  return null
}

// Sync function for when coming back online
export function syncOfflineChanges(destination: string): void {
  const localData = getFromLocalStorage(destination)
  if (localData) {
    updateItinerary(destination, localData)
    // After successful sync, you might want to clear the local storage
    localStorage.removeItem(`itinerary_${destination.toLowerCase()}`)
  }
}
