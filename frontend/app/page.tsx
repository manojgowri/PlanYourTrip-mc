"use client"

import { useState, useEffect } from "react"
import { getItineraries } from "@/lib/data"
import { TravelCard } from "@/components/travel-card"
import { Compass } from "lucide-react"
import type { Itinerary } from "@/lib/models"

export default function Home() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true)
        const data = await getItineraries()
        setItineraries(data)
      } catch (err) {
        console.error("Error fetching itineraries:", err)
        setError("Failed to load itineraries. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchItineraries()
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 dark:from-emerald-950 dark:to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-emerald-600 dark:text-emerald-400">Plan Your Trip</span>{" "}
            <span className="text-amber-500">Amigos</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-900 dark:text-white">Budget Travel Made Easy</span> - Create detailed
            itineraries, track expenses, and share your adventures with friends and family.
          </p>
        </div>
      </section>

      {/* Itineraries Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Travel Adventures</h2>
          </div>

          {loading ? (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300">Loading itineraries...</p>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          ) : itineraries.length === 0 ? (
            <div className="rounded-md bg-amber-50 p-8 text-center dark:bg-amber-900/20">
              <Compass className="mx-auto mb-4 h-12 w-12 text-amber-500" />
              <h3 className="mb-2 text-xl font-semibold text-amber-800 dark:text-amber-300">No adventures yet</h3>
              <p className="text-amber-700 dark:text-amber-400">
                Your travel adventures will appear here once you create them.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {itineraries.map((itinerary) => (
                <TravelCard
                  key={itinerary.id}
                  id={itinerary.id}
                  destination={itinerary.destination}
                  image={itinerary.image}
                  description={itinerary.description}
                  startDate={itinerary.startDate}
                  endDate={itinerary.endDate}
                  status={itinerary.status}
                  season={itinerary.season}
                  locations={itinerary.locations}
                  days={itinerary.days.length}
                  metadata={itinerary.metadata}
                  itinerary={itinerary}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
