import { getItineraryById } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ItineraryDay } from "@/components/itinerary-day"
import { PreTripChecklist } from "@/components/pre-trip-checklist"
import { TipInformationBlock } from "@/components/tip-information-block"
import { SafeImage } from "@/components/safe-image"
import { CurrencySelector } from "@/components/currency-selector"
import { ExpenseSummary } from "@/components/expense-summary"
import { CommentSection } from "@/components/comment-section"
import { BackToTravelButton } from "@/components/back-to-travel-button"
import { CompleteStatusButton } from "@/components/complete-status-button"
import type { Itinerary } from "@/lib/models"

interface ItineraryPageProps {
  params: { id: string }
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const itinerary: Itinerary | null = await getItineraryById(params.id)

  if (!itinerary) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <BackToTravelButton />
        <CompleteStatusButton itineraryId={itinerary._id} initialStatus={itinerary.status} />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">{itinerary.destination}</CardTitle>
          <p className="text-muted-foreground">{itinerary.description}</p>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
            <SafeImage
              src={itinerary.image || "/placeholder.svg?height=400&width=800"}
              alt={itinerary.destination}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold">Dates:</span> {itinerary.startDate} to {itinerary.endDate}
            </div>
            <div>
              <span className="font-semibold">Travellers:</span> {itinerary.travellersCount}
            </div>
            <div>
              <span className="font-semibold">Category:</span> <Badge variant="secondary">{itinerary.category}</Badge>
            </div>
            <div>
              <span className="font-semibold">Season:</span> {itinerary.season}
            </div>
            <div>
              <span className="font-semibold">Locations:</span> {itinerary.locations?.join(", ")}
            </div>
            <div>
              <span className="font-semibold">Rating:</span> {itinerary.rating} ({itinerary.reviewsCount} reviews)
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Itinerary Details</h2>
          {itinerary.days?.length > 0 ? (
            itinerary.days.map((day) => <ItineraryDay key={day._id} day={day} itineraryId={itinerary._id} />)
          ) : (
            <p className="text-muted-foreground">No daily itinerary planned yet.</p>
          )}
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Budget & Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="font-semibold">Total Budget:</span> ₹{itinerary.totalBudget?.toLocaleString()}
              </div>
              <CurrencySelector />
              <ExpenseSummary activities={itinerary.days?.flatMap((day) => day.activities || []) || []} />
            </CardContent>
          </Card>

          {itinerary.preTripChecklist && itinerary.preTripChecklist.length > 0 && (
            <PreTripChecklist checklist={itinerary.preTripChecklist} />
          )}

          {itinerary.tips && itinerary.tips.length > 0 && <TipInformationBlock tips={itinerary.tips} />}
        </div>
      </div>

      <CommentSection itineraryId={itinerary._id} />
    </div>
  )
}
