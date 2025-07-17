import { getItineraryById } from "@/lib/data"
import { notFound } from "next/navigation"
import { ItineraryDay } from "@/components/itinerary-day"
import { ExpenseSummary } from "@/components/expense-summary"
import { BackToTravelButton } from "@/components/back-to-travel-button"
import { CommentSection } from "@/components/comment-section"
import { PreTripChecklist } from "@/components/pre-trip-checklist"
import { TipInformationBlock } from "@/components/tip-information-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/safe-image"
import { MapPin, Calendar, Users, DollarSign, Star, ListChecks, Lightbulb } from "lucide-react"

interface ItineraryPageProps {
  params: { id: string }
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const { id } = params
  const itinerary = await getItineraryById(id)

  if (!itinerary) {
    notFound()
  }

  const isAdmin = false // This page is for public view, not admin editing

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToTravelButton />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">{itinerary.destination}</h1>
        {itinerary.image && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6 shadow-lg">
            <SafeImage src={itinerary.image} alt={itinerary.destination} className="object-cover w-full h-full" />
          </div>
        )}
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">{itinerary.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dates</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {itinerary.startDate} - {itinerary.endDate}
            </div>
            <p className="text-xs text-muted-foreground">{itinerary.days.length} Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Travellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itinerary.travellersCount}</div>
            <p className="text-xs text-muted-foreground">People</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{itinerary.totalBudget?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Category</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{itinerary.category}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itinerary.rating?.toFixed(1)} / 5</div>
            <p className="text-xs text-muted-foreground">{itinerary.reviewsCount} Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={itinerary.status === "completed" ? "default" : "secondary"}>{itinerary.status}</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-bold mb-4">Itinerary Details</h2>
          {itinerary.days.map((day, index) => (
            <ItineraryDay key={index} day={day} dayNumber={index + 1} isAdmin={isAdmin} itineraryId={itinerary._id} />
          ))}

          {itinerary.accommodations && itinerary.accommodations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Accommodations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {itinerary.accommodations.map((acc, index) => (
                    <li key={index} className="text-muted-foreground">
                      <strong>{acc.name}</strong> ({acc.type}) - Check-in: {acc.checkInDate}, Check-out:{" "}
                      {acc.checkOutDate}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <ExpenseSummary expenses={itinerary.expenses || []} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          {itinerary.preTripChecklist && itinerary.preTripChecklist.length > 0 && (
            <PreTripChecklist
              itineraryId={itinerary._id}
              initialChecklist={itinerary.preTripChecklist}
              isAdmin={isAdmin}
            />
          )}

          {itinerary.tips && itinerary.tips.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Travel Tips</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itinerary.tips.map((tip, index) => (
                    <TipInformationBlock key={index} tip={tip} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <CommentSection itineraryId={itinerary._id} />
        </div>
      </div>
    </div>
  )
}
