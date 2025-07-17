"use client"

import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminNav } from "@/components/admin/admin-nav"
import { Users, Plane, Database } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"
import {
  getItineraries,
  saveItinerary,
  deleteItinerary,
  testDatabaseConnection,
  checkServerHealth,
  markItineraryAsComplete,
} from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { SafeImage } from "@/components/safe-image"
import type { Itinerary } from "@/lib/models"

export default function AdminDashboardPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null)
  const [newItinerary, setNewItinerary] = useState<Partial<Itinerary>>({
    destination: "",
    startDate: "",
    endDate: "",
    totalBudget: 0,
    travellersCount: 1,
    category: "Adventure",
    status: "online",
    image: "",
    description: "",
    season: "",
    locations: [],
    rating: 0,
    reviewsCount: 0,
    days: [],
    accommodations: [],
    preTripChecklist: [],
    tips: [],
  })
  const [dbStatus, setDbStatus] = useState<string | null>(null)
  const [serverStatus, setServerStatus] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadItineraries()
    checkStatuses()
  }, [])

  const loadItineraries = async () => {
    try {
      const data = await getItineraries()
      setItineraries(data)
    } catch (error) {
      console.error("Failed to fetch itineraries:", error)
      toast({
        title: "Error",
        description: "Failed to load itineraries. Please try again.",
        variant: "destructive",
      })
    }
  }

  const checkStatuses = async () => {
    try {
      const dbRes = await testDatabaseConnection()
      setDbStatus(dbRes.message)
    } catch (error) {
      setDbStatus("Failed to connect")
      console.error("DB connection test failed:", error)
    }

    try {
      const serverRes = await checkServerHealth()
      setServerStatus(serverRes.message)
    } catch (error) {
      setServerStatus("Server unhealthy")
      console.error("Server health check failed:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editingItinerary) {
      setEditingItinerary({ ...editingItinerary, [name]: value })
    } else {
      setNewItinerary({ ...newItinerary, [name]: value })
    }
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value)
    if (editingItinerary) {
      setEditingItinerary({ ...editingItinerary, [name]: numValue })
    } else {
      setNewItinerary({ ...newItinerary, [name]: numValue })
    }
  }

  const handleSaveItinerary = async () => {
    try {
      const itineraryToSave = editingItinerary || newItinerary
      const saved = await saveItinerary(itineraryToSave as Itinerary)
      if (saved) {
        toast({
          title: "Success",
          description: "Itinerary saved successfully!",
        })
        setIsDialogOpen(false)
        setEditingItinerary(null)
        setNewItinerary({
          destination: "",
          startDate: "",
          endDate: "",
          totalBudget: 0,
          travellersCount: 1,
          category: "Adventure",
          status: "online",
          image: "",
          description: "",
          season: "",
          locations: [],
          rating: 0,
          reviewsCount: 0,
          days: [],
          accommodations: [],
          preTripChecklist: [],
          tips: [],
        })
        loadItineraries() // Reload list to show changes
      } else {
        throw new Error("Failed to save itinerary")
      }
    } catch (error) {
      console.error("Failed to save itinerary:", error)
      toast({
        title: "Error",
        description: "Failed to save itinerary. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItinerary = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      try {
        const success = await deleteItinerary(id)
        if (success) {
          toast({
            title: "Success",
            description: "Itinerary deleted successfully!",
          })
          loadItineraries() // Reload list
        } else {
          throw new Error("Failed to delete itinerary")
        }
      } catch (error) {
        console.error("Failed to delete itinerary:", error)
        toast({
          title: "Error",
          description: "Failed to delete itinerary. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleMarkComplete = async (id: string) => {
    try {
      const updatedItinerary = await markItineraryAsComplete(id)
      if (updatedItinerary) {
        toast({
          title: "Success",
          description: `Itinerary "${updatedItinerary.destination}" marked as complete!`,
        })
        loadItineraries()
      } else {
        throw new Error("Failed to mark itinerary as complete")
      }
    } catch (error) {
      console.error("Failed to mark itinerary complete:", error)
      toast({
        title: "Error",
        description: "Failed to mark itinerary as complete. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (itinerary: Itinerary) => {
    setEditingItinerary(itinerary)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingItinerary(null)
    setNewItinerary({
      destination: "",
      startDate: "",
      endDate: "",
      totalBudget: 0,
      travellersCount: 1,
      category: "Adventure",
      status: "online",
      image: "",
      description: "",
      season: "",
      locations: [],
      rating: 0,
      reviewsCount: 0,
      days: [],
      accommodations: [],
      preTripChecklist: [],
      tips: [],
    })
  }

  return (
    <div className="container mx-auto p-4">
      <AdminNav />
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/itinerary/new">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-medium">Manage Itineraries</CardTitle>
              <Plane className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Create, edit, and delete travel itineraries.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-medium">Manage Users</CardTitle>
              <Users className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View and manage user accounts.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/db-test">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-medium">Database Test</CardTitle>
              <Database className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Test database connection and operations.</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {dbStatus === "Connected to MongoDB" ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              {dbStatus || "Checking..."}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Health</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {serverStatus === "Server is healthy" ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              {serverStatus || "Checking..."}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Travellers</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itineraries.length > 0 ? (
              itineraries.map((itinerary) => (
                <TableRow key={itinerary._id}>
                  <TableCell>
                    <SafeImage
                      src={itinerary.image || "/placeholder.svg?height=50&width=50"}
                      alt={itinerary.destination}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{itinerary.destination}</TableCell>
                  <TableCell>
                    {itinerary.startDate} to {itinerary.endDate}
                  </TableCell>
                  <TableCell>₹{itinerary.totalBudget?.toLocaleString()}</TableCell>
                  <TableCell>{itinerary.travellersCount}</TableCell>
                  <TableCell>{itinerary.category}</TableCell>
                  <TableCell>{itinerary.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/itinerary/${itinerary._id}`} passHref>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                      <Link href={`/admin/itinerary/${itinerary._id}`} passHref>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                          <Plane className="h-4 w-4" />
                          <span className="sr-only">Manage Details</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => openEditDialog(itinerary)}
                      >
                        <Plane className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteItinerary(itinerary._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No itineraries found. Add a new one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Itinerary
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[600px]"
          onEscapeKeyDown={handleDialogClose}
          onPointerDownOutside={handleDialogClose}
        >
          <DialogHeader>
            <DialogTitle>{editingItinerary ? "Edit Itinerary" : "Add New Itinerary"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destination" className="text-right">
                Destination
              </Label>
              <Input
                id="destination"
                name="destination"
                value={editingItinerary?.destination || newItinerary.destination || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editingItinerary?.description || newItinerary.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                name="image"
                value={editingItinerary?.image || newItinerary.image || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={editingItinerary?.startDate || newItinerary.startDate || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={editingItinerary?.endDate || newItinerary.endDate || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalBudget" className="text-right">
                Total Budget
              </Label>
              <Input
                id="totalBudget"
                name="totalBudget"
                type="number"
                value={editingItinerary?.totalBudget || newItinerary.totalBudget || 0}
                onChange={handleNumberInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="travellersCount" className="text-right">
                Travellers
              </Label>
              <Input
                id="travellersCount"
                name="travellersCount"
                type="number"
                value={editingItinerary?.travellersCount || newItinerary.travellersCount || 1}
                onChange={handleNumberInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                value={editingItinerary?.category || newItinerary.category || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="season" className="text-right">
                Season
              </Label>
              <Input
                id="season"
                name="season"
                value={editingItinerary?.season || newItinerary.season || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locations" className="text-right">
                Locations (comma-separated)
              </Label>
              <Input
                id="locations"
                name="locations"
                value={editingItinerary?.locations?.join(", ") || newItinerary.locations?.join(", ") || ""}
                onChange={(e) => {
                  const locationsArray = e.target.value.split(",").map((loc) => loc.trim())
                  if (editingItinerary) {
                    setEditingItinerary({ ...editingItinerary, locations: locationsArray })
                  } else {
                    setNewItinerary({ ...newItinerary, locations: locationsArray })
                  }
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating (0-5)
              </Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={editingItinerary?.rating || newItinerary.rating || 0}
                onChange={handleNumberInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reviewsCount" className="text-right">
                Reviews Count
              </Label>
              <Input
                id="reviewsCount"
                name="reviewsCount"
                type="number"
                value={editingItinerary?.reviewsCount || newItinerary.reviewsCount || 0}
                onChange={handleNumberInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveItinerary}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
