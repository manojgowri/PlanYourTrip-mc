"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Compass, MapPin } from "lucide-react"
import { TravelCard } from "@/components/travel-card"
import { Footer } from "@/components/footer"
import { getItineraries, type Itinerary } from "@/lib/data"
import { ThemeToggle } from "@/components/theme-toggle"

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
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold">
              Plan Your Trip <span className="text-emerald-600 font-bold">Amigos</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/companions" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Travel Companions
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <section className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold">Our Travel Adventures</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We're a group of budget travelers exploring the world together. Follow our journeys and discover how we
              experience amazing destinations without breaking the bank!
            </p>
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
                  destination={itinerary.destination}
                  image={itinerary.image}
                  description={itinerary.description}
                  startDate={new Date(itinerary.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  endDate={new Date(itinerary.endDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  locations={itinerary.locations}
                  status={itinerary.status}
                  season={itinerary.season}
                  days={Math.ceil(
                    (new Date(itinerary.endDate).getTime() - new Date(itinerary.startDate).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}
                  rating={itinerary.rating}
                  reviewCount={itinerary.reviewCount || 0}
                  id={itinerary.id}
                />
              ))}

              {itineraries.length === 0 && (
                <div className="col-span-full rounded-lg border p-8 text-center">
                  <p className="text-muted-foreground">No travel plans have been added yet.</p>
                  <Link href="/admin" className="mt-4 inline-block text-emerald-600 hover:underline">
                    Add your first trip
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="mb-12">
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold">Budget Travel Made Easy</h2>
                <p className="mb-6 text-muted-foreground">
                  We know the struggle of traveling on a budget. That's why we share our detailed itineraries,
                  affordable accommodations, and money-saving tips to help fellow budget travelers explore the world.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-2">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Affordable Accommodations</h3>
                      <p className="text-sm text-muted-foreground">
                        We find and share the best budget-friendly places to stay.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-2">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Local Food Recommendations</h3>
                      <p className="text-sm text-muted-foreground">
                        Discover delicious and inexpensive local eateries.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-2">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
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
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Budget travel planning"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
