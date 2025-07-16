"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Save, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackToTravelButton } from "@/components/back-to-travel-button"
import { AdminNav } from "@/components/admin/admin-nav"
import { PreTripChecklist } from "@/components/pre-trip-checklist"
import {
  getItineraries,
  saveItinerary,
  deleteItinerary,
  getCompanions,
  saveCompanion,
  deleteCompanion,
} from "@/lib/data"
import type { Itinerary, Companion, ChecklistItem, TipItem } from "@/lib/models"

// Default checklist items
const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "1",
    title: "Check passport validity (6+ months)",
    notes: "Ensure passport is valid for at least 6 months from travel date",
    completed: false,
  },
  {
    id: "2",
    title: "Apply for visa if required",
    notes: "Check visa requirements for destination country",
    completed: false,
  },
  { id: "3", title: "Book flights", notes: "Compare prices and book flights in advance", completed: false },
  { id: "4", title: "Book accommodation", notes: "Reserve hotels or other accommodations", completed: false },
  { id: "5", title: "Get travel insurance", notes: "Purchase comprehensive travel insurance", completed: false },
  { id: "6", title: "Notify bank of travel plans", notes: "Inform bank to avoid card blocks abroad", completed: false },
  { id: "7", title: "Pack essentials", notes: "Pack clothes, medications, and travel documents", completed: false },
  {
    id: "8",
    title: "Check weather forecast",
    notes: "Pack appropriate clothing for destination weather",
    completed: false,
  },
  { id: "9", title: "Download offline maps", notes: "Download maps for offline use", completed: false },
  { id: "10", title: "Arrange airport transportation", notes: "Book taxi, uber, or arrange pickup", completed: false },
]

