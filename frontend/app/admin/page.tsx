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
import { BackToTravelButton } from "@/components/back-to-travel-button"
import {
  getItineraries,
  saveItinerary,
  deleteItinerary,
  getCompanions,
  saveCompanion,
  deleteCompanion,
  getAuthToken,
} from "@/lib/data"
import type { Itinerary, Companion } from "@/lib/models"
import { getPlaceholderImage } from "@/lib/image-utils"

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
    startTime: "",
    endTime: "",
    image: "",
    locations: [],
    season: "summer",
    status: "online",
    days: [],
    travellersCount: 1,
  })

  const [newCompanion, setNewCompanion] = useState<Partial<Companion>>({
    name: "",
    relationship: "",
    bio: "",
    image: "",
    instagramUrl: "",
    location: "",
    travelsSince: "",
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

      const [itinerariesData, companionsData] = await Promise.all([getItineraries(), getCompanions()])

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
        await saveItinerary({
          ...editingItinerary,
          ...newItinerary,
          locations: newItinerary.locations || [],
          days: editingItinerary.days || [],
        } as Itinerary)
      } else {
        // Create new itinerary
        await saveItinerary({
          ...newItinerary,
          locations: newItinerary.locations || [],
          days: [],
        } as Itinerary)
      }

      // Reset form and reload data
      setNewItinerary({
        destination: "",
        description: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        image: "",
        locations: [],
        season: "summer",
        status: "online",
        days: [],
        travellersCount: 1,
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
        await saveCompanion({
          ...editingCompanion,
          ...newCompanion,
        } as Companion)
      } else {
        // Create new companion
        await saveCompanion(newCompanion as Companion)
      }

      // Reset form and reload data
      setNewCompanion({
        name: "",
        relationship: "",
        bio: "",
        image: "",
        instagramUrl: "",
        location: "",
        travelsSince: "",
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
      startTime: itinerary.startTime || "",
      endTime: itinerary.endTime || "",
      image: itinerary.image || "",
      locations: itinerary.locations || [],
      season: itinerary.season || "summer",
      status: itinerary.status || "online",
      travellersCount: itinerary.travellersCount || 1,
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
      instagramUrl: companion.instagramUrl || "",
      location: companion.location || "",
      travelsSince: companion.travelsSince || "",
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("authToken")
              router.push("/")
            }}
          >
            Logout
          </Button>
          <BackToTravelButton />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeTab === "itineraries" ? "default" : "outline"}
          onClick={() => setActiveTab("itineraries")}
        >
          Itineraries
        </Button>
        <Button variant={activeTab === "companions" ? "default" : "outline"} onClick={() => setActiveTab("companions")}>
          Companions
        </Button>
        <Button
          variant={activeTab === "database" ? "default" : "outline"}
          onClick={() => router.push("/admin/db-test")}
        >
          Test Database
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Site
        </Button>
      </div>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newItinerary.startTime}
                        onChange={(e) => setNewItinerary({ ...newItinerary, startTime: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newItinerary.endTime}
                        onChange={(e) => setNewItinerary({ ...newItinerary, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travellersCount">Number of Travellers</Label>
                    <Input
                      id="travellersCount"
                      type="number"
                      min="1"
                      value={newItinerary.travellersCount}
                      onChange={(e) =>
                        setNewItinerary({ ...newItinerary, travellersCount: Number.parseInt(e.target.value) || 1 })
                      }
                    />
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
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newItinerary.status}
                        onValueChange={(value: "online" | "completed") =>
                          setNewItinerary({ ...newItinerary, status: value })
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Planned</SelectItem>
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
                            startTime: "",
                            endTime: "",
                            image: "",
                            locations: [],
                            season: "summer",
                            status: "online",
                            days: [],
                            travellersCount: 1,
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
                        src={itinerary.image || getPlaceholderImage(400, 300)}
                        alt={itinerary.destination}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = getPlaceholderImage(400, 300)
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-bold">{itinerary.destination}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                        {new Date(itinerary.endDate).toLocaleDateString()}
                      </p>
                      {itinerary.travellersCount && itinerary.travellersCount > 1 && (
                        <p className="text-sm text-gray-500 mb-4">{itinerary.travellersCount} travellers</p>
                      )}

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
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newCompanion.location}
                      onChange={(e) => setNewCompanion({ ...newCompanion, location: e.target.value })}
                      placeholder="e.g. New York, USA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelsSince">Travels Since</Label>
                    <Input
                      id="travelsSince"
                      value={newCompanion.travelsSince}
                      onChange={(e) => setNewCompanion({ ...newCompanion, travelsSince: e.target.value })}
                      placeholder="e.g. 2020"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input
                      id="instagramUrl"
                      value={newCompanion.instagramUrl}
                      onChange={(e) => setNewCompanion({ ...newCompanion, instagramUrl: e.target.value })}
                      placeholder="https://instagram.com/username"
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
                            instagramUrl: "",
                            location: "",
                            travelsSince: "",
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
                        src={companion.image || getPlaceholderImage(300, 300)}
                        alt={companion.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = getPlaceholderImage(300, 300)
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
