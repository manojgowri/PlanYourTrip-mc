"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, Trash2, LogOut, Check, Star, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  getItineraries,
  getItinerary,
  saveItinerary,
  deleteItinerary,
  getAccommodations,
  saveAccommodation,
  deleteAccommodation,
  getLocations,
  saveLocation,
  deleteLocation,
  getCompanions,
  saveCompanion,
  deleteCompanion,
  markItineraryAsComplete,
  addDayToItinerary,
  deleteDay,
  addActivityToDay,
  deleteActivity,
  generateId,
  type Itinerary,
  type Accommodation,
  type Location,
  type Companion,
  type ItineraryDay as ItineraryDayType,
  type Activity,
} from "@/lib/data"

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    type: string
    id: string
    name: string
    itineraryId?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [companions, setCompanions] = useState<Companion[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null)
  const [showItineraryForm, setShowItineraryForm] = useState(false)
  const [showDayForm, setShowDayForm] = useState(false)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [showAccommodationForm, setShowAccommodationForm] = useState(false)
  const [showCompanionForm, setShowCompanionForm] = useState(false)
  const [currentDay, setCurrentDay] = useState<ItineraryDayType | null>(null)
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [currentAccommodation, setCurrentAccommodation] = useState<Accommodation | null>(null)
  const [currentCompanion, setCurrentCompanion] = useState<Companion | null>(null)
  const [newItinerary, setNewItinerary] = useState<Partial<Itinerary>>({
    destination: "",
    description: "",
    image: "/placeholder.svg?height=300&width=400",
    startDate: "",
    endDate: "",
    status: "online",
    season: "Spring",
    locations: [],
    days: [],
  })
  const [newDay, setNewDay] = useState<Partial<ItineraryDayType>>({
    day: 1,
    date: "",
    location: "",
    activities: [],
  })
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    time: "",
    title: "",
    description: "",
    type: "activity",
    expense: {
      amount: 0,
      currency: "INR",
      category: "general",
    },
    image: "",
  })
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: "",
    dates: "",
  })
  const [newAccommodation, setNewAccommodation] = useState<Partial<Accommodation>>({
    name: "",
    location: "",
    dates: "",
  })
  const [newCompanion, setNewCompanion] = useState<Partial<Companion>>({
    name: "",
    relationship: "",
    bio: "",
    image: "/placeholder.svg?height=400&width=300",
  })

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      setIsAuthenticated(true)
      loadData()
    } else {
      // Redirect to login if not authenticated
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [itinerariesData, accommodationsData, locationsData, companionsData] = await Promise.all([
        getItineraries(),
        getAccommodations(),
        getLocations(),
        getCompanions(),
      ])

      setItineraries(itinerariesData)
      setAccommodations(accommodationsData)
      setLocations(locationsData)
      setCompanions(companionsData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error loading data",
        description: "There was a problem loading your data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    router.push("/")
  }

  const handleSaveChanges = async () => {
    try {
      // If we're in offline mode, we would sync the local changes
      // For now, we'll just show a success message
      toast({
        title: "Changes saved",
        description: isOfflineMode
          ? "Your changes have been saved locally and will sync when you're back online."
          : "Your changes have been saved successfully.",
      })

      // Refresh data to show the changes
      await loadData()
    } catch (error) {
      console.error("Error saving changes:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleOfflineMode = () => {
    const newMode = !isOfflineMode
    setIsOfflineMode(newMode)

    // Update UI immediately
    toast({
      title: newMode ? "Offline Mode Activated" : "Online Mode Activated",
      description: newMode
        ? "Changes will be saved locally and synced when you're back online."
        : "Changes will be saved directly to the database.",
    })

    // Save the mode to localStorage
    localStorage.setItem("offlineMode", newMode ? "true" : "false")
  }

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        switch (itemToDelete.type) {
          case "destination":
            await deleteItinerary(itemToDelete.id)
            setItineraries(await getItineraries())
            break
          case "location":
            await deleteLocation(itemToDelete.id)
            setLocations(await getLocations())
            break
          case "accommodation":
            await deleteAccommodation(itemToDelete.id)
            setAccommodations(await getAccommodations())
            break
          case "companion":
            await deleteCompanion(itemToDelete.id)
            setCompanions(await getCompanions())
            break
          case "day":
            if (itemToDelete.itineraryId) {
              await deleteDay(itemToDelete.itineraryId, itemToDelete.id)
              if (selectedItinerary) {
                const updated = await getItinerary(selectedItinerary.id)
                if (updated) setSelectedItinerary(updated)
              }
            }
            break
          case "activity":
            if (currentDay && itemToDelete.itineraryId) {
              await deleteActivity(itemToDelete.itineraryId, currentDay.id, itemToDelete.id)
              if (selectedItinerary) {
                const updated = await getItinerary(selectedItinerary.id)
                if (updated) setSelectedItinerary(updated)
              }
            }
            break
        }

        toast({
          title: "Item deleted",
          description: `${itemToDelete.name} has been deleted successfully.`,
        })
      } catch (error) {
        console.error("Error deleting item:", error)
        toast({
          title: "Error",
          description: "There was a problem deleting the item. Please try again.",
          variant: "destructive",
        })
      }

      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const confirmDelete = (type: string, id: string, name: string, itineraryId?: string) => {
    setItemToDelete({ type, id, name, itineraryId })
    setDeleteDialogOpen(true)
  }

  const markAsComplete = async (id: string, name: string) => {
    try {
      await markItineraryAsComplete(id)
      setItineraries(await getItineraries())
      toast({
        title: "Trip marked as complete",
        description: `${name} has been marked as completed.`,
      })
    } catch (error) {
      console.error("Error marking trip as complete:", error)
      toast({
        title: "Error",
        description: "There was a problem updating the trip status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddItinerary = async () => {
    if (!newItinerary.destination || !newItinerary.startDate || !newItinerary.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const itinerary: Itinerary = {
        id: generateId(),
        destination: newItinerary.destination || "",
        image: newItinerary.image || "/placeholder.svg?height=300&width=400",
        description: newItinerary.description || "",
        startDate: newItinerary.startDate || "",
        endDate: newItinerary.endDate || "",
        status: (newItinerary.status as "online" | "completed") || "online",
        season: (newItinerary.season as string) || "Spring",
        rating: 0,
        reviewCount: 0,
        locations: [],
        days: [],
      }

      await saveItinerary(itinerary)
      setItineraries(await getItineraries())
      setNewItinerary({
        destination: "",
        description: "",
        image: "/placeholder.svg?height=300&width=400",
        startDate: "",
        endDate: "",
        status: "online",
        season: "Spring",
        locations: [],
        days: [],
      })
      setShowItineraryForm(false)

      toast({
        title: "Itinerary added",
        description: `${itinerary.destination} has been added successfully.`,
      })
    } catch (error) {
      console.error("Error adding itinerary:", error)
      toast({
        title: "Error",
        description: "There was a problem adding the itinerary. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditItinerary = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary)
    setNewItinerary({
      destination: itinerary.destination,
      description: itinerary.description,
      image: itinerary.image,
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      status: itinerary.status,
      season: itinerary.season,
    })
    setShowItineraryForm(true)
  }

  const handleUpdateItinerary = async () => {
    if (!selectedItinerary) return

    try {
      const updatedItinerary: Itinerary = {
        ...selectedItinerary,
        destination: newItinerary.destination || selectedItinerary.destination,
        description: newItinerary.description || selectedItinerary.description,
        image: newItinerary.image || selectedItinerary.image,
        startDate: newItinerary.startDate || selectedItinerary.startDate,
        endDate: newItinerary.endDate || selectedItinerary.endDate,
        status: (newItinerary.status as "online" | "completed") || selectedItinerary.status,
        season: (newItinerary.season as string) || selectedItinerary.season,
      }

      await saveItinerary(updatedItinerary)
      setItineraries(await getItineraries())
      setSelectedItinerary(updatedItinerary)
      setShowItineraryForm(false)

      toast({
        title: "Itinerary updated",
        description: `${updatedItinerary.destination} has been updated successfully.`,
      })
    } catch (error) {
      console.error("Error updating itinerary:", error)
      toast({
        title: "Error",
        description: "There was a problem updating the itinerary. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddDay = async () => {
    if (!selectedItinerary || !newDay.date || !newDay.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const day: ItineraryDayType = {
        id: generateId(),
        day: newDay.day || 1,
        date: newDay.date || "",
        location: newDay.location || "",
        activities: [],
      }

      const updated = await addDayToItinerary(selectedItinerary.id, day)
      if (updated) setSelectedItinerary(updated)

      setNewDay({
        day: (selectedItinerary.days.length || 0) + 1,
        date: "",
        location: "",
        activities: [],
      })
      setShowDayForm(false)

      toast({
        title: "Day added",
        description: `Day ${day.day} has been added to ${selectedItinerary.destination}.`,
      })
    } catch (error) {
      console.error("Error adding day:", error)
      toast({
        title: "Error",
        description: "There was a problem adding the day. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddActivity = async () => {
    if (!currentDay || !selectedItinerary || !newActivity.time || !newActivity.title) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const activity: Activity = {
        id: generateId(),
        time: newActivity.time || "",
        title: newActivity.title || "",
        description: newActivity.description || "",
        type: (newActivity.type as "food" | "activity" | "travel" | "accommodation" | "must-visit") || "activity",
        expense: newActivity.expense || { amount: 0, currency: "INR", category: "general" },
        image: newActivity.image || "",
      }

      const updated = await addActivityToDay(selectedItinerary.id, currentDay.id, activity)
      if (updated) setSelectedItinerary(updated)

      setNewActivity({
        time: "",
        title: "",
        description: "",
        type: "activity",
        expense: {
          amount: 0,
          currency: "INR",
          category: "general",
        },
        image: "",
      })
      setShowActivityForm(false)

      toast({
        title: "Activity added",
        description: `${activity.title} has been added to Day ${currentDay.day}.`,
      })
    } catch (error) {
      console.error("Error adding activity:", error)
      toast({
        title: "Error",
        description: "There was a problem adding the activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddLocation = async () => {
    if (!selectedItinerary || !newLocation.name || !newLocation.dates) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const location: Location = {
        id: generateId(),
        name: newLocation.name || "",
        dates: newLocation.dates || "",
        destinationId: selectedItinerary.id,
      }

      await saveLocation(location)
      setLocations(await getLocations())

      // Update the itinerary's locations array
      const updatedItinerary = {
        ...selectedItinerary,
        locations: [...selectedItinerary.locations, location.name],
      }
      await saveItinerary(updatedItinerary)
      setSelectedItinerary(updatedItinerary)

      setNewLocation({
        name: "",
        dates: "",
      })
      setShowLocationForm(false)

      toast({
        title: "Location added",
        description: `${location.name} has been added to ${selectedItinerary.destination}.`,
      })
    } catch (error) {
      console.error("Error adding location:", error)
      toast({
        title: "Error",
        description: "There was a problem adding the location. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLocation = async () => {
    if (!currentLocation || !selectedItinerary) return

    try {
      const updatedLocation: Location = {
        ...currentLocation,
        name: newLocation.name || currentLocation.name,
        dates: newLocation.dates || currentLocation.dates,
      }

      await saveLocation(updatedLocation)
      setLocations(await getLocations())
      setShowLocationForm(false)

      toast({
        title: "Location updated",
        description: `${updatedLocation.name} has been updated successfully.`,
      })
    } catch (error) {
      console.error("Error updating location:", error)
      toast({
        title: "Error",
        description: "There was a problem updating the location. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddAccommodation = async () => {
    if (!selectedItinerary || !newAccommodation.name || !newAccommodation.location || !newAccommodation.dates) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const accommodation: Accommodation = {
        id: generateId(),
        name: newAccommodation.name || "",
        location: newAccommodation.location || "",
        dates: newAccommodation.dates || "",
        destinationId: selectedItinerary.id,
      }

      await saveAccommodation(accommodation)
      setAccommodations(await getAccommodations())

      setNewAccommodation({
        name: "",
        location: "",
        dates: "",
      })
      setShowAccommodationForm(false)

      toast({
        title: "Accommodation added",
        description: `${accommodation.name} has been added to ${selectedItinerary.destination}.`,
      })
    } catch (error) {
      console.error("Error adding accommodation:", error)
      toast({
        title: "Error",
        description: "There was a problem adding the accommodation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateAccommodation = async () => {
    if (!currentAccommodation) return

    try {
      const updatedAccommodation: Accommodation = {
        ...currentAccommodation,
        name: newAccommodation.name || currentAccommodation.name,
        location: newAccommodation.location || currentAccommodation.location,
        dates: newAccommodation.dates || currentAccommodation.dates,
      }

      await saveAccommodation(updatedAccommodation)
      setAccommodations(await getAccommodations())
      setShowAccommodationForm(false)

      toast({
        title: "Accommodation updated",
        description: `${updatedAccommodation.name} has been updated successfully.`,
      })
    } catch (error) {
      console.error("Error updating accommodation:", error)
      toast({
        title: "Error",
        description: "There was a problem updating the accommodation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddCompanion = async () => {
    if (!newCompanion.name || !newCompanion.relationship || !newCompanion.bio) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const companion: Companion = {
        id: generateId(),
        name: newCompanion.name || "",
        relationship: newCompanion.relationship || "",
        bio: newCompanion.bio || "",
        image: newCompanion.image || "/placeholder.svg?height=400&width=300",
      }

      await saveCompanion(companion)
      setCompanions(await getCompanions())

      setNewCompanion({
        name: "",
        relationship: "",
        bio: "",
        image: "/placeholder.svg?height=400&width=300",
      })
      setShowCompanionForm(false)

      toast({
        title: "Companion added",
        description: `${companion.name} has been added to your companions.`,
      })
    } catch (error) {
      console.error("Error adding companion:", error)
      toast({
        title: "Error",
        description: "There was a problem adding the companion. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCompanion = async () => {
    if (!currentCompanion) return

    try {
      const updatedCompanion: Companion = {
        ...currentCompanion,
        name: newCompanion.name || currentCompanion.name,
        relationship: newCompanion.relationship || currentCompanion.relationship,
        bio: newCompanion.bio || currentCompanion.bio,
        image: newCompanion.image || currentCompanion.image,
      }

      await saveCompanion(updatedCompanion)
      setCompanions(await getCompanions())
      setShowCompanionForm(false)

      toast({
        title: "Companion updated",
        description: `${updatedCompanion.name} has been updated successfully.`,
      })
    } catch (error) {
      console.error("Error updating companion:", error)
      toast({
        title: "Error",
        description: "There was a problem updating the companion. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditLocation = (location: Location) => {
    setCurrentLocation(location)
    setNewLocation({
      name: location.name,
      dates: location.dates,
    })
    setShowLocationForm(true)
  }

  const handleEditAccommodation = (accommodation: Accommodation) => {
    setCurrentAccommodation(accommodation)
    setNewAccommodation({
      name: accommodation.name,
      location: accommodation.location,
      dates: accommodation.dates,
    })
    setShowAccommodationForm(true)
  }

  const handleEditCompanion = (companion: Companion) => {
    setCurrentCompanion(companion)
    setNewCompanion({
      name: companion.name,
      relationship: companion.relationship,
      bio: companion.bio,
      image: companion.image,
    })
    setShowCompanionForm(true)
  }

  const handleSelectItinerary = async (itinerary: Itinerary) => {
    try {
      const fullItinerary = await getItinerary(itinerary.id)
      if (fullItinerary) {
        setSelectedItinerary(fullItinerary)
      }
    } catch (error) {
      console.error("Error selecting itinerary:", error)
      toast({
        title: "Error",
        description: "There was a problem loading the itinerary details. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-emerald-600 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Travel Plans
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isOfflineMode ? "bg-amber-500" : "bg-emerald-500"}`}></div>
            <span className="text-sm">{isOfflineMode ? "Offline Mode" : "Online Mode"}</span>
          </div>
          <Button variant="outline" size="sm" onClick={toggleOfflineMode}>
            Toggle Mode
          </Button>
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <h1 className="mb-6 text-3xl font-bold">Manage Travel Plans</h1>

      {selectedItinerary ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{selectedItinerary.destination} Details</h2>
            <Button variant="outline" onClick={() => setSelectedItinerary(null)}>
              Back to All Destinations
            </Button>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="details">Trip Details</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
              <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-semibold">{selectedItinerary.destination} Information</h2>
                  <Button size="sm" onClick={() => handleEditItinerary(selectedItinerary)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-medium">Destination</h3>
                      <p>{selectedItinerary.destination}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium">Cover Image</h3>
                      <div className="h-40 w-full overflow-hidden rounded-md">
                        <img
                          src={selectedItinerary.image || "/placeholder.svg"}
                          alt={selectedItinerary.destination}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <h3 className="mb-2 font-medium">Start Date</h3>
                      <p>{new Date(selectedItinerary.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium">End Date</h3>
                      <p>{new Date(selectedItinerary.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium">Season</h3>
                      <p>{selectedItinerary.season}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Trip Status</h3>
                    <Badge
                      className={`${
                        selectedItinerary.status === "online"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-emerald-500 hover:bg-emerald-600"
                      } text-white`}
                    >
                      {selectedItinerary.status === "online" ? "Online" : "Completed"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Description</h3>
                    <p>{selectedItinerary.description}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-semibold">Locations</h2>
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentLocation(null)
                      setNewLocation({ name: "", dates: "" })
                      setShowLocationForm(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Location
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {locations
                      .filter((location) => location.destinationId === selectedItinerary.id)
                      .map((location) => (
                        <div key={location.id} className="flex items-center justify-between rounded-md border p-3">
                          <div>
                            <h3 className="font-medium">{location.name}</h3>
                            <p className="text-sm text-muted-foreground">{location.dates}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditLocation(location)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete("location", location.id, location.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    {locations.filter((location) => location.destinationId === selectedItinerary.id).length === 0 && (
                      <p className="text-center text-muted-foreground">No locations added yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accommodations" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-semibold">Accommodations</h2>
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentAccommodation(null)
                      setNewAccommodation({ name: "", location: "", dates: "" })
                      setShowAccommodationForm(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Accommodation
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accommodations
                      .filter((accommodation) => accommodation.destinationId === selectedItinerary.id)
                      .map((accommodation) => (
                        <div key={accommodation.id} className="flex items-center justify-between rounded-md border p-3">
                          <div>
                            <h3 className="font-medium">{accommodation.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {accommodation.location} • {accommodation.dates}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditAccommodation(accommodation)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete("accommodation", accommodation.id, accommodation.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    {accommodations.filter((accommodation) => accommodation.destinationId === selectedItinerary.id)
                      .length === 0 && (
                      <p className="text-center text-muted-foreground">No accommodations added yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itinerary" className="space-y-6">
              <div className="flex justify-between">
                <h2 className="mb-4 text-xl font-semibold">Daily Itinerary</h2>
                <Button
                  onClick={() => {
                    setCurrentDay(null)
                    setNewDay({
                      day: (selectedItinerary.days.length || 0) + 1,
                      date: "",
                      location: "",
                      activities: [],
                    })
                    setShowDayForm(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Day
                </Button>
              </div>

              {selectedItinerary.days.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="mb-4 text-muted-foreground">No days added to this itinerary yet.</p>
                  <Button
                    onClick={() => {
                      setCurrentDay(null)
                      setNewDay({
                        day: 1,
                        date: "",
                        location: "",
                        activities: [],
                      })
                      setShowDayForm(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Day
                  </Button>
                </Card>
              ) : (
                selectedItinerary.days.map((day) => (
                  <Card key={day.id} className="mb-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <h3 className="text-lg font-medium">
                        Day {day.day} - {day.date}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentDay(day)
                            setNewActivity({
                              time: "",
                              title: "",
                              description: "",
                              type: "activity",
                              expense: {
                                amount: 0,
                                currency: "INR",
                                category: "general",
                              },
                              image: "",
                            })
                            setShowActivityForm(true)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Activity
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete("day", day.id, `Day ${day.day}`, selectedItinerary.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {day.activities.length === 0 ? (
                          <p className="text-center text-muted-foreground">No activities added for this day.</p>
                        ) : (
                          day.activities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between rounded-md border p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-24 text-sm font-medium">{activity.time}</div>
                                <div>
                                  <h4 className="font-medium">{activity.title}</h4>
                                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                                  <Badge variant="outline" className="mt-1">
                                    {activity.type}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    confirmDelete("activity", activity.id, activity.title, selectedItinerary.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Tabs defaultValue="destinations">
          <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="companions">Companions</TabsTrigger>
          </TabsList>

          <TabsContent value="destinations" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">My Destinations</h2>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedItinerary(null)
                    setNewItinerary({
                      destination: "",
                      description: "",
                      image: "/placeholder.svg?height=300&width=400",
                      startDate: "",
                      endDate: "",
                      status: "online",
                      season: "Spring",
                    })
                    setShowItineraryForm(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Destination
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itineraries.map((destination) => (
                    <div key={destination.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{destination.destination}</h3>
                            <Badge
                              className={`${
                                destination.status === "online"
                                  ? "bg-blue-500 hover:bg-blue-600"
                                  : "bg-emerald-500 hover:bg-emerald-600"
                              } text-white`}
                            >
                              {destination.status === "online" ? "Online" : "Completed"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(destination.startDate).toLocaleDateString()} -{" "}
                            {new Date(destination.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="font-medium">{destination.rating}</span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleSelectItinerary(destination)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Manage
                          </Button>
                          {destination.status === "online" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => markAsComplete(destination.id, destination.destination)}
                            >
                              <Check className="h-4 w-4" />
                              Complete
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete("destination", destination.id, destination.destination)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {itineraries.length === 0 && (
                    <p className="text-center text-muted-foreground">No destinations added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companions" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">Travel Companions</h2>
                <Button
                  size="sm"
                  onClick={() => {
                    setCurrentCompanion(null)
                    setNewCompanion({
                      name: "",
                      relationship: "",
                      bio: "",
                      image: "/placeholder.svg?height=400&width=300",
                    })
                    setShowCompanionForm(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Companion
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companions.map((companion) => (
                    <div key={companion.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                          <img
                            src={companion.image || "/placeholder.svg"}
                            alt={companion.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{companion.name}</h3>
                          <p className="text-sm text-muted-foreground">{companion.relationship}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCompanion(companion)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete("companion", companion.id, companion.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {companions.length === 0 && (
                    <p className="text-center text-muted-foreground">No companions added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Add/Edit Itinerary Dialog */}
      <Dialog open={showItineraryForm} onOpenChange={setShowItineraryForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedItinerary ? "Edit Itinerary" : "Add New Itinerary"}</DialogTitle>
            <DialogDescription>
              {selectedItinerary
                ? "Update the details for your travel itinerary."
                : "Fill in the details for your new travel destination."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={newItinerary.destination}
                  onChange={(e) => setNewItinerary({ ...newItinerary, destination: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover-image">Cover Image URL</Label>
                <Input
                  id="cover-image"
                  value={newItinerary.image}
                  onChange={(e) => setNewItinerary({ ...newItinerary, image: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newItinerary.startDate}
                  onChange={(e) => setNewItinerary({ ...newItinerary, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newItinerary.endDate}
                  onChange={(e) => setNewItinerary({ ...newItinerary, endDate: e.target.value })}
                />
              </div>
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
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                    <SelectItem value="Winter">Winter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trip Status</Label>
              <Select
                value={newItinerary.status}
                onValueChange={(value) => setNewItinerary({ ...newItinerary, status: value as "online" | "completed" })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online (In Progress)</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={newItinerary.description}
                onChange={(e) => setNewItinerary({ ...newItinerary, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItineraryForm(false)}>
              Cancel
            </Button>
            <Button onClick={selectedItinerary ? handleUpdateItinerary : handleAddItinerary}>
              {selectedItinerary ? "Update Itinerary" : "Add Itinerary"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Day Dialog */}
      <Dialog open={showDayForm} onOpenChange={setShowDayForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Day</DialogTitle>
            <DialogDescription>Add a new day to your itinerary.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day-number">Day Number</Label>
                <Input
                  id="day-number"
                  type="number"
                  value={newDay.day}
                  onChange={(e) => setNewDay({ ...newDay, day: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="day-date">Date</Label>
                <Input
                  id="day-date"
                  type="date"
                  value={newDay.date}
                  onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="day-location">Location</Label>
              <Input
                id="day-location"
                value={newDay.location}
                onChange={(e) => setNewDay({ ...newDay, location: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDayForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDay}>Add Day</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Activity Dialog */}
      <Dialog open={showActivityForm} onOpenChange={setShowActivityForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>Add a new activity to Day {currentDay?.day}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity-time">Time</Label>
                <Input
                  id="activity-time"
                  placeholder="e.g. 09:00 AM"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-type">Type</Label>
                <Select
                  value={newActivity.type}
                  onValueChange={(value) =>
                    setNewActivity({
                      ...newActivity,
                      type: value as "food" | "activity" | "travel" | "accommodation" | "must-visit",
                    })
                  }
                >
                  <SelectTrigger id="activity-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="must-visit">Must Visit Place</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity-title">Title</Label>
              <Input
                id="activity-title"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity-description">Description</Label>
              <Textarea
                id="activity-description"
                rows={2}
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddActivity}>Add Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Location Dialog */}
      <Dialog open={showLocationForm} onOpenChange={setShowLocationForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentLocation ? "Edit Location" : "Add New Location"}</DialogTitle>
            <DialogDescription>
              {currentLocation ? "Edit the details for this location." : "Add a new location to your destination."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location-name">Name</Label>
              <Input
                id="location-name"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location-dates">Dates</Label>
              <Input
                id="location-dates"
                placeholder="e.g. Jan 1 - Jan 7"
                value={newLocation.dates}
                onChange={(e) => setNewLocation({ ...newLocation, dates: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLocationForm(false)}>
              Cancel
            </Button>
            <Button onClick={currentLocation ? handleUpdateLocation : handleAddLocation}>
              {currentLocation ? "Update Location" : "Add Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Accommodation Dialog */}
      <Dialog open={showAccommodationForm} onOpenChange={setShowAccommodationForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentAccommodation ? "Edit Accommodation" : "Add New Accommodation"}</DialogTitle>
            <DialogDescription>
              {currentAccommodation
                ? "Edit the details for this accommodation."
                : "Add a new accommodation to your destination."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accommodation-name">Name</Label>
              <Input
                id="accommodation-name"
                value={newAccommodation.name}
                onChange={(e) => setNewAccommodation({ ...newAccommodation, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accommodation-location">Location</Label>
              <Input
                id="accommodation-location"
                value={newAccommodation.location}
                onChange={(e) => setNewAccommodation({ ...newAccommodation, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accommodation-dates">Dates</Label>
              <Input
                id="accommodation-dates"
                placeholder="e.g. Jan 1 - Jan 7"
                value={newAccommodation.dates}
                onChange={(e) => setNewAccommodation({ ...newAccommodation, dates: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAccommodationForm(false)}>
              Cancel
            </Button>
            <Button onClick={currentAccommodation ? handleUpdateAccommodation : handleAddAccommodation}>
              {currentAccommodation ? "Update Accommodation" : "Add Accommodation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Companion Dialog */}
      <Dialog open={showCompanionForm} onOpenChange={setShowCompanionForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentCompanion ? "Edit Companion" : "Add New Companion"}</DialogTitle>
            <DialogDescription>
              {currentCompanion
                ? "Edit the details for this travel companion."
                : "Add a new travel companion to your list."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companion-name">Name</Label>
              <Input
                id="companion-name"
                value={newCompanion.name}
                onChange={(e) => setNewCompanion({ ...newCompanion, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companion-relationship">Relationship</Label>
              <Input
                id="companion-relationship"
                value={newCompanion.relationship}
                onChange={(e) => setNewCompanion({ ...newCompanion, relationship: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companion-bio">Bio</Label>
              <Textarea
                id="companion-bio"
                rows={3}
                value={newCompanion.bio}
                onChange={(e) => setNewCompanion({ ...newCompanion, bio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companion-image">Image URL</Label>
              <Input
                id="companion-image"
                value={newCompanion.image}
                onChange={(e) => setNewCompanion({ ...newCompanion, image: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompanionForm(false)}>
              Cancel
            </Button>
            <Button onClick={currentCompanion ? handleUpdateCompanion : handleAddCompanion}>
              {currentCompanion ? "Update Companion" : "Add Companion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {itemToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