export default function AdminPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [companions, setCompanions] = useState<Companion[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null)
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("itineraries")

  // Form states
  const [destination, setDestination] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [status, setStatus] = useState<"online" | "completed">("online")
  const [season, setSeason] = useState("")
  const [locations, setLocations] = useState("")
  const [travellersCount, setTravellersCount] = useState(1)
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST_ITEMS)
  const [tips, setTips] = useState<TipItem[]>([])

  // Companion form states
  const [companionName, setCompanionName] = useState("")
  const [companionRole, setCompanionRole] = useState("")
  const [companionBio, setCompanionBio] = useState("")
  const [companionImage, setCompanionImage] = useState("")
  const [companionInstagram, setCompanionInstagram] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [itinerariesData, companionsData] = await Promise.all([getItineraries(), getCompanions()])
    setItineraries(itinerariesData)
    setCompanions(companionsData)
  }

  const resetForm = () => {
    setDestination("")
    setDescription("")
    setImage("")
    setStartDate("")
    setEndDate("")
    setStartTime("")
    setEndTime("")
    setStatus("online")
    setSeason("")
    setLocations("")
    setTravellersCount(1)
    setChecklist(DEFAULT_CHECKLIST_ITEMS)
    setTips([])
    setSelectedItinerary(null)
    setIsEditing(false)
  }

  const resetCompanionForm = () => {
    setCompanionName("")
    setCompanionRole("")
    setCompanionBio("")
    setCompanionImage("")
    setCompanionInstagram("")
    setSelectedCompanion(null)
  }

  const handleEditItinerary = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary)
    setDestination(itinerary.destination)
    setDescription(itinerary.description)
    setImage(itinerary.image || "")
    setStartDate(itinerary.startDate)
    setEndDate(itinerary.endDate)
    setStartTime(itinerary.startTime || "")
    setEndTime(itinerary.endTime || "")
    setStatus(itinerary.status)
    setSeason(itinerary.season || "")
    setLocations(itinerary.locations.join(", "))
    setTravellersCount(itinerary.travellersCount || 1)
    setChecklist(itinerary.metadata?.checklist || DEFAULT_CHECKLIST_ITEMS)
    setTips(itinerary.metadata?.tips || [])
    setIsEditing(true)
  }

  const handleEditCompanion = (companion: Companion) => {
    setSelectedCompanion(companion)
    setCompanionName(companion.name)
    setCompanionRole(companion.role || "")
    setCompanionBio(companion.bio || "")
    setCompanionImage(companion.image || "")
    setCompanionInstagram(companion.instagramId || "")
  }

  const handleSaveItinerary = async () => {
    const itineraryData: Itinerary = {
      id: selectedItinerary?.id || "",
      destination,
      description,
      image,
      startDate,
      endDate,
      startTime,
      endTime,
      status,
      season,
      locations: locations
        .split(",")
        .map((loc) => loc.trim())
        .filter(Boolean),
      days: selectedItinerary?.days || [],
      travellersCount,
      metadata: {
        checklist,
        tips,
      },
    }

    const saved = await saveItinerary(itineraryData)
    if (saved) {
      await loadData()
      resetForm()
    }
  }

  const handleSaveCompanion = async () => {
    const companionData: Companion = {
      id: selectedCompanion?.id || "",
      name: companionName,
      role: companionRole,
      bio: companionBio,
      image: companionImage,
      instagramId: companionInstagram,
    }

    const saved = await saveCompanion(companionData)
    if (saved) {
      await loadData()
      resetCompanionForm()
    }
  }

  const handleDeleteItinerary = async (id: string) => {
    if (confirm("Are you sure you want to delete this itinerary?")) {
      await deleteItinerary(id)
      await loadData()
      if (selectedItinerary?.id === id) {
        resetForm()
      }
    }
  }

  const handleDeleteCompanion = async (id: string) => {
    if (confirm("Are you sure you want to delete this companion?")) {
      await deleteCompanion(id)
      await loadData()
      if (selectedCompanion?.id === id) {
        resetCompanionForm()
      }
    }
  }

  const addNewTip = () => {
    const newTip: TipItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
      category: "general",
    }
    setTips([...tips, newTip])
  }

  const updateTip = (id: string, field: keyof TipItem, value: string) => {
    setTips(tips.map((tip) => (tip.id === id ? { ...tip, [field]: value } : tip)))
  }

  const deleteTip = (id: string) => {
    setTips(tips.filter((tip) => tip.id !== id))
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <BackToTravelButton />
      </div>

      <AdminNav />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="itineraries">Manage Itineraries</TabsTrigger>
          <TabsTrigger value="companions">Manage Companions</TabsTrigger>
        </TabsList>

        <TabsContent value="itineraries" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Itinerary Form */}
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? "Edit Itinerary" : "Create New Itinerary"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g., Vietnam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="travellersCount">Number of Travellers</Label>
                    <Input
                      id="travellersCount"
                      type="number"
                      min="1"
                      value={travellersCount}
                      onChange={(e) => setTravellersCount(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the trip"
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(value: "online" | "completed") => setStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="season">Season</Label>
                    <Select value={season} onValueChange={setSeason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="fall">Fall</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="locations">Locations (comma-separated)</Label>
                  <Input
                    id="locations"
                    value={locations}
                    onChange={(e) => setLocations(e.target.value)}
                    placeholder="Ho Chi Minh City, Hanoi, Da Nang"
                  />
                </div>

                {/* Pre-Trip Checklist Management */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pre-Trip Checklist</h3>
                  <PreTripChecklist
                    destination={destination}
                    items={checklist}
                    onUpdateItems={setChecklist}
                    isAdmin={true}
                  />
                </div>

                {/* Tips Management */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Travel Tips</h3>
                    <Button onClick={addNewTip} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Tip
                    </Button>
                  </div>

                  {tips.map((tip) => (
                    <Card key={tip.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Input
                            value={tip.title}
                            onChange={(e) => updateTip(tip.id, "title", e.target.value)}
                            placeholder="Tip title"
                            className="flex-1 mr-2"
                          />
                          <Select value={tip.category} onValueChange={(value) => updateTip(tip.id, "category", value)}>
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="money-saving">Money Saving</SelectItem>
                              <SelectItem value="safety">Safety</SelectItem>
                              <SelectItem value="cultural">Cultural</SelectItem>
                              <SelectItem value="transportation">Transportation</SelectItem>
                              <SelectItem value="accommodation">Accommodation</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTip(tip.id)}
                            className="ml-2 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={tip.description}
                          onChange={(e) => updateTip(tip.id, "description", e.target.value)}
                          placeholder="Tip description"
                          className="h-20"
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveItinerary} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Update" : "Create"} Itinerary
                  </Button>
                  {isEditing && (
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Itineraries List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Itineraries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {itineraries.map((itinerary) => (
                    <div key={itinerary.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{itinerary.destination}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(itinerary.startDate).toLocaleDateString()}</span>
                          {itinerary.travellersCount && (
                            <>
                              <Users className="h-3 w-3 ml-2" />
                              <span>{itinerary.travellersCount} travellers</span>
                            </>
                          )}
                        </div>
                        <Badge variant={itinerary.status === "completed" ? "secondary" : "default"} className="mt-1">
                          {itinerary.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditItinerary(itinerary)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItinerary(itinerary.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Companion Form */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedCompanion ? "Edit Companion" : "Add New Companion"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companionName">Name</Label>
                  <Input
                    id="companionName"
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <Label htmlFor="companionRole">Role</Label>
                  <Input
                    id="companionRole"
                    value={companionRole}
                    onChange={(e) => setCompanionRole(e.target.value)}
                    placeholder="e.g., Travel Guide, Photographer"
                  />
                </div>

                <div>
                  <Label htmlFor="companionBio">Bio</Label>
                  <Textarea
                    id="companionBio"
                    value={companionBio}
                    onChange={(e) => setCompanionBio(e.target.value)}
                    placeholder="Brief bio"
                  />
                </div>

                <div>
                  <Label htmlFor="companionImage">Image URL</Label>
                  <Input
                    id="companionImage"
                    value={companionImage}
                    onChange={(e) => setCompanionImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="companionInstagram">Instagram Username</Label>
                  <Input
                    id="companionInstagram"
                    value={companionInstagram}
                    onChange={(e) => setCompanionInstagram(e.target.value)}
                    placeholder="username (without @)"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveCompanion} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {selectedCompanion ? "Update" : "Add"} Companion
                  </Button>
                  {selectedCompanion && (
                    <Button variant="outline" onClick={resetCompanionForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Companions List */}
            <Card>
              <CardHeader>
                <CardTitle>Travel Companions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {companions.map((companion) => (
                    <div key={companion.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {companion.image && (
                          <img
                            src={companion.image || "/placeholder.svg"}
                            alt={companion.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{companion.name}</h4>
                          {companion.role && <p className="text-sm text-muted-foreground">{companion.role}</p>}
                          {companion.instagramId && <p className="text-xs text-blue-600">@{companion.instagramId}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCompanion(companion)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCompanion(companion.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
