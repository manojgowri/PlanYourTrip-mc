"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, Trash2, LogOut, Check, Star } from "lucide-react"
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

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: number; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      setIsAuthenticated(true)
    } else {
      // Redirect to login if not authenticated
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    router.push("/")
  }

  const handleSaveChanges = () => {
    // In a real app, this would save to a database or localStorage when offline
    toast({
      title: "Changes saved",
      description: isOfflineMode
        ? "Your changes have been saved locally and will sync when you're back online."
        : "Your changes have been saved successfully.",
    })
  }

  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode)
    toast({
      title: isOfflineMode ? "Online Mode Activated" : "Offline Mode Activated",
      description: isOfflineMode
        ? "Changes will be saved directly to the database."
        : "Changes will be saved locally and synced when you're back online.",
    })
  }

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      toast({
        title: "Item deleted",
        description: `${itemToDelete.name} has been deleted successfully.`,
      })
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const confirmDelete = (type: string, id: number, name: string) => {
    setItemToDelete({ type, id, name })
    setDeleteDialogOpen(true)
  }

  const markAsComplete = (id: number, name: string) => {
    toast({
      title: "Trip marked as complete",
      description: `${name} has been marked as completed.`,
    })
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
        <Link href="/" className="flex items-center gap-2 text-emerald-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Travel Plans
        </Link>

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

      <Tabs defaultValue="destinations">
        <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="details">Trip Details</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="companions">Companions</TabsTrigger>
        </TabsList>

        <TabsContent value="destinations" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold">My Destinations</h2>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Destination
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, name: "Vietnam", dates: "May 15-30, 2023", status: "online", rating: 4.7 },
                  { id: 2, name: "Thailand", dates: "December 10-25, 2022", status: "completed", rating: 4.9 },
                  { id: 3, name: "Japan", dates: "March 5-20, 2022", status: "completed", rating: 4.8 },
                ].map((destination) => (
                  <div key={destination.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{destination.name}</h3>
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
                        <p className="text-sm text-muted-foreground">{destination.dates}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-medium">{destination.rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex gap-2">
                        {destination.status === "online" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => markAsComplete(destination.id, destination.name)}
                          >
                            <Check className="h-4 w-4" />
                            Complete
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete("destination", destination.id, destination.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Vietnam Trip Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input id="destination" defaultValue="Vietnam" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover-image">Cover Image URL</Label>
                  <Input id="cover-image" defaultValue="/placeholder.svg?height=300&width=400" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" defaultValue="2023-05-15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" defaultValue="2023-05-30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="season">Season</Label>
                  <Select defaultValue="spring">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trip Status</Label>
                <Select defaultValue="online">
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
                  defaultValue="Exploring the beauty of Vietnam - from bustling cities to serene landscapes."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold">Locations</h2>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, name: "Hanoi", dates: "May 15-17" },
                  { id: 2, name: "Ha Long Bay", dates: "May 18-19" },
                  { id: 3, name: "Hoi An", dates: "May 20-24" },
                  { id: 4, name: "Ho Chi Minh City", dates: "May 25-30" },
                ].map((location) => (
                  <div key={location.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">{location.dates}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accommodations" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold">Accommodations</h2>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Accommodation
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, name: "Hanoi La Siesta Hotel & Spa", location: "Hanoi", dates: "May 15-17" },
                  { id: 2, name: "Paradise Suites Hotel", location: "Ha Long Bay", dates: "May 18-19" },
                  { id: 3, name: "Allegro Hoi An", location: "Hoi An", dates: "May 20-24" },
                  { id: 4, name: "Hotel des Arts Saigon", location: "Ho Chi Minh City", dates: "May 25-30" },
                ].map((hotel) => (
                  <div key={hotel.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <h3 className="font-medium">{hotel.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {hotel.location} • {hotel.dates}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete("accommodation", hotel.id, hotel.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companions" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold">Travel Companions</h2>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Companion
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, name: "Sarah Johnson", relationship: "Best Friend", image: "/placeholder.svg" },
                  { id: 2, name: "Michael Chen", relationship: "College Friend", image: "/placeholder.svg" },
                  { id: 3, name: "Emma Rodriguez", relationship: "Sister", image: "/placeholder.svg" },
                  { id: 4, name: "David Kim", relationship: "Hiking Partner", image: "/placeholder.svg" },
                  { id: 5, name: "Priya Patel", relationship: "Foodie Friend", image: "/placeholder.svg" },
                ].map((companion) => (
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
                      <Button variant="outline" size="sm">
                        Edit
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Daily Itinerary</h2>

        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium">Day 1 - May 15, 2023</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
              <Button variant="destructive" size="sm" onClick={() => confirmDelete("day", 1, "Day 1")}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, time: "09:00 AM", title: "Arrival at Noi Bai International Airport", type: "travel" },
                { id: 2, time: "12:00 PM", title: "Lunch at Bún Chả Hương Liên", type: "food" },
                { id: 3, time: "02:00 PM", title: "Old Quarter Walking Tour", type: "activity" },
                { id: 4, time: "06:00 PM", title: "Dinner at Cha Ca La Vong", type: "food" },
              ].map((activity) => (
                <div key={activity.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium">{activity.time}</div>
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <div className="flex items-center gap-1">
                        <Select defaultValue={activity.type}>
                          <SelectTrigger className="h-7 w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="activity">Activity</SelectItem>
                            <SelectItem value="accommodation">Accommodation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete("activity", activity.id, activity.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Add New Day
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
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
