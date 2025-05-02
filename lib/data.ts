// This is a client-side data service using localStorage for persistence

export interface Activity {
  id: string
  time: string
  title: string
  description: string
  type: "food" | "activity" | "travel" | "accommodation"
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

export interface Location {
  id: string
  name: string
  dates: string
  destinationId: string
}

// Initial data
const initialItineraries: Itinerary[] = [
  {
    id: "vietnam-2023",
    destination: "Vietnam",
    image: "/placeholder.svg?height=300&width=400",
    description: "Exploring the beauty of Vietnam - from bustling cities to serene landscapes.",
    startDate: "2023-05-15",
    endDate: "2023-05-30",
    status: "online",
    season: "Spring",
    rating: 4.7,
    reviewCount: 24,
    locations: ["Hanoi", "Ha Long Bay", "Hoi An", "Ho Chi Minh City"],
    days: [
      {
        id: "vietnam-day-1",
        day: 1,
        date: "May 15, 2023",
        location: "Hanoi",
        activities: [
          {
            id: "vietnam-act-1",
            time: "09:00 AM",
            title: "Arrival at Noi Bai International Airport",
            description: "Check-in at Hanoi La Siesta Hotel & Spa",
            type: "travel",
          },
          {
            id: "vietnam-act-2",
            time: "12:00 PM",
            title: "Lunch at Bún Chả Hương Liên",
            description: "Famous spot where Anthony Bourdain dined with Barack Obama",
            type: "food",
          },
          {
            id: "vietnam-act-3",
            time: "02:00 PM",
            title: "Old Quarter Walking Tour",
            description: "Explore the historic streets and shops of Hanoi's Old Quarter",
            type: "activity",
          },
          {
            id: "vietnam-act-4",
            time: "06:00 PM",
            title: "Dinner at Cha Ca La Vong",
            description: "Try the famous fish dish that the restaurant is named after",
            type: "food",
          },
        ],
      },
      {
        id: "vietnam-day-2",
        day: 2,
        date: "May 16, 2023",
        location: "Hanoi",
        activities: [
          {
            id: "vietnam-act-5",
            time: "08:00 AM",
            title: "Breakfast at Hotel",
            description: "Continental breakfast included with stay",
            type: "food",
          },
          {
            id: "vietnam-act-6",
            time: "09:30 AM",
            title: "Ho Chi Minh Mausoleum",
            description: "Visit the memorial dedicated to the Vietnamese leader",
            type: "activity",
          },
          {
            id: "vietnam-act-7",
            time: "12:30 PM",
            title: "Lunch at Quan An Ngon",
            description: "Sample a variety of Vietnamese street food in a restaurant setting",
            type: "food",
          },
          {
            id: "vietnam-act-8",
            time: "03:00 PM",
            title: "Temple of Literature",
            description: "Explore Vietnam's first national university",
            type: "activity",
          },
          {
            id: "vietnam-act-9",
            time: "07:00 PM",
            title: "Water Puppet Show",
            description: "Evening performance at Thang Long Water Puppet Theatre",
            type: "activity",
          },
        ],
      },
    ],
  },
  {
    id: "thailand-2022",
    destination: "Thailand",
    image: "/placeholder.svg?height=300&width=400",
    description: "Discovering the rich culture and stunning beaches of Thailand.",
    startDate: "2022-12-10",
    endDate: "2022-12-25",
    status: "completed",
    season: "Winter",
    rating: 4.9,
    reviewCount: 32,
    locations: ["Bangkok", "Chiang Mai", "Phuket"],
    days: [],
  },
  {
    id: "japan-2022",
    destination: "Japan",
    image: "/placeholder.svg?height=300&width=400",
    description: "Experiencing the perfect blend of tradition and modernity in Japan.",
    startDate: "2022-03-05",
    endDate: "2022-03-20",
    status: "completed",
    season: "Spring",
    rating: 4.8,
    reviewCount: 18,
    locations: ["Tokyo", "Kyoto", "Osaka", "Hiroshima"],
    days: [],
  },
]

const initialAccommodations: Accommodation[] = [
  {
    id: "acc-1",
    name: "Hanoi La Siesta Hotel & Spa",
    location: "Hanoi",
    dates: "May 15-17",
    destinationId: "vietnam-2023",
  },
  {
    id: "acc-2",
    name: "Paradise Suites Hotel",
    location: "Ha Long Bay",
    dates: "May 18-19",
    destinationId: "vietnam-2023",
  },
  {
    id: "acc-3",
    name: "Allegro Hoi An",
    location: "Hoi An",
    dates: "May 20-24",
    destinationId: "vietnam-2023",
  },
  {
    id: "acc-4",
    name: "Hotel des Arts Saigon",
    location: "Ho Chi Minh City",
    dates: "May 25-30",
    destinationId: "vietnam-2023",
  },
]

const initialLocations: Location[] = [
  {
    id: "loc-1",
    name: "Hanoi",
    dates: "May 15-17",
    destinationId: "vietnam-2023",
  },
  {
    id: "loc-2",
    name: "Ha Long Bay",
    dates: "May 18-19",
    destinationId: "vietnam-2023",
  },
  {
    id: "loc-3",
    name: "Hoi An",
    dates: "May 20-24",
    destinationId: "vietnam-2023",
  },
  {
    id: "loc-4",
    name: "Ho Chi Minh City",
    dates: "May 25-30",
    destinationId: "vietnam-2023",
  },
]

const initialCompanions: Companion[] = [
  {
    id: "comp-1",
    name: "Sarah Johnson",
    relationship: "Best Friend",
    bio: "Sarah has been my travel buddy for over 5 years. We've explored 12 countries together and she's always up for an adventure!",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "comp-2",
    name: "Michael Chen",
    relationship: "College Friend",
    bio: "Michael is a photography enthusiast who captures the most amazing travel moments. He's particularly fond of street food adventures.",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "comp-3",
    name: "Emma Rodriguez",
    relationship: "Sister",
    bio: "My sister Emma joins me on family trips. She's the best at finding hidden local gems and speaking with locals.",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "comp-4",
    name: "David Kim",
    relationship: "Hiking Partner",
    bio: "David is my go-to companion for outdoor adventures. He's climbed mountains on three continents and never gets tired.",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "comp-5",
    name: "Priya Patel",
    relationship: "Foodie Friend",
    bio: "Priya and I bond over trying new cuisines. She's a culinary expert who knows the best restaurants in every city we visit.",
    image: "/placeholder.svg?height=400&width=300",
  },
]

// Helper function to generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Initialize data in localStorage if it doesn't exist
function initializeData() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("itineraries")) {
    localStorage.setItem("itineraries", JSON.stringify(initialItineraries))
  }

  if (!localStorage.getItem("accommodations")) {
    localStorage.setItem("accommodations", JSON.stringify(initialAccommodations))
  }

  if (!localStorage.getItem("locations")) {
    localStorage.setItem("locations", JSON.stringify(initialLocations))
  }

  if (!localStorage.getItem("companions")) {
    localStorage.setItem("companions", JSON.stringify(initialCompanions))
  }
}

