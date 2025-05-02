"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Utensils, Hotel, Star } from "lucide-react"
import { ItineraryDay } from "@/components/itinerary-day"
import { getItinerary, getAccommodations, type Itinerary } from "@/lib/data"
import { Footer } from "@/components/footer"
import { CommentSection } from "@/components/comment-section"

interface ItineraryPageProps {
  params: {
    destination: string
  }
}

export default function ItineraryPage({ params }: ItineraryPageProps) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = () => {
      const data = getItinerary(params.destination)
      setItinerary(data || null)
      setLoading(false)
    }

    fetchData()
  }, [params.destination])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading itinerary...</p>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Itinerary Not Found</h1>
          <p className="mb-6">The itinerary you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="text-emerald-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const formattedDestination = itinerary.destination

  // Get accommodations for this itinerary
  const accommodations = getAccommodations(itinerary.id)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-1 px-4 py-8">
        <Link href="/" className="mb-6 flex items-center gap-2 text-emerald-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Travel Plans
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{formattedDestination} Itinerary</h1>
              <p className="mt-2 text-muted-foreground">
                {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                {new Date(itinerary.endDate).toLocaleDateString()} • Detailed travel plan
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(itinerary.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : star <= itinerary.rating
                          ? "fill-yellow-400/50 text-yellow-400"
                          : "fill-yellow-400/10 text-yellow-400/30"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{itinerary.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({itinerary.reviewCount} reviews)</span>
            </div>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border p-4 shadow-sm">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="font-medium">Locations</h3>
              <p className="text-sm text-muted-foreground">{itinerary.locations.join(", ")}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-4 shadow-sm">
            <Hotel className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="font-medium">Accommodations</h3>
              <p className="text-sm text-muted-foreground">
                {accommodations.length} {accommodations.length === 1 ? "Place" : "Places"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-4 shadow-sm">
            <Utensils className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="font-medium">Restaurants</h3>
              <p className="text-sm text-muted-foreground">
                {itinerary.days.reduce((count, day) => {
                  return count + day.activities.filter((a) => a.type === "food").length
                }, 0)}{" "}
                Recommended Places
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Daily Itinerary</h2>

          {itinerary.days.length > 0 ? (
            itinerary.days.map((day) => (
              <ItineraryDay
                key={day.id}
                day={day.day}
                date={day.date}
                location={day.location}
                activities={day.activities}
              />
            ))
          ) : (
            <div className="rounded-lg border p-8 text-center">
              <p className="text-muted-foreground">No daily itinerary has been added yet.</p>
            </div>
          )}
        </section>

        <CommentSection />
      </div>
      <Footer />
    </div>
  )
}
