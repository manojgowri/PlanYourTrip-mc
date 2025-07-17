import { getItineraryById, getChecklistItems, getTips } from "@/lib/data"
import { ItineraryDay } from "@/components/itinerary-day"
import { PreTripChecklist } from "@/components/pre-trip-checklist"
import { TipInformationBlock } from "@/components/tip-information-block"
import { ExpenseSummary } from "@/components/expense-summary"
import { BackToTravelButton } from "@/components/back-to-travel-button"
import { CompleteStatusButton } from "@/components/complete-status-button"
import { CommentSection } from "@/components/comment-section"
import type { TravelItinerary, ChecklistItem, Tip } from "@/lib/models"
import { notFound } from "next/navigation"

interface ItineraryPageProps {
  params: {
    id: string
  }
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const itinerary: TravelItinerary | null = await getItineraryById(params.id)
  const checklist: ChecklistItem[] = await getChecklistItems(params.id)
  const tips: Tip[] = await getTips(params.id)

  if (!itinerary) {
    notFound()
  }

  const isAdmin = false // This page is for users, not admin. Admin has a separate route.

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <BackToTravelButton />
        <h1 className="text-4xl font-bold">{itinerary.destination}</h1>
        <CompleteStatusButton itineraryId={itinerary._id} initialStatus={itinerary.completed} isAdmin={isAdmin} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {itinerary.days.map((day, index) => (
            <ItineraryDay key={day._id} day={day} dayNumber={index + 1} itineraryId={itinerary._id} isAdmin={isAdmin} />
          ))}
        </div>
        <div className="lg:col-span-1 space-y-8">
          <PreTripChecklist itineraryId={itinerary._id} initialChecklist={checklist} isAdmin={isAdmin} />
          <TipInformationBlock itineraryId={itinerary._id} initialTips={tips} isAdmin={isAdmin} />
          <ExpenseSummary itineraryId={itinerary._id} initialExpenses={itinerary.expenses} isAdmin={isAdmin} />
          <CommentSection itineraryId={itinerary._id} initialComments={itinerary.comments} isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  )
}