// Data access functions
export function getItineraries(): Itinerary[] {
  if (typeof window === "undefined") return initialItineraries

  initializeData()
  const data = localStorage.getItem("itineraries")
  return data ? JSON.parse(data) : []
}

export function getItinerary(id: string): Itinerary | undefined {
  const itineraries = getItineraries()
  return itineraries.find((item) => item.id === id || item.destination.toLowerCase() === id.toLowerCase())
}

export function saveItinerary(itinerary: Itinerary): void {
  if (typeof window === "undefined") return

  const itineraries = getItineraries()
  const index = itineraries.findIndex((item) => item.id === itinerary.id)

  if (index >= 0) {
    itineraries[index] = itinerary
  } else {
    itineraries.push(itinerary)
  }

  localStorage.setItem("itineraries", JSON.stringify(itineraries))
}

export function deleteItinerary(id: string): void {
  if (typeof window === "undefined") return

  const itineraries = getItineraries()
  const filtered = itineraries.filter((item) => item.id !== id)
  localStorage.setItem("itineraries", JSON.stringify(filtered))

  // Also delete related data
  const accommodations = getAccommodations()
  const filteredAccommodations = accommodations.filter((item) => item.destinationId !== id)
  localStorage.setItem("accommodations", JSON.stringify(filteredAccommodations))

  const locations = getLocations()
  const filteredLocations = locations.filter((item) => item.destinationId !== id)
  localStorage.setItem("locations", JSON.stringify(filteredLocations))
}

export function getAccommodations(destinationId?: string): Accommodation[] {
  if (typeof window === "undefined") return initialAccommodations

  initializeData()
  const data = localStorage.getItem("accommodations")
  const accommodations = data ? JSON.parse(data) : []

  if (destinationId) {
    return accommodations.filter((acc: Accommodation) => acc.destinationId === destinationId)
  }

  return accommodations
}

export function saveAccommodation(accommodation: Accommodation): void {
  if (typeof window === "undefined") return

  const accommodations = getAccommodations()
  const index = accommodations.findIndex((item) => item.id === accommodation.id)

  if (index >= 0) {
    accommodations[index] = accommodation
  } else {
    accommodations.push(accommodation)
  }

  localStorage.setItem("accommodations", JSON.stringify(accommodations))
}

export function deleteAccommodation(id: string): void {
  if (typeof window === "undefined") return

  const accommodations = getAccommodations()
  const filtered = accommodations.filter((item) => item.id !== id)
  localStorage.setItem("accommodations", JSON.stringify(filtered))
}

