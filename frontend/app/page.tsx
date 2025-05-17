"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { TravelCard } from "@/components/travel-card"
import { getItineraries } from "@/lib/data"
import { SafeImage } from "@/components/safe-image"
import type { Itinerary } from "@/lib/models"

export default function HomePage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getItineraries()
        setItineraries(data)
      } catch (error) {
        console.error("Error fetching itineraries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-1 px-4 py-8">
        <section className="mb-12">
          <div className="relative mb-12 rounded-xl overflow-hidden">
            {/* Background image container - 1200x400px recommended */}
            <div className="h-[400px] w-full">
              <SafeImage
                src="/images/travel-adventures-bg.jpg"
                alt="Travel adventures background"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
              <h2 className="mb-3 text-4xl font-bold text-center">Our Travel Adventures</h2>
              <p className="mx-auto max-w-2xl text-center text-white/90">
                We're a group of budget travelers exploring the world together. Follow our journeys and discover how we
                experience amazing destinations without breaking the bank!
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <p>Loading itineraries...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {itineraries.map((itinerary) => (
                <TravelCard
                  key={itinerary.id}
                  id={itinerary.id}
                  destination={itinerary.destination}
                  image={itinerary.image}
                  description={itinerary.description}
                  startDate={itinerary.startDate}
                  endDate={itinerary.endDate}
                  locations={itinerary.locations}
                  status={itinerary.status}
                  season={itinerary.season}
                  days={Math.ceil(
                    (new Date(itinerary.endDate).getTime() - new Date(itinerary.startDate).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}
                  rating={itinerary.rating}
                  reviewCount={itinerary.reviewCount}
                  metadata={itinerary.metadata}
                />
              ))}

              {itineraries.length === 0 && (
                <div className="col-span-full rounded-lg border p-8 text-center">
                  <p className="text-muted-foreground">No travel plans have been added yet.</p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="mb-12">
          <div className="rounded-xl bg-emerald-50 p-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold">Budget Travel Made Easy</h2>
                <p className="mb-6 text-muted-foreground">
                  We know the struggle of traveling on a budget. That's why we share our detailed itineraries,
                  affordable accommodations, and money-saving tips to help fellow budget travelers explore the world.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Affordable Accommodations</h3>
                      <p className="text-sm text-muted-foreground">
                        We find and share the best budget-friendly places to stay.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Local Food Recommendations</h3>
                      <p className="text-sm text-muted-foreground">
                        Discover delicious and inexpensive local eateries.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Hidden Gems</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore off-the-beaten-path locations that tourists often miss.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-full overflow-hidden rounded-lg sm:h-80">
                  <SafeImage
                    src="/images/budget_travel_planning.JPG"
                    alt="Budget travel planning"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
