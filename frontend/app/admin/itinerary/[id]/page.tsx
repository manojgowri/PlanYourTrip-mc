"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2 } from "lucide-react"
import { getItineraryById, saveItinerary } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { SaveChangesButton } from "@/components/admin/save-changes-button"
import { SafeImage } from "@/components/safe-image"
import { ItineraryActivitiesManager } from "@/components/itinerary-activities-manager"
import { BackToTravelButton } from "@/components/back-to-travel-button"
import type { Itinerary, Day, Accommodation, ChecklistItem, Tip } from "@/lib/models"

export default function AdminItineraryDetailPage() {
  const params = useParams()
  const itineraryId = params.id as string
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const { toast } = useToast()

  useEffect(() => {
    if (itineraryId) {
      loadItinerary()
    }
  }, [itineraryId])

  const loadItinerary = async () => {
    try {
      const data = await getItineraryById(itineraryId)
      if (data) {
        setItinerary(data)
      } else {
        toast({
          title: "Error",
          description: "Itinerary not found.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch itinerary:", error)
      toast({
        title: "Error",
        description: "Failed to load itinerary details. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleItineraryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setItinerary((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleItineraryNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setItinerary((prev) => (prev ? { ...prev, [name]: Number.parseFloat(value) } : null))
  }

  const handleSaveItineraryDetails = async () => {
    if (!itinerary) return

    try {
      const saved = await saveItinerary(itinerary)
      if (saved) {
        toast({
          title: "Success",
          description: "Itinerary details saved successfully!",
        })
        setItinerary(saved) // Update with potentially new data from server
      } else {
        throw new Error("Failed to save itinerary details")
      }
    } catch (error) {
      console.error("Failed to save itinerary details:", error)
      toast({
        title: "Error",
        description: "Failed to save itinerary details. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddDay = async () => {
    if (!itinerary) return
    const newDayNumber = (itinerary.days?.length || 0) + 1
    const newDay: Day = {
      _id: `new-day-${Date.now()}`, // Temporary ID
      dayNumber: newDayNumber,
      date: new Date().toISOString().split("T")[0], // Default to today
      activities: [],
    }
    const updatedItinerary = { ...itinerary, days: [...(itinerary.days || []), newDay] }
    setItinerary(updatedItinerary)
    // In a real app, you'd save this to the backend immediately or on overall save
    toast({ title: "Day Added", description: `Day ${newDayNumber} added. Remember to save changes!` })
  }

  const handleDeleteDay = async (dayId: string) => {
    if (!itinerary || !window.confirm("Are you sure you want to delete this day and all its activities?")) return

    const updatedDays = itinerary.days?.filter((day) => day._id !== dayId) || []
    const renumberedDays = updatedDays.map((day, index) => ({ ...day, dayNumber: index + 1 }))

    const updatedItinerary = { ...itinerary, days: renumberedDays }
    setItinerary(updatedItinerary)
    // In a real app, you'd save this to the backend
    toast({ title: "Day Deleted", description: "Day deleted. Remember to save changes!" })
  }

  const handleAddAccommodation = () => {
    if (!itinerary) return
    const newAccommodation: Accommodation = {
      _id: `new-acc-${Date.now()}`,
      name: "",
      type: "",
      checkInDate: "",
      checkOutDate: "",
      cost: 0,
    }
    setItinerary((prev) =>
      prev ? { ...prev, accommodations: [...(prev.accommodations || []), newAccommodation] } : null,
    )
  }

  const handleAccommodationChange = (index: number, field: keyof Accommodation, value: string | number) => {
    if (!itinerary) return
    const updatedAccommodations = [...(itinerary.accommodations || [])]
    if (field === "cost") {
      updatedAccommodations[index] = { ...updatedAccommodations[index], [field]: Number(value) }
    } else {
      updatedAccommodations[index] = { ...updatedAccommodations[index], [field]: value as string }
    }
    setItinerary((prev) => (prev ? { ...prev, accommodations: updatedAccommodations } : null))
  }

  const handleDeleteAccommodation = (id: string) => {
    if (!itinerary || !window.confirm("Are you sure you want to delete this accommodation?")) return
    setItinerary((prev) =>
      prev ? { ...prev, accommodations: prev.accommodations?.filter((acc) => acc._id !== id) } : null,
    )
  }

  const handleAddChecklistItem = () => {
    if (!itinerary) return
    const newItem: ChecklistItem = {
      _id: `new-item-${Date.now()}`,
      item: "",
      isCompleted: false,
    }
    setItinerary((prev) => (prev ? { ...prev, preTripChecklist: [...(prev.preTripChecklist || []), newItem] } : null))
  }

  const handleChecklistItemChange = (index: number, field: keyof ChecklistItem, value: string | boolean) => {
    if (!itinerary) return
    const updatedChecklist = [...(itinerary.preTripChecklist || [])]
    updatedChecklist[index] = { ...updatedChecklist[index], [field]: value }
    setItinerary((prev) => (prev ? { ...prev, preTripChecklist: updatedChecklist } : null))
  }

  const handleDeleteChecklistItem = (id: string) => {
    if (!itinerary || !window.confirm("Are you sure you want to delete this checklist item?")) return
    setItinerary((prev) =>
      prev ? { ...prev, preTripChecklist: prev.preTripChecklist?.filter((item) => item._id !== id) } : null,
    )
  }

  const handleAddTip = () => {
    if (!itinerary) return
    const newTip: Tip = {
      _id: `new-tip-${Date.now()}`,
      title: "",
      description: "",
    }
    setItinerary((prev) => (prev ? { ...prev, tips: [...(prev.tips || []), newTip] } : null))
  }

  const handleTipChange = (index: number, field: keyof Tip, value: string) => {
    if (!itinerary) return
    const updatedTips = [...(itinerary.tips || [])]
    updatedTips[index] = { ...updatedTips[index], [field]: value }
    setItinerary((prev) => (prev ? { ...prev, tips: updatedTips } : null))
  }

  const handleDeleteTip = (id: string) => {
    if (!itinerary || !window.confirm("Are you sure you want to delete this tip?")) return
    setItinerary((prev) => (prev ? { ...prev, tips: prev.tips?.filter((tip) => tip._id !== id) } : null))
  }

  if (!itinerary) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading itinerary...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <BackToTravelButton />
        <h1 className="text-3xl font-bold">Manage {itinerary.destination} Itinerary</h1>
        <SaveChangesButton onClick={handleSaveItineraryDetails} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="days">Daily Itinerary</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Itinerary Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    name="destination"
                    value={itinerary.destination}
                    onChange={handleItineraryInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" name="image" value={itinerary.image} onChange={handleItineraryInputChange} />
                  {itinerary.image && (
                    <SafeImage
                      src={itinerary.image}
                      alt="Itinerary Image"
                      className="mt-2 w-full h-32 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={itinerary.description}
                  onChange={handleItineraryInputChange}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={itinerary.startDate}
                    onChange={handleItineraryInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={itinerary.endDate}
                    onChange={handleItineraryInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalBudget">Total Budget (₹)</Label>
                  <Input
                    id="totalBudget"
                    name="totalBudget"
                    type="number"
                    value={itinerary.totalBudget}
                    onChange={handleItineraryNumberInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="travellersCount">Travellers Count</Label>
                  <Input
                    id="travellersCount"
                    name="travellersCount"
                    type="number"
                    value={itinerary.travellersCount}
                    onChange={handleItineraryNumberInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={itinerary.category}
                    onChange={handleItineraryInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="season">Season</Label>
                  <Input id="season" name="season" value={itinerary.season} onChange={handleItineraryInputChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="locations">Locations (comma-separated)</Label>
                <Input
                  id="locations"
                  name="locations"
                  value={itinerary.locations?.join(", ") || ""}
                  onChange={(e) =>
                    setItinerary((prev) =>
                      prev ? { ...prev, locations: e.target.value.split(",").map((loc) => loc.trim()) } : null,
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={itinerary.rating}
                    onChange={handleItineraryNumberInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="reviewsCount">Reviews Count</Label>
                  <Input
                    id="reviewsCount"
                    name="reviewsCount"
                    type="number"
                    value={itinerary.reviewsCount}
                    onChange={handleItineraryNumberInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="days" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Daily Itinerary</h2>
          <Button onClick={handleAddDay} className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Day
          </Button>
          {itinerary.days?.length > 0 ? (
            <div className="space-y-6">
              {itinerary.days.map((day) => (
                <Card key={day._id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>
                      Day {day.dayNumber}: {day.date}
                    </CardTitle>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteDay(day._id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Day</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ItineraryActivitiesManager
                      itineraryId={itinerary._id}
                      day={day}
                      onActivityChange={loadItinerary} // Reload itinerary after activity changes
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No days added yet. Click "Add New Day" to start planning!</p>
          )}
        </TabsContent>

        <TabsContent value="accommodations" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Accommodations</h2>
          <Button onClick={handleAddAccommodation} className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Accommodation
          </Button>
          {itinerary.accommodations?.length > 0 ? (
            <div className="space-y-4">
              {itinerary.accommodations.map((acc, index) => (
                <Card key={acc._id}>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div>
                      <Label htmlFor={`acc-name-${index}`}>Name</Label>
                      <Input
                        id={`acc-name-${index}`}
                        value={acc.name}
                        onChange={(e) => handleAccommodationChange(index, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`acc-type-${index}`}>Type</Label>
                      <Input
                        id={`acc-type-${index}`}
                        value={acc.type}
                        onChange={(e) => handleAccommodationChange(index, "type", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`acc-checkin-${index}`}>Check-in Date</Label>
                      <Input
                        id={`acc-checkin-${index}`}
                        type="date"
                        value={acc.checkInDate}
                        onChange={(e) => handleAccommodationChange(index, "checkInDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`acc-checkout-${index}`}>Check-out Date</Label>
                      <Input
                        id={`acc-checkout-${index}`}
                        type="date"
                        value={acc.checkOutDate}
                        onChange={(e) => handleAccommodationChange(index, "checkOutDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`acc-cost-${index}`}>Cost (₹)</Label>
                      <Input
                        id={`acc-cost-${index}`}
                        type="number"
                        value={acc.cost}
                        onChange={(e) => handleAccommodationChange(index, "cost", e.target.value)}
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      <Button variant="destructive" onClick={() => handleDeleteAccommodation(acc._id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No accommodations added yet.</p>
          )}
        </TabsContent>

        <TabsContent value="checklist" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Pre-Trip Checklist</h2>
          <Button onClick={handleAddChecklistItem} className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
          {itinerary.preTripChecklist?.length > 0 ? (
            <div className="space-y-4">
              {itinerary.preTripChecklist.map((item, index) => (
                <Card key={item._id}>
                  <CardContent className="flex items-center gap-4 py-4">
                    <Input
                      value={item.item}
                      onChange={(e) => handleChecklistItemChange(index, "item", e.target.value)}
                      className="flex-grow"
                    />
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={(e) => handleChecklistItemChange(index, "isCompleted", e.target.checked)}
                      className="h-5 w-5"
                    />
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteChecklistItem(item._id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Item</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No checklist items added yet.</p>
          )}
        </TabsContent>

        <TabsContent value="tips" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Travel Tips</h2>
          <Button onClick={handleAddTip} className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Tip
          </Button>
          {itinerary.tips?.length > 0 ? (
            <div className="space-y-4">
              {itinerary.tips.map((tip, index) => (
                <Card key={tip._id}>
                  <CardContent className="grid gap-2 py-4">
                    <div>
                      <Label htmlFor={`tip-title-${index}`}>Title</Label>
                      <Input
                        id={`tip-title-${index}`}
                        value={tip.title}
                        onChange={(e) => handleTipChange(index, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`tip-description-${index}`}>Description</Label>
                      <Textarea
                        id={`tip-description-${index}`}
                        value={tip.description}
                        onChange={(e) => handleTipChange(index, "description", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="destructive" onClick={() => handleDeleteTip(tip._id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tips added yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
