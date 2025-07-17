"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, Instagram, X } from "lucide-react"
import { fetchCompanions, createCompanion, updateCompanion, deleteCompanion } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { SafeImage } from "@/components/safe-image"
import type { Companion } from "@/lib/models"

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [newCompanion, setNewCompanion] = useState<Partial<Companion>>({
    name: "",
    relation: "",
    image: "",
    instagramId: "",
  })
  const [editingCompanion, setEditingCompanion] = useState<Companion | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCompanions()
  }, [])

  const loadCompanions = async () => {
    try {
      const data = await fetchCompanions()
      setCompanions(data)
    } catch (error) {
      console.error("Failed to fetch companions:", error)
      toast({
        title: "Error",
        description: "Failed to load companions. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingCompanion) {
      setEditingCompanion({ ...editingCompanion, [name]: value })
    } else {
      setNewCompanion({ ...newCompanion, [name]: value })
    }
  }

  const handleSaveCompanion = async () => {
    try {
      if (editingCompanion) {
        const updated = await updateCompanion(editingCompanion._id, editingCompanion)
        if (updated) {
          setCompanions(companions.map((c) => (c._id === updated._id ? updated : c)))
          toast({
            title: "Success",
            description: "Companion updated successfully!",
          })
        }
      } else {
        const created = await createCompanion(newCompanion)
        if (created) {
          setCompanions([...companions, created])
          toast({
            title: "Success",
            description: "Companion added successfully!",
          })
        }
      }
      setIsDialogOpen(false)
      setNewCompanion({ name: "", relation: "", image: "", instagramId: "" })
      setEditingCompanion(null)
    } catch (error) {
      console.error("Failed to save companion:", error)
      toast({
        title: "Error",
        description: "Failed to save companion. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCompanion = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this companion?")) {
      try {
        const success = await deleteCompanion(id)
        if (success) {
          setCompanions(companions.filter((c) => c._id !== id))
          toast({
            title: "Success",
            description: "Companion deleted successfully!",
          })
        } else {
          throw new Error("Failed to delete companion")
        }
      } catch (error) {
        console.error("Failed to delete companion:", error)
        toast({
          title: "Error",
          description: "Failed to delete companion. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const openEditDialog = (companion: Companion) => {
    setEditingCompanion(companion)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setNewCompanion({ name: "", relation: "", image: "", instagramId: "" })
    setEditingCompanion(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Travel Companions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Companion
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px]"
            onEscapeKeyDown={handleDialogClose}
            onPointerDownOutside={handleDialogClose}
          >
            <DialogHeader>
              <DialogTitle>{editingCompanion ? "Edit Companion" : "Add New Companion"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editingCompanion ? editingCompanion.name : newCompanion.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relation" className="text-right">
                  Relation
                </Label>
                <Input
                  id="relation"
                  name="relation"
                  value={editingCompanion ? editingCompanion.relation : newCompanion.relation}
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
                  value={editingCompanion ? editingCompanion.image || "" : newCompanion.image || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instagramId" className="text-right">
                  Instagram ID
                </Label>
                <Input
                  id="instagramId"
                  name="instagramId"
                  value={editingCompanion ? editingCompanion.instagramId || "" : newCompanion.instagramId || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button onClick={handleSaveCompanion}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {companions.length > 0 ? (
          companions.map((companion) => (
            <Card key={companion._id} className="relative overflow-hidden rounded-lg shadow-md">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 text-red-500 hover:bg-red-100"
                onClick={() => handleDeleteCompanion(companion._id)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Delete companion</span>
              </Button>
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <SafeImage
                    src={companion.image || "/placeholder.svg?height=200&width=200"}
                    alt={companion.name}
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="p-4">
                  <CardTitle className="text-xl font-semibold mb-1">{companion.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">{companion.relation}</p>
                  {companion.instagramId && (
                    <a
                      href={`https://instagram.com/${companion.instagramId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-500 hover:underline text-sm"
                    >
                      <Instagram className="h-4 w-4 mr-1" />@{companion.instagramId}
                    </a>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full bg-transparent"
                    onClick={() => openEditDialog(companion)}
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No companions added yet.</p>
        )}
      </div>
    </div>
  )
}
