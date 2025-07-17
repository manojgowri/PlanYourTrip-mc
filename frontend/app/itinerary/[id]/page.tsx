import { getItinerary } from "@/lib/data"
import { ItineraryDay } from "@/components/itinerary-day"
import { TipInformationBlock } from "@/components/tip-information-block"
import { PreTripChecklist } from "@/components/pre-trip-checklist"
import { Card, CardContent } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { CalendarDays, Users, Star, MapPin, Utensils, Hotel, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { calculateDuration, getTravelRecommendation } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CommentSection } from "@/components/comment-section"

interface ItineraryPageProps {
  params: {
    id: string
  }
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const itinerary = await getItinerary(params.id)

  if (!itinerary) {
    notFound()
  }

  const sortedDays = itinerary.days?.sort((a, b) => a.dayNumber - b.dayNumber) || []
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
              <h1 className="text-3xl font-bold">{itinerary.destination} Itinerary</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                    {new Date(itinerary.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{duration}</span>
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
                      star <= Math.floor(itinerary.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : star <= (itinerary.rating || 0)
                          ? "fill-yellow-400/50 text-yellow-400"
                          : "fill-yellow-400/10 text-yellow-400/30"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{(itinerary.rating || 0).toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({itinerary.reviewsCount || 0} reviews)</span>
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
              <p className="text-sm text-muted-foreground">{itinerary.locations?.join(", ") || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-4 shadow-sm">
            <Hotel className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="font-medium">Accommodations</h3>
              <p className="text-sm text-muted-foreground">
                {itinerary.accommodations?.length || 0}{" "}
                {(itinerary.accommodations?.length || 0) === 1 ? "Place" : "Places"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-4 shadow-sm">
            <Utensils className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="font-medium">Restaurants</h3>
              <p className="text-sm text-muted-foreground">
                {itinerary.days?.reduce((count, day) => {
                  return count + day.activities.filter((a) => a.type === "food").length
                }, 0) || 0}{" "}
                Recommended Places
              </p>
            </div>
          </div>
        </div>

        {itinerary.accommodations && itinerary.accommodations.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Accommodations</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {itinerary.accommodations.map((accommodation) => (
                <div key={accommodation._id} className="rounded-lg border p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Hotel className="h-5 w-5 text-emerald-600" />
                    <div>
                      <h3 className="font-medium">{accommodation.name}</h3>
                      <p className="text-sm text-muted-foreground">{accommodation.location}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-muted-foreground">{accommodation.dates}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {itinerary.preTripChecklist && itinerary.preTripChecklist.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Pre-Trip Checklist</h2>
            <PreTripChecklist
              itineraryId={itinerary._id}
              initialChecklist={itinerary.preTripChecklist}
              isAdmin={false}
            />
          </section>
        )}

        {itinerary.tips && itinerary.tips.length > 0 && (
          <section className="mb-8">
            <TipInformationBlock itineraryId={itinerary._id} initialTips={itinerary.tips} isAdmin={false} />
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Daily Itinerary</h2>

          {sortedDays.length > 0 ? (
            sortedDays.map((day) => <ItineraryDay key={day.dayNumber} day={day} itineraryId={itinerary._id} />)
          ) : (
            <div className="rounded-lg border p-8 text-center">
              <p className="text-muted-foreground">No daily itinerary has been added yet.</p>
            </div>
          )}
        </section>

        <CommentSection itineraryId={itinerary._id} />
      </div>
    </div>
  )
}
