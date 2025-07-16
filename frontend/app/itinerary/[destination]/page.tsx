"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Utensils, Hotel, Star, Calendar, Bed, Users, Clock } from "lucide-react"
import { ItineraryDay } from "@/components/itinerary-day"
import {
  getItinerary,
  getItineraries,
  getAccommodations,
  getComments,
  addComment,
  saveItinerary,
  type Itinerary,
  type Comment,
  type Accommodation,
  type ChecklistItem,
} from "@/lib/data"
import { CommentSection } from "@/components/comment-section"
import { PreTripChecklist } from "@/components/pre-trip-checklist"
import { TipInformationBlock } from "@/components/tip-information-block"
import { useToast } from "@/hooks/use-toast"
import { useLoading } from "@/contexts/loading-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ItineraryPageProps {
  params: {
    destination: string
  }
}

export default function ItineraryPage({ params }: ItineraryPageProps) {
  const { toast } = useToast()
  const { setLoading, setLoadingMessage } = useLoading()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLocalLoading] = useState(true)
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [savingChecklist, setSavingChecklist] = useState(false)

  // Helper function to calculate trip duration
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const nights = diffDays > 0 ? diffDays - 1 : 0
    return { days: diffDays, nights }
  }

  // Helper function to get travel recommendation
  const getTravelRecommendation = (travellersCount: number) => {
    if (travellersCount === 1) return "Perfect for solo travelers"
    if (travellersCount === 2) return "Ideal for couples"
    if (travellersCount <= 4) return "Great for small groups"
    return "Perfect for group adventures"
  }

  // Helper function to find itinerary by slug-like destination
  const findItineraryBySlug = async (slug: string): Promise<Itinerary | null> => {
    try {
      // First try direct ID lookup
      const directItinerary = await getItinerary(slug)
      if (directItinerary) return directItinerary

      // Then try to find by slug-like matching
      const allItineraries = await getItineraries()

      // Convert slug back to possible destination names
      const possibleNames = [
        slug,
        slug
          .replace(/([A-Z])/g, " $1")
          .trim(), // camelCase to words
        slug.replace(/([a-z])([A-Z])/g, "$1 $2"), // camelCase to spaced
        slug.charAt(0).toUpperCase() + slug.slice(1), // capitalize first letter
        slug
          .replace(/itinerary$/i, "")
          .trim(), // remove "itinerary" suffix
        decodeURIComponent(slug), // decode URL encoding
      ]

      for (const itinerary of allItineraries) {
        // Check if destination matches any possible name
        for (const name of possibleNames) {
          if (
            itinerary.destination.toLowerCase().replace(/\s+/g, "") === name.toLowerCase().replace(/\s+/g, "") ||
            itinerary.destination.toLowerCase() === name.toLowerCase() ||
            itinerary.id === name
          ) {
            return itinerary
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error finding itinerary by slug:", error)
      return null
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setLoadingMessage("Loading itinerary details...")
        setLocalLoading(true)

        const itineraryData = await findItineraryBySlug(params.destination)

        if (itineraryData) {
          setItinerary(itineraryData)

          // Set checklist items from metadata if available
          if (itineraryData.metadata?.checklist && itineraryData.metadata.checklist.length > 0) {
            console.log("Found checklist in metadata:", itineraryData.metadata.checklist)
            setChecklistItems(itineraryData.metadata.checklist)
          } else {
            console.log("No checklist found in metadata, using empty array")
            setChecklistItems([])
          }

          // Fetch related data
          setLoadingMessage("Loading accommodations and comments...")
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
        toast({
          title: "Error",
          description: "Failed to load itinerary data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
        setLocalLoading(false)
      }
    }

    fetchData()
  }, [params.destination, toast, setLoading, setLoadingMessage])

  const handleAddComment = async (comment: Omit<Comment, "id" | "date">) => {
    if (!itinerary) return

    try {
      setLoading(true)
      setLoadingMessage("Adding comment...")

      const newComment = await addComment({
        ...comment,
        id: "",
        date: "",
        itineraryId: itinerary.id,
      })

      if (newComment) {
        setComments([newComment, ...comments])
        toast({
          title: "Success",
          description: "Comment added successfully!",
        })
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleChecklistItem = async (id: string) => {
    if (!itinerary) return

    try {
      setSavingChecklist(true)
      setLoadingMessage("Updating checklist...")

      // Update local state
      const updatedItems = checklistItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      )
      setChecklistItems(updatedItems)

      // Save to server
      const updatedItinerary: Itinerary = {
        ...itinerary,
        metadata: {
          ...itinerary.metadata,
          checklist: updatedItems,
        },
      }

      const savedItinerary = await saveItinerary(updatedItinerary)

      if (savedItinerary) {
        console.log("Checklist updated successfully")
        setItinerary(savedItinerary)
        toast({
          title: "Success",
          description: "Checklist updated successfully!",
        })
      } else {
        throw new Error("Failed to save checklist")
      }
    } catch (error) {
      console.error("Error updating checklist:", error)
      // Revert on error
      setChecklistItems(checklistItems)
      toast({
        title: "Error",
        description: "Failed to update checklist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingChecklist(false)
    }
  }

  if (loading || !itinerary) {
    return null // Loading handled by global loader
  }

  const formattedDestination = itinerary.destination
  const duration = calculateDuration(itinerary.startDate, itinerary.endDate)
  const travellersCount = itinerary.travellersCount || 1
  const totalBudget = itinerary.totalBudget || 0
  const perPersonCost = totalBudget / travellersCount
  const travelRecommendation = getTravelRecommendation(travellersCount)

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
              <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                    {new Date(itinerary.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {duration.days} Days / {duration.nights} Nights
                  </span>
                </div>
                {travellersCount > 1 && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{travellersCount} travellers</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 dark:bg-emerald-900/20">
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

        {/* Budget Information */}
        {totalBudget > 0 && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-emerald-600">Total Budget</h3>
                    <p className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-blue-600">Per Person</h3>
                    <p className="text-2xl font-bold">₹{Math.round(perPersonCost).toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-purple-600">Travel Style</h3>
                    <p className="text-sm font-medium">{travelRecommendation}</p>
                    <Badge variant="outline" className="mt-1">
                      {travellersCount === 1 ? "Solo Travel" : travellersCount === 2 ? "Couple" : "Group"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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

        {checklistItems.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Pre-Trip Checklist</h2>
            <PreTripChecklist
              destination={itinerary.destination}
              items={checklistItems}
              onToggleItem={handleToggleChecklistItem}
              readOnly={false}
              isAdmin={false}
            />
          </section>
        )}

        {/* Tip Information Block */}
        {itinerary.metadata?.tips && itinerary.metadata.tips.length > 0 && (
          <section className="mb-8">
            <TipInformationBlock tips={itinerary.metadata.tips} />
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Daily Itinerary</h2>

          {itinerary.days.length > 0 ? (
            itinerary.days
              .sort((a, b) => a.day - b.day)
              .map((day) => (
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
