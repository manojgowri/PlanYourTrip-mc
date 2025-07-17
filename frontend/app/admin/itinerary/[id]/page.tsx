"use client"

import type React from "react"

import {
  getItineraryById,
  addAccommodation,
  updateAccommodation,
  deleteAccommodation,
  addChecklistItem,
  deleteChecklistItem,
  addTip,
  updateTip,
  deleteTip,
} from "@/lib/data"
import { notFound } from "next/navigation"
import { ItineraryDay } from "@/components/itinerary-day"
import { ExpenseSummary } from "@/components/expense-summary"
import { BackToTravelButton } from "@/components/back-to-travel-button"
import { CommentSection } from "@/components/comment-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/safe-image"
import { MapPin, Calendar, Users, DollarSign, Star, ListChecks, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Itinerary, Accommodation, ChecklistItem, Tip } from "@/lib/models"

interface AdminItineraryPageProps {
  params: { id: string }
}

export default async function AdminItineraryPage({ params }: AdminItineraryPageProps) {
  const { id } = params
  const itinerary = await getItineraryById(id)

  if (!itinerary) {
    notFound()
  }

  return <AdminItineraryPageContent initialItinerary={itinerary} />
}

function AdminItineraryPageContent({ initialItinerary }: { initialItinerary: Itinerary }) {
  const [itinerary, setItinerary] = useState<Itinerary>(initialItinerary)
  const [isAccommodationDialogOpen, setIsAccommodationDialogOpen] = useState(false)
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null)
  const [newAccommodation, setNewAccommodation] = useState<Partial<Accommodation>>({
    name: "",
    type: "",
    checkInDate: "",
    checkOutDate: "",
    cost: 0,
    bookingConfirmation: "",
  })

  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false)
  const [newChecklistItem, setNewChecklistItem] = useState<Partial<ChecklistItem>>({ item: "", completed: false })

  const [isTipDialogOpen, setIsTipDialogOpen] = useState(false)
  const [editingTip, setEditingTip] = useState<Tip | null>(null)
  const [newTip, setNewTip] = useState<Partial<Tip>>({ title: "", content: "" })

  const { toast } = useToast()
  const isAdmin = true // This is the admin page

  const refreshItinerary = async () => {
    try {
      const updatedData = await getItineraryById(itinerary._id)
      setItinerary(updatedData)
    } catch (error) {
      console.error("Failed to refresh itinerary:", error)
      toast({
        title: "Error",
        description: "Failed to refresh itinerary data.",
        variant: "destructive",
      })
    }
  }

  // Accommodation Handlers
  const handleAccommodationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingAccommodation) {
      setEditingAccommodation({ ...editingAccommodation, [name]: value })
    } else {
      setNewAccommodation({ ...newAccommodation, [name]: value })
    }
  }

  const handleAccommodationNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value)
    if (editingAccommodation) {
      setEditingAccommodation({ ...editingAccommodation, [name]: numValue })
    } else {
      setNewAccommodation({ ...newAccommodation, [name]: numValue })
    }
  }

  const handleSaveAccommodation = async () => {
    try {
      const accommodationToSave = editingAccommodation || newAccommodation
      if (accommodationToSave._id) {
        await updateAccommodation(itinerary._id, accommodationToSave._id, accommodationToSave as Accommodation)
        toast({ title: "Success", description: "Accommodation updated successfully!" })
      } else {
        await addAccommodation(itinerary._id, accommodationToSave as Accommodation)
        toast({ title: "Success", description: "Accommodation added successfully!" })
      }
      setIsAccommodationDialogOpen(false)
      setEditingAccommodation(null)
      setNewAccommodation({ name: "", type: "", checkInDate: "", checkOutDate: "", cost: 0, bookingConfirmation: "" })
      refreshItinerary()
    } catch (error) {
      console.error("Failed to save accommodation:", error)
      toast({ title: "Error", description: "Failed to save accommodation. Please try again.", variant: "destructive" })
    }
  }

  const handleDeleteAccommodation = async (accommodationId: string) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      try {
        await deleteAccommodation(itinerary._id, accommodationId)
        toast({ title: "Success", description: "Accommodation deleted successfully!" })
        refreshItinerary()
      } catch (error) {
        console.error("Failed to delete accommodation:", error)
        toast({
          title: "Error",
          description: "Failed to delete accommodation. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const openAccommodationEditDialog = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation)
    setIsAccommodationDialogOpen(true)
  }

  const handleAccommodationDialogClose = () => {
    setIsAccommodationDialogOpen(false)
    setEditingAccommodation(null)
    setNewAccommodation({ name: "", type: "", checkInDate: "", checkOutDate: "", cost: 0, bookingConfirmation: "" })
  }

  // Checklist Handlers
  const handleChecklistItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChecklistItem({ ...newChecklistItem, item: e.target.value })
  }

  const handleAddChecklistItem = async () => {
    if (!newChecklistItem.item?.trim()) {
      toast({ title: "Error", description: "Checklist item cannot be empty.", variant: "destructive" })
      return
    }
    try {
      await addChecklistItem(itinerary._id, { item: newChecklistItem.item, completed: false } as ChecklistItem)
      toast({ title: "Success", description: "Checklist item added successfully!" })
      setIsChecklistDialogOpen(false)
      setNewChecklistItem({ item: "", completed: false })
      refreshItinerary()
    } catch (error) {
      console.error("Failed to add checklist item:", error)
      toast({ title: "Error", description: "Failed to add checklist item. Please try again.", variant: "destructive" })
    }
  }

  const handleDeleteChecklistItem = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this checklist item?")) {
      try {
        await deleteChecklistItem(itinerary._id, itemId)
        toast({ title: "Success", description: "Checklist item deleted successfully!" })
        refreshItinerary()
      } catch (error) {
        console.error("Failed to delete checklist item:", error)
        toast({
          title: "Error",
          description: "Failed to delete checklist item. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Tip Handlers
  const handleTipInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editingTip) {
      setEditingTip({ ...editingTip, [name]: value })
    } else {
      setNewTip({ ...newTip, [name]: value })
    }
  }

  const handleSaveTip = async () => {
    try {
      const tipToSave = editingTip || newTip
      if (!tipToSave.title?.trim() || !tipToSave.content?.trim()) {
        toast({ title: "Error", description: "Tip title and content cannot be empty.", variant: "destructive" })
        return
      }
      if (tipToSave._id) {
        await updateTip(itinerary._id, tipToSave._id, tipToSave as Tip)
        toast({ title: "Success", description: "Tip updated successfully!" })
      } else {
        await addTip(itinerary._id, tipToSave as Tip)
        toast({ title: "Success", description: "Tip added successfully!" })
      }
      setIsTipDialogOpen(false)
      setEditingTip(null)
      setNewTip({ title: "", content: "" })
      refreshItinerary()
    } catch (error) {
      console.error("Failed to save tip:", error)
      toast({ title: "Error", description: "Failed to save tip. Please try again.", variant: "destructive" })
    }
  }

  const handleDeleteTip = async (tipId: string) => {
    if (window.confirm("Are you sure you want to delete this tip?")) {
      try {
        await deleteTip(itinerary._id, tipId)
        toast({ title: "Success", description: "Tip deleted successfully!" })
        refreshItinerary()
      } catch (error) {
        console.error("Failed to delete tip:", error)
        toast({ title: "Error", description: "Failed to delete tip. Please try again.", variant: "destructive" })
      }
    }
  }

  const openTipEditDialog = (tip: Tip) => {
    setEditingTip(tip)
    setIsTipDialogOpen(true)
  }

  const handleTipDialogClose = () => {
    setIsTipDialogOpen(false)
    setEditingTip(null)
    setNewTip({ title: "", content: "" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToTravelButton />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">{itinerary.destination} (Admin View)</h1>
        {itinerary.image && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6 shadow-lg">
            <SafeImage src={itinerary.image} alt={itinerary.destination} className="object-cover w-full h-full" />
          </div>
        )}
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">{itinerary.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dates</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {itinerary.startDate} - {itinerary.endDate}
            </div>
            <p className="text-xs text-muted-foreground">{itinerary.days.length} Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Travellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itinerary.travellersCount}</div>
            <p className="text-xs text-muted-foreground">People</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{itinerary.totalBudget?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Category</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{itinerary.category}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itinerary.rating?.toFixed(1)} / 5</div>
            <p className="text-xs text-muted-foreground">{itinerary.reviewsCount} Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={itinerary.status === "completed" ? "default" : "secondary"}>{itinerary.status}</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="itinerary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="checklist-tips">Checklist & Tips</TabsTrigger>
        </TabsList>
        <TabsContent value="itinerary" className="space-y-6 mt-6">
          <h2 className="text-3xl font-bold mb-4">Itinerary Details</h2>
          {itinerary.days.map((day, index) => (
            <ItineraryDay key={index} day={day} dayNumber={index + 1} isAdmin={isAdmin} itineraryId={itinerary._id} />
          ))}
          <ExpenseSummary expenses={itinerary.expenses || []} />
        </TabsContent>
        <TabsContent value="accommodations" className="space-y-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">Accommodations</h2>
            <Dialog open={isAccommodationDialogOpen} onOpenChange={setIsAccommodationDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAccommodationDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Accommodation
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[600px]"
                onEscapeKeyDown={handleAccommodationDialogClose}
                onPointerDownOutside={handleAccommodationDialogClose}
              >
                <DialogHeader>
                  <DialogTitle>{editingAccommodation ? "Edit Accommodation" : "Add New Accommodation"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="acc-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="acc-name"
                      name="name"
                      value={editingAccommodation?.name || newAccommodation.name || ""}
                      onChange={handleAccommodationInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="acc-type" className="text-right">
                      Type
                    </Label>
                    <Input
                      id="acc-type"
                      name="type"
                      value={editingAccommodation?.type || newAccommodation.type || ""}
                      onChange={handleAccommodationInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="acc-checkin" className="text-right">
                      Check-in Date
                    </Label>
                    <Input
                      id="acc-checkin"
                      name="checkInDate"
                      type="date"
                      value={editingAccommodation?.checkInDate || newAccommodation.checkInDate || ""}
                      onChange={handleAccommodationInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="acc-checkout" className="text-right">
                      Check-out Date
                    </Label>
                    <Input
                      id="acc-checkout"
                      name="checkOutDate"
                      type="date"
                      value={editingAccommodation?.checkOutDate || newAccommodation.checkOutDate || ""}
                      onChange={handleAccommodationInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="acc-cost" className="text-right">
                      Cost
                    </Label>
                    <Input
                      id="acc-cost"
                      name="cost"
                      type="number"
                      value={editingAccommodation?.cost || newAccommodation.cost || 0}
                      onChange={handleAccommodationNumberChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="acc-confirmation" className="text-right">
                      Confirmation
                    </Label>
                    <Input
                      id="acc-confirmation"
                      name="bookingConfirmation"
                      value={editingAccommodation?.bookingConfirmation || newAccommodation.bookingConfirmation || ""}
                      onChange={handleAccommodationInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleAccommodationDialogClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAccommodation}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardContent className="p-0">
              {itinerary.accommodations && itinerary.accommodations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itinerary.accommodations.map((acc) => (
                      <TableRow key={acc._id}>
                        <TableCell className="font-medium">{acc.name}</TableCell>
                        <TableCell>{acc.type}</TableCell>
                        <TableCell>
                          {acc.checkInDate} - {acc.checkOutDate}
                        </TableCell>
                        <TableCell className="text-right">₹{acc.cost?.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => openAccommodationEditDialog(acc)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteAccommodation(acc._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">No accommodations added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="checklist-tips" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Pre-Trip Checklist</CardTitle>
              <Dialog open={isChecklistDialogOpen} onOpenChange={setIsChecklistDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setIsChecklistDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Checklist Item</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="checklist-item" className="text-right">
                        Item
                      </Label>
                      <Input
                        id="checklist-item"
                        value={newChecklistItem.item || ""}
                        onChange={handleChecklistItemChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsChecklistDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddChecklistItem}>Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-4">
              {itinerary.preTripChecklist && itinerary.preTripChecklist.length > 0 ? (
                <ul className="space-y-2">
                  {itinerary.preTripChecklist.map((item) => (
                    <li key={item._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={item.completed} disabled className="h-4 w-4" />
                        <span className={item.completed ? "line-through text-muted-foreground" : ""}>{item.item}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDeleteChecklistItem(item._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center">No checklist items available.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Travel Tips</CardTitle>
              <Dialog open={isTipDialogOpen} onOpenChange={setIsTipDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setIsTipDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Tip
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[600px]"
                  onEscapeKeyDown={handleTipDialogClose}
                  onPointerDownOutside={handleTipDialogClose}
                >
                  <DialogHeader>
                    <DialogTitle>{editingTip ? "Edit Tip" : "Add New Tip"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tip-title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="tip-title"
                        name="title"
                        value={editingTip?.title || newTip.title || ""}
                        onChange={handleTipInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tip-content" className="text-right">
                        Content
                      </Label>
                      <Textarea
                        id="tip-content"
                        name="content"
                        value={editingTip?.content || newTip.content || ""}
                        onChange={handleTipInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleTipDialogClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveTip}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-4">
              {itinerary.tips && itinerary.tips.length > 0 ? (
                <div className="space-y-4">
                  {itinerary.tips.map((tip) => (
                    <div key={tip._id} className="border rounded-md p-3 flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 bg-transparent"
                          onClick={() => openTipEditDialog(tip)}
                        >
                          <Edit className="h-3 w-3" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleDeleteTip(tip._id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center">No tips added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <CommentSection itineraryId={itinerary._id} />
    </div>
  )
}
