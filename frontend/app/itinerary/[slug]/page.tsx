"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Calendar, MapPin, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ItineraryDay } from "@/components/itinerary-day"
import { CommentSection } from "@/components/comment-section"
import { PreTripChecklist } from "@/components/pre-trip-checklist"
import { TipInformationBlock } from "@/components/tip-information-block"
import { ExpenseSummary } from "@/components/expense-summary"
import { CurrencySelector } from "@/components/currency-selector"
import { SafeImage } from "@/components/safe-image"
import { getItineraryBySlug, saveItinerary, calculateTotalExpenses } from "@/lib/data"
import { useLoading } from "@/contexts/loading-context"
import type { Itinerary } from "@/lib/models"
import { getPlaceholderImage } from "@/lib/image-utils"

export default function ItineraryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { setLoading, setLoadingMessage } = useLoading()

  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLocalLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState("INR")

  useEffect(() => {
    const loadItinerary = async () => {
      try {
        setLoading(true)
        setLoadingMessage("Loading itinerary details...")
        setLocalLoading(true)
        setError(null)

        const data = await getItineraryBySlug(slug)
        if (data) {
          setItinerary(data)
        } else {
          setError("Itinerary not found")
        }
      } catch (err) {
        console.error("Error fetching itinerary:", err)
        setError("Failed to load itinerary. Please try again later.")
      } finally {
        setLoading(false)
        setLocalLoading(false)
      }
    }

    if (slug) {
      loadItinerary()
    }
  }, [slug, setLoading, setLoadingMessage])

  const handleChecklistToggle = async (itemId: string) => {
    if (!itinerary) return

    const updatedChecklist = (itinerary.metadata?.checklist || []).map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    )

    const updatedItinerary = {
      ...itinerary,
      metadata: {
        ...itinerary.metadata,
        checklist: updatedChecklist,
      },
    }

    setItinerary(updatedItinerary)
    await saveItinerary(updatedItinerary)
  }

  if (loading || !itinerary) {
    return null // Loading handled by global loader
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const { amount: totalExpenses, breakdown } = calculateTotalExpenses(itinerary)
  const actualTravellersCount = itinerary.travellersCount || 1
  const perPersonCost = totalExpenses / actualTravellersCount

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const nights = diffDays > 0 ? diffDays - 1 : 0
    return { days: diffDays, nights }
  }

  const duration = calculateDuration(itinerary.startDate, itinerary.endDate)

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="aspect-video md:aspect-[21/9]">
          <SafeImage
            src={itinerary.image || getPlaceholderImage(1200, 400)}
            alt={itinerary.destination}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {itinerary.status === "completed" ? "Completed" : "Upcoming"}
              </Badge>
              {itinerary.season && (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {itinerary.season}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{itinerary.destination}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {duration.days} Days / {duration.nights} Nights
                </span>
              </div>
              {itinerary.locations.length > 0 && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{itinerary.locations.join(", ")}</span>
                </div>
              )}
              {actualTravellersCount > 1 && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{actualTravellersCount} travellers</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {itinerary.description && (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{itinerary.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Expense Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseSummary
            totalAmount={totalExpenses}
            currency={selectedCurrency}
            breakdown={breakdown}
            travellersCount={actualTravellersCount}
            perPersonCost={perPersonCost}
          />
        </div>
        <div>
          <CurrencySelector selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} />
        </div>
      </div>

      {/* Pre-Trip Checklist */}
      {itinerary.metadata?.checklist && itinerary.metadata.checklist.length > 0 && (
        <PreTripChecklist
          destination={itinerary.destination}
          items={itinerary.metadata.checklist}
          onToggleItem={handleChecklistToggle}
          readOnly={false}
          isAdmin={false}
        />
      )}

      {/* Tip Information Block */}
      {itinerary.metadata?.tips && itinerary.metadata.tips.length > 0 && (
        <TipInformationBlock tips={itinerary.metadata.tips} />
      )}

      {/* Daily Itinerary */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Daily Itinerary</h2>
        {itinerary.days.length > 0 ? (
          <div className="space-y-4">
            {itinerary.days
              .sort((a, b) => a.day - b.day)
              .map((day) => (
                <ItineraryDay
                  key={day.id}
                  day={day.day}
                  date={day.date}
                  location={day.location}
                  activities={day.activities}
                />
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No daily activities have been planned yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comments Section */}
      <CommentSection itineraryId={itinerary.id} />
    </div>
  )
}
