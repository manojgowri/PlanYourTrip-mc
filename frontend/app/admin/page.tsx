"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { fetchItineraries, createItinerary, updateItinerary, deleteItinerary } from "@/lib/data"
import type { Itinerary } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, CalendarDays, Users, DollarSign } from "lucide-react"
import { AdminNav } from "@/components/admin/admin-nav"
import { DatePicker } from "@/components/date-picker"
import { format } from "date-fns"
import { calculateDuration, getTravelRecommendation } from "@/lib/utils"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [editingItinerary, setEditingItinerary] = useState<Partial<Itinerary> | null>(null)
  const [isNewItinerary, setIsNewItinerary] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadItineraries()
  }, [])

  const loadItineraries = async () => {
    const data = await fetchItineraries()
    setItineraries(data)
  }

  const handleEdit = (itinerary: Itinerary) => {
    setEditingItinerary({ ...itinerary })
    setIsNewItinerary(false)
  }

  const handleCreateNew = () => {
    setEditingItinerary({
      destination: "",
      startDate: "",
      endDate: "",
      duration: "",
      category: "Adventure",
      season: "Summer",
      image: "",
      description: "",
      totalBudget: 0,
      travellersCount: 1,
      days: [],
      preTripChecklist: [],
      tips: [],
    })
    setIsNewItinerary(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditingItinerary((prev) => ({ ...prev!, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditingItinerary((prev) => ({ ...prev!, [name]: value }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    setEditingItinerary((prev) => ({
      ...prev!,
      [name]: date ? format(date, "yyyy-MM-dd") : "",
    }))
  }

  const handleSave = async () => {
    if (!editingItinerary) return

    const itineraryToSave = { ...editingItinerary }

    // Calculate duration and recommendation before saving
    if (itineraryToSave.startDate && itineraryToSave.endDate) {
      itineraryToSave.duration = calculateDuration(itineraryToSave.startDate, itineraryToSave.endDate)
    }
    itineraryToSave.travelRecommendation = getTravelRecommendation(itineraryToSave.travellersCount)

    try {
      if (isNewItinerary) {
        const newItinerary = await createItinerary(itineraryToSave)
        if (newItinerary) {
          setItineraries([...itineraries, newItinerary])
          toast({
            title: "Success",
            description: "Itinerary created successfully.",
          })
        } else {
          throw new Error("Failed to create itinerary")
        }
      } else if (editingItinerary._id) {
        const updatedItinerary = await updateItinerary(editingItinerary._id, itineraryToSave)
        if (updatedItinerary) {
          setItineraries(itineraries.map((it) => (it._id === updatedItinerary._id ? updatedItinerary : it)))
          toast({
            title: "Success",
            description: "Itinerary updated successfully.",
          })
        } else {
          throw new Error("Failed to update itinerary")
        }
      }
      setEditingItinerary(null)
      setIsNewItinerary(false)
    } catch (error) {
      console.error("Error saving itinerary:", error)
      toast({
        title: "Error",
        description: "Failed to save itinerary. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      try {
        const success = await deleteItinerary(id)
        if (success) {
          setItineraries(itineraries.filter((it) => it._id !== id))
          toast({
            title: "Success",
            description: "Itinerary deleted successfully.",
          })
        } else {
          throw new Error("Failed to delete itinerary")
        }
      } catch (error) {
        console.error("Error deleting itinerary:", error)
        toast({
          title: "Error",
          description: "Failed to delete itinerary. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminNav />
      <h1 className="mb-8 text-3xl font-bold">Manage Itineraries</h1>

      <div className="mb-6 flex justify-end">
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> Create New Itinerary
        </Button>
      </div>

      {editingItinerary && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isNewItinerary ? "Create New Itinerary" : `Edit ${editingItinerary.destination}`}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="destination" className="mb-1 block text-sm font-medium">
                Destination
              </label>
              <Input
                id="destination"
                name="destination"
                value={editingItinerary.destination || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="startDate" className="mb-1 block text-sm font-medium">
                Start Date
              </label>
              <DatePicker
                date={editingItinerary.startDate ? new Date(editingItinerary.startDate) : undefined}
                setDate={(date) => handleDateChange("startDate", date)}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="mb-1 block text-sm font-medium">
                End Date
              </label>
              <DatePicker
                date={editingItinerary.endDate ? new Date(editingItinerary.endDate) : undefined}
                setDate={(date) => handleDateChange("endDate", date)}
              />
            </div>
            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium">
                Category
              </label>
              <Select
                value={editingItinerary.category || ""}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Relaxation">Relaxation</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="City Break">City Break</SelectItem>
                  <SelectItem value="Nature">Nature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="season" className="mb-1 block text-sm font-medium">
                Season
              </label>
              <Select
                value={editingItinerary.season || ""}
                onValueChange={(value) => handleSelectChange("season", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Autumn">Autumn</SelectItem>
                  <SelectItem value="Winter">Winter</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="totalBudget" className="mb-1 block text-sm font-medium">
                Total Budget ($)
              </label>
              <Input
                id="totalBudget"
                name="totalBudget"
                type="number"
                value={editingItinerary.totalBudget || 0}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="travellersCount" className="mb-1 block text-sm font-medium">
                Number of Travellers
              </label>
              <Input
                id="travellersCount"
                name="travellersCount"
                type="number"
                value={editingItinerary.travellersCount || 1}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label htmlFor="description" className="mb-1 block text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={editingItinerary.description || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label htmlFor="image" className="mb-1 block text-sm font-medium">
                Image URL
              </label>
              <ImageUpload
                initialImageUrl={editingItinerary.image}
                onImageUpload={(url) => setEditingItinerary((prev) => ({ ...prev!, image: url }))}
              />
            </div>
            <div className="col-span-full flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingItinerary(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Itinerary</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {itineraries.map((itinerary) => (
          <Card key={itinerary._id}>
            <CardHeader>
              <CardTitle>{itinerary.destination}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                {itinerary.startDate} - {itinerary.endDate} ({itinerary.duration})
              </p>
              <p className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                {itinerary.travellersCount} Travellers
              </p>
              <p className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />${itinerary.totalBudget?.toLocaleString()}
              </p>
              <p>{itinerary.description.substring(0, 100)}...</p>
            </CardContent>
            <CardContent className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(itinerary)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(itinerary._id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
