"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Utensils, Hotel, Star, Calendar, Bed } from "lucide-react"
import { ItineraryDay } from "@/components/itinerary-day"
import {
  getItinerary,
  getAccommodations,
  getComments,
  addComment,
  type Itinerary,
  type Comment,
  type Accommodation,
} from "@/lib/data"
import { CommentSection } from "@/components/comment-section"
import { PreTripChecklist } from "@/components/pre-trip-checklist"

interface ItineraryPageProps {
  params: {
    destination: string
  }
}

export default function ItineraryPage({ params }: ItineraryPageProps) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [checklistItems, setChecklistItems] = useState([
    {
      id: "visa",
      title: "Check Visa Requirements",
      description: "Research and apply for necessary visas for Vietnam.",
      completed: false,
    },
    {
      id: "flights",
      title: "Book Flights",
      description: "Compare prices and book flights to Vietnam.",
      completed: false,
    },
    {
      id: "accommodation",
      title: "Reserve Accommodations",
      description: "Book hotels or hostels for your stay.",
      completed: false,
    },
    {
      id: "insurance",
      title: "Get Travel Insurance",
      description: "Purchase travel insurance for your trip.",
      completed: false,
    },
    {
      id: "currency",
      title: "Exchange Currency",
      description: "Get Vietnamese Dong (VND) for your trip.",
      completed: false,
    },
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const itineraryData = await getItinerary(params.destination)

        if (itineraryData) {
          setItinerary(itineraryData)

          // Fetch related data
          const [accommodationsData, commentsData] = await Promise.all([
            getAccommodations(itineraryData.id),
            getComments(itineraryData.id),
          ])

          console.log("Fetched accommodations:", accommodationsData)
          setAccommodations(accommodationsData)
          setComments(commentsData)
        }
      } catch (error) {
        console.error("Error fetching itinerary data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.destination])

  const handleAddComment = async (comment: Omit<Comment, "id" | "date">) => {
    if (!itinerary) return

    try {
      const newComment = await addComment({
        ...comment,
        id: "",
        date: "",
        itineraryId: itinerary.id,
      })

      if (newComment) {
        setComments([newComment, ...comments])
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const toggleChecklistItem = (id: string) => {
    setChecklistItems((items) => items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

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

        {accommodations.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Accommodations</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accommodations.map((accommodation) => (
                <div key={accommodation.id} className="rounded-lg border p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Bed className="h-5 w-5 text-emerald-600" />
                    <div>
                      <h3 className="font-medium">{accommodation.name}</h3>
                      <p className="text-sm text-muted-foreground">{accommodation.location}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-muted-foreground">{accommodation.dates}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {itinerary.status === "online" && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Pre-Trip Planning</h2>
            <PreTripChecklist
              destination={itinerary.destination}
              items={checklistItems}
              onToggleItem={toggleChecklistItem}
            />
          </section>
        )}

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

        <CommentSection comments={comments} onAddComment={handleAddComment} itineraryId={itinerary.id} />
      </div>
    </div>
  )
}