export function getLocations(destinationId?: string): Location[] {
  if (typeof window === "undefined") return initialLocations

  initializeData()
  const data = localStorage.getItem("locations")
  const locations = data ? JSON.parse(data) : []

  if (destinationId) {
    return locations.filter((loc: Location) => loc.destinationId === destinationId)
  }

  return locations
}

export function saveLocation(location: Location): void {
  if (typeof window === "undefined") return

  const locations = getLocations()
  const index = locations.findIndex((item) => item.id === location.id)

  if (index >= 0) {
    locations[index] = location
  } else {
    locations.push(location)
  }

  localStorage.setItem("locations", JSON.stringify(locations))
}

export function deleteLocation(id: string): void {
  if (typeof window === "undefined") return

  const locations = getLocations()
  const filtered = locations.filter((item) => item.id !== id)
  localStorage.setItem("locations", JSON.stringify(filtered))
}

export function getCompanions(): Companion[] {
  if (typeof window === "undefined") return initialCompanions

  initializeData()
  const data = localStorage.getItem("companions")
  return data ? JSON.parse(data) : []
}

export function saveCompanion(companion: Companion): void {
  if (typeof window === "undefined") return

  const companions = getCompanions()
  const index = companions.findIndex((item) => item.id === companion.id)

  if (index >= 0) {
    companions[index] = companion
  } else {
    companions.push(companion)
  }

  localStorage.setItem("companions", JSON.stringify(companions))
}

export function deleteCompanion(id: string): void {
  if (typeof window === "undefined") return

  const companions = getCompanions()
  const filtered = companions.filter((item) => item.id !== id)
  localStorage.setItem("companions", JSON.stringify(filtered))
}

export function addActivityToDay(dayId: string, activity: Activity): void {
  if (typeof window === "undefined") return

  const itineraries = getItineraries()
  const updatedItineraries = itineraries.map((itinerary) => {
    const dayIndex = itinerary.days.findIndex((day) => day.id === dayId)
    if (dayIndex >= 0) {
      itinerary.days[dayIndex].activities.push(activity)
    }
    return itinerary
  })

  localStorage.setItem("itineraries", JSON.stringify(updatedItineraries))
}

export function updateActivity(dayId: string, activity: Activity): void {
  if (typeof window === "undefined") return

  const itineraries = getItineraries()
  const updatedItineraries = itineraries.map((itinerary) => {
    const dayIndex = itinerary.days.findIndex((day) => day.id === dayId)
    if (dayIndex >= 0) {
      const activityIndex = itinerary.days[dayIndex].activities.findIndex((act) => act.id === activity.id)
      if (activityIndex >= 0) {
        itinerary.days[dayIndex].activities[activityIndex] = activity
      }
    }
    return itinerary
  })

  localStorage.setItem("itineraries", JSON.stringify(updatedItineraries))
}

export function deleteActivity(dayId: string, activityId: string): void {
  if (typeof window === "undefined") return

  const itineraries = getItineraries()
  const updatedItineraries = itineraries.map((itinerary) => {
    const dayIndex = itinerary.days.findIndex((day) => day.id === dayId)
    if (dayIndex >= 0) {
      itinerary.days[dayIndex].activities = itinerary.days[dayIndex].activities.filter((act) => act.id !== activityId)
    }
    return itinerary
  })

  localStorage.setItem("itineraries", JSON.stringify(updatedItineraries))
}

export function addDayToItinerary(itineraryId: string, day: ItineraryDay): void {
  if (typeof window === "undefined") return

  const itineraries = getItineraries()
  const updatedItineraries = itineraries.map((itinerary) => {
    if (itinerary.id === itineraryId) {
      itinerary.days.push(day)
    }
    return itinerary
  })

  localStorage.setItem("itineraries", JSON.stringify(updatedItineraries))
}

export function updateDay(day: ItineraryDay): void {
  if (typeof window === "undefined") return

  const itineraries = getItineraries()
  const updatedItineraries = itineraries.map((itinerary) => {
    const dayIndex = itinerary.days.findIndex((d) => d.id === day.id)
    if (dayIndex >= 0) {
      itinerary.days[dayIndex] = day
    }
    return itinerary
  })

  localStorage.setItem("itineraries", JSON.stringify(updatedItineraries))
}

export function deleteDay(dayId: string): void {
  if (typeof window === "undefined") return

  const itineraries = getItineraries()
  const updatedItineraries = itineraries.map((itinerary) => {
    itinerary.days = itinerary.days.filter((day) => day.id !== dayId)
    return itinerary
  })

  localStorage.setItem("itineraries", JSON.stringify(updatedItineraries))
}

export function markItineraryAsComplete(id: string): void {
  if (typeof window === "undefined") return

  const itineraries = getItineraries()
  const updatedItineraries = itineraries.map((itinerary) => {
    if (itinerary.id === id) {
      itinerary.status = "completed"
    }
    return itinerary
  })

  localStorage.setItem("itineraries", JSON.stringify(updatedItineraries))
}
