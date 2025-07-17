import { fetchItineraryById } from "@/lib/data"
import { ItineraryDay } from "@/components/itinerary-day"
import { TipInformationBlock } from "@/components/tip-information-block"
import { PreTripChecklist } from "@/components/pre-trip-checklist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"

interface ItineraryPageProps {
  params: {
    id: string
  }
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const itinerary = await fetchItineraryById(params.id)

  if (!itinerary) {
    notFound()
  }

  const sortedDays = itinerary.days?.sort((a, b) => a.dayNumber - b.dayNumber) || []

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold text-center text-primary-foreground">{itinerary.destination} Itinerary</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {sortedDays.map((day) => (
            <ItineraryDay key={day.dayNumber} day={day} itineraryId={itinerary._id} />
          ))}
        </div>

        <div className="lg:col-span-1 space-y-8">
          {itinerary.preTripChecklist && itinerary.preTripChecklist.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pre-Trip Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <PreTripChecklist
                  itineraryId={itinerary._id}
                  initialChecklist={itinerary.preTripChecklist}
                  isAdmin={false} // Users cannot edit the checklist directly
                />
              </CardContent>
            </Card>
          )}

          {itinerary.tips && itinerary.tips.length > 0 && (
            <TipInformationBlock itineraryId={itinerary._id} initialTips={itinerary.tips} isAdmin={false} />
          )}

          {/* You can add more itinerary details here, e.g., budget summary, notes */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Duration:</h3>
                <p>{itinerary.duration}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold">Total Budget:</h3>
                <p>${itinerary.totalBudget?.toLocaleString()}</p>
              </div>
              {itinerary.travellersCount && itinerary.travellersCount > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Cost Per Person:</h3>
                    <p>${(itinerary.totalBudget / itinerary.travellersCount)?.toLocaleString()}</p>
                  </div>
                </>
              )}
              {itinerary.travelRecommendation && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Recommended For:</h3>
                    <p>{itinerary.travelRecommendation}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
