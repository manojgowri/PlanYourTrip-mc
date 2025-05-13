"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { AdminNav } from "@/components/admin/admin-nav"
import { BackToTravelButton } from "@/components/back-to-travel-button"
import {
  fetchItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  fetchCompanions,
  createCompanion,
  updateCompanion,
  deleteCompanion,
  getAuthToken,
} from "@/lib/data"
import type { Itinerary, Companion } from "@/lib/models"
import { getImageUrl } from "@/lib/image-utils"

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("itineraries")
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [companions, setCompanions] = useState<Companion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Form states
  const [newItinerary, setNewItinerary] = useState<Partial<Itinerary>>({
    destination: "",
    description: "",
    startDate: "",
    endDate: "",
    image: "",
    locations: [],
    season: "summer",
    isCompleted: false,
    days: [],
  })

  const [newCompanion, setNewCompanion] = useState<Partial<Companion>>({
    name: "",
    relationship: "",
    bio: "",
    image: "",
  })

  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null)
  const [editingCompanion, setEditingCompanion] = useState<Companion | null>(null)

  // Check authentication
  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
      loadData()
    }
  }, [router])

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [itinerariesData, companionsData] = await Promise.all([fetchItineraries(), fetchCompanions()])

      setItineraries(itinerariesData)
      setCompanions(companionsData)
    } catch (err) {
      console.error("Error loading data:", err)
      setError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle itinerary form submission
  const handleItinerarySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      if (editingItinerary) {
        // Update existing itinerary
        await updateItinerary(editingItinerary.id, {
          ...newItinerary,
          locations: newItinerary.locations || [],
          days: editingItinerary.days || [],
        })
      } else {
        // Create new itinerary
        await createItinerary({
          ...newItinerary,
          locations: newItinerary.locations || [],
          days: [],
        })
      }

      // Reset form and reload data
      setNewItinerary({
        destination: "",
        description: "",
        startDate: "",
        endDate: "",
        image: "",
        locations: [],
        season: "summer",
        isCompleted: false,
        days: [],
      })
      setEditingItinerary(null)
      await loadData()
    } catch (err) {
      console.error("Error saving itinerary:", err)
      setError("Failed to save itinerary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle companion form submission
  const handleCompanionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      if (editingCompanion) {
        // Update existing companion
        await updateCompanion(editingCompanion.id, newCompanion)
      } else {
        // Create new companion
        await createCompanion(newCompanion)
      }

      // Reset form and reload data
      setNewCompanion({
        name: "",
        relationship: "",
        bio: "",
        image: "",
      })
      setEditingCompanion(null)
      await loadData()
    } catch (err) {
      console.error("Error saving companion:", err)
      setError("Failed to save companion. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle itinerary edit
  const handleEditItinerary = (itinerary: Itinerary) => {
    setEditingItinerary(itinerary)
    setNewItinerary({
      destination: itinerary.destination,
      description: itinerary.description || "",
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      image: itinerary.image || "",
      locations: itinerary.locations || [],
      season: itinerary.season || "summer",
      isCompleted: itinerary.isCompleted || false,
    })
  }

  // Handle companion edit
  const handleEditCompanion = (companion: Companion) => {
    setEditingCompanion(companion)
    setNewCompanion({
      name: companion.name,
      relationship: companion.relationship || "",
      bio: companion.bio || "",
      image: companion.image || "",
    })
  }

  // Handle itinerary delete
  const handleDeleteItinerary = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this itinerary?")) {
      return
    }

    try {
      setLoading(true)
      await deleteItinerary(id)
      await loadData()
    } catch (err) {
      console.error("Error deleting itinerary:", err)
      setError("Failed to delete itinerary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle companion delete
  const handleDeleteCompanion = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this companion?")) {
      return
    }

    try {
      setLoading(true)
      await deleteCompanion(id)
      await loadData()
    } catch (err) {
      console.error("Error deleting companion:", err)
      setError("Failed to delete companion. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle locations input
  const handleLocationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const locationsString = e.target.value
    const locationsArray = locationsString
      .split(",")
      .map((loc) => loc.trim())
      .filter(Boolean)

    setNewItinerary({
      ...newItinerary,
      locations: locationsArray,
    })
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <BackToTravelButton />
      </div>

      <AdminNav activeTab={activeTab} onTabChange={setActiveTab} />

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mt-6">
        {activeTab === "itineraries" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingItinerary ? "Edit Itinerary" : "Add New Itinerary"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleItinerarySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      value={newItinerary.destination}
                      onChange={(e) => setNewItinerary({ ...newItinerary, destination: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItinerary.description}
                      onChange={(e) => setNewItinerary({ ...newItinerary, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newItinerary.startDate}
                        onChange={(e) => setNewItinerary({ ...newItinerary, startDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newItinerary.endDate}
                        onChange={(e) => setNewItinerary({ ...newItinerary, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locations">Locations (comma separated)</Label>
                    <Input
                      id="locations"
                      value={newItinerary.locations?.join(", ") || ""}
                      onChange={handleLocationsChange}
                      placeholder="e.g. Paris, Rome, Barcelona"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="season">Season</Label>
                      <Select
                        value={newItinerary.season}
                        onValueChange={(value) => setNewItinerary({ ...newItinerary, season: value })}
                      >
                        <SelectTrigger id="season">
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

                    <div className="space-y-2">
                      <Label htmlFor="isCompleted">Status</Label>
                      <Select
                        value={newItinerary.isCompleted ? "completed" : "planned"}
                        onValueChange={(value) =>
                          setNewItinerary({ ...newItinerary, isCompleted: value === "completed" })
                        }
                      >
                        <SelectTrigger id="isCompleted">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Image</Label>
                    <ImageUpload
                      initialImage={newItinerary.image}
                      onImageChange={(imageData) => setNewItinerary({ ...newItinerary, image: imageData })}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    {editingItinerary && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingItinerary(null)
                          setNewItinerary({
                            destination: "",
                            description: "",
                            startDate: "",
                            endDate: "",
                            image: "",
                            locations: [],
                            season: "summer",
                            isCompleted: false,
                            days: [],
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                      {editingItinerary ? "Update Itinerary" : "Add Itinerary"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-bold mt-8 mb-4">Manage Itineraries</h2>

            {itineraries.length === 0 ? (
              <p className="text-gray-500">No itineraries found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itineraries.map((itinerary) => (
                  <Card key={itinerary.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={getImageUrl(itinerary.image) || "/placeholder.svg"}
                        alt={itinerary.destination}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=300&width=300"
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-bold">{itinerary.destination}</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                        {new Date(itinerary.endDate).toLocaleDateString()}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Button size="sm" variant="outline" onClick={() => handleEditItinerary(itinerary)}>
                          Edit Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/itinerary/${itinerary.id}`)}
                        >
                          Edit Days
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteItinerary(itinerary.id)}>
                          Delete
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        variant="link"
                        className="p-0"
                        onClick={() => router.push(`/itinerary/${itinerary.id}`)}
                      >
                        View Itinerary
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "companions" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingCompanion ? "Edit Companion" : "Add New Companion"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompanionSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newCompanion.name}
                      onChange={(e) => setNewCompanion({ ...newCompanion, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={newCompanion.relationship}
                      onChange={(e) => setNewCompanion({ ...newCompanion, relationship: e.target.value })}
                      placeholder="e.g. Friend, Family, Tour Guide"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={newCompanion.bio}
                      onChange={(e) => setNewCompanion({ ...newCompanion, bio: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Image</Label>
                    <ImageUpload
                      initialImage={newCompanion.image}
                      onImageChange={(imageData) => setNewCompanion({ ...newCompanion, image: imageData })}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    {editingCompanion && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingCompanion(null)
                          setNewCompanion({
                            name: "",
                            relationship: "",
                            bio: "",
                            image: "",
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={loading}>
                      {editingCompanion ? "Update Companion" : "Add Companion"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-bold mt-8 mb-4">Manage Companions</h2>

            {companions.length === 0 ? (
              <p className="text-gray-500">No companions found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companions.map((companion) => (
                  <Card key={companion.id} className="overflow-hidden">
                    <div className="aspect-square bg-gray-100 relative">
                      <img
                        src={getImageUrl(companion.image) || "/placeholder.svg"}
                        alt={companion.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=300&width=300"
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-bold">{companion.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{companion.relationship}</p>

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditCompanion(companion)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCompanion(companion.id)}>
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
