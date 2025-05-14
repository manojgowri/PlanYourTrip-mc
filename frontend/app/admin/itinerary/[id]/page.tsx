"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ItineraryActivitiesManager } from "@/components/itinerary-activities-manager"
import { PreTripChecklistForm, type ChecklistItem } from "@/components/pre-trip-checklist-form"
import { BackToTravelButton } from "@/components/back-to-travel-button"
import { getItinerary, saveItinerary, getAuthToken } from "@/lib/data"
import { ArrowLeft, Save } from "lucide-react"
import type { Itinerary } from "@/lib/models"

interface ItineraryEditPageProps {
  params: {
    id: string
  }
}

export default function ItineraryEditPage({ params }: ItineraryEditPageProps) {
  const router = useRouter()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("activities")
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
      return
    }

    const fetchItinerary = async () => {
      try {
        setLoading(true)
        const data = await getItinerary(params.id)
        if (data) {
          setItinerary(data)

          // Extract checklist from itinerary metadata if it exists
          if (data.metadata?.checklist) {
            setChecklist(data.metadata.checklist)
          }
        } else {
          setError("Itinerary not found")
        }
      } catch (err) {
        console.error("Error fetching itinerary:", err)
        setError("Failed to load itinerary. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchItinerary()
  }, [params.id, router])

  const handleSave = async () => {
    if (!itinerary) return

    try {
      setSaving(true)
      setError(null)

      // Add checklist to metadata
      const updatedItinerary: Itinerary = {
        ...itinerary,
        metadata: {
          ...itinerary.metadata,
          checklist,
        },
      }

      await saveItinerary(updatedItinerary)

      // Show success message
      alert("Itinerary saved successfully!")
    } catch (err) {
      console.error("Error saving itinerary:", err)
      setError("Failed to save itinerary. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateDays = (updatedDays: Itinerary["days"]) => {
    if (!itinerary) return
    setItinerary({
      ...itinerary,
      days: updatedDays,
    })
  }

  const handleUpdateChecklist = (updatedChecklist: ChecklistItem[]) => {
    setChecklist(updatedChecklist)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Loading itinerary...</h1>
      </div>
    )
  }

  if (error || !itinerary) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Error</h1>
        <p className="text-red-500">{error || "Itinerary not found"}</p>
        <Button className="mt-4" onClick={() => router.push("/admin")}>
          Back to Admin
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <Button variant="ghost" onClick={() => router.push("/admin")} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold">{itinerary.destination} Itinerary</h1>
          <p className="text-muted-foreground">
            {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <BackToTravelButton />
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="checklist">Pre-Trip Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="activities">
          <ItineraryActivitiesManager itineraryId={itinerary.id} days={itinerary.days} onUpdate={handleUpdateDays} />
        </TabsContent>

        <TabsContent value="checklist">
          <PreTripChecklistForm checklist={checklist} onChange={handleUpdateChecklist} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
