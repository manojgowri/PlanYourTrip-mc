"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Utensils, Hotel, Star, Calendar, Bed, Check, X } from "lucide-react"
import { ItineraryDay } from "@/components/itinerary-day"
import {
  getItinerary,
  getAccommodations,
  getComments,
  addComment,
  type Itinerary,
  type Comment,
  type Accommodation,
  type ChecklistItem,
} from "@/lib/data"
import { CommentSection } from "@/components/comment-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const itineraryData = await getItinerary(params.destination)

        if (itineraryData) {
          setItinerary(itineraryData)

          // Set checklist items from metadata if available
          if (itineraryData.metadata?.checklist) {
            setChecklistItems(itineraryData.metadata.checklist)
          } else {
            // Default checklist items
            setChecklistItems([
              {
                id: "visa",
                title: "Check Visa Requirements",
                description: "Research and apply for necessary visas.",
                completed: false,
                notes: "",
              },
              {
                id: "flights",
                title: "Book Flights",
                description: "Compare prices and book flights.",
                completed: false,
                notes: "",
              },
              {
                id: "accommodation",
                title: "Reserve Accommodations",
                description: "Book hotels or hostels for your stay.",
                completed: false,
                notes: "",
              },
              {
                id: "insurance",
                title: "Get Travel Insurance",
                description: "Purchase travel insurance for your trip.",
                completed: false,
                notes: "",
              },
              {
                id: "currency",
                title: "Exchange Currency",
                description: "Get local currency for your trip.",
                completed: false,
                notes: "",
              },
            ])
          }

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

        {itinerary.status === "online" && checklistItems.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Pre-Trip Checklist</h2>
            <Card>
              <CardHeader>
                <CardTitle>Planning Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {checklistItems.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-start gap-3 p-2 rounded-md ${
                        item.completed ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-gray-50 dark:bg-gray-800/20"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${
                          item.completed
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"
                            : "bg-gray-200 text-gray-500 dark:bg-gray-700"
                        }`}
                      >
                        {item.completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className={`font-medium ${item.completed ? "text-emerald-700 dark:text-emerald-400" : ""}`}>
                          {item.title}
                        </h4>
                        {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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
