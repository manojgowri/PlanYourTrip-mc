"use client"
import { getItineraryById, getChecklistItems, getTips } from "@/lib/data"
import { ItineraryDay } from "@/components/itinerary-day"
import { PreTripChecklist } from "@/components/pre-trip-checklist"
import { TipInformationBlock } from "@/components/tip-information-block"
import { ExpenseSummary } from "@/components/expense-summary"
import { BackToTravelButton } from "@/components/back-to-travel-button"
import { CompleteStatusButton } from "@/components/admin/complete-status-button" // Admin version
import { CommentSection } from "@/components/comment-section"
import { AdminNav } from "@/components/admin/admin-nav"
import { SaveChangesButton } from "@/components/admin/save-changes-button"
import type { TravelItinerary, ChecklistItem, Tip } from "@/lib/models"
import { notFound } from "next/navigation"

interface AdminItineraryPageProps {
  params: {
    id: string
  }
}

export default async function AdminItineraryPage({ params }: AdminItineraryPageProps) {
  const itinerary: TravelItinerary | null = await getItineraryById(params.id)
  const checklist: ChecklistItem[] = await getChecklistItems(params.id)
  const tips: Tip[] = await getTips(params.id)

  if (!itinerary) {
    notFound()
  }

  const isAdmin = true // This page is specifically for admin mode

  // In a real admin page, you'd have state management (e.g., React hooks, context, or a form library)
  // to manage changes to the itinerary data before saving.
  // For this example, we'll just pass the data and show the save button.
  const handleSaveChanges = async () => {
    // This function would typically collect all modified data from child components
    // and send it to the backend. For now, it's a placeholder.
    console.log("Admin: Saving changes for itinerary", itinerary._id)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
  }

  return (
    <div className="container mx-auto p-4">
      <AdminNav />
      <div className="flex justify-between items-center mb-6">
        <BackToTravelButton />
        <h1 className="text-4xl font-bold">Admin: {itinerary.destination}</h1>
        <div className="flex gap-2">
          <CompleteStatusButton itineraryId={itinerary._id} initialStatus={itinerary.completed} />
          <SaveChangesButton onSave={handleSaveChanges} />
        </div>
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
