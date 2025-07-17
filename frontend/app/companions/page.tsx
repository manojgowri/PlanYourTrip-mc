"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import { getCompanions, saveCompanion, deleteCompanion } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { SafeImage } from "@/components/safe-image"
import type { Companion } from "@/lib/models"

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompanion, setEditingCompanion] = useState<Companion | null>(null)
  const [newCompanion, setNewCompanion] = useState<Partial<Companion>>({
    name: "",
    relation: "",
    contact: "",
    image: "",
    notes: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadCompanions()
  }, [])

  const loadCompanions = async () => {
    try {
      const data = await getCompanions()
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editingCompanion) {
      setEditingCompanion({ ...editingCompanion, [name]: value })
    } else {
      setNewCompanion({ ...newCompanion, [name]: value })
    }
  }

  const handleSaveCompanion = async () => {
    try {
      const companionToSave = editingCompanion || newCompanion
      if (!companionToSave.name || !companionToSave.relation || !companionToSave.contact) {
        toast({
          title: "Error",
          description: "Name, relation, and contact are required.",
          variant: "destructive",
        })
        return
      }

      const saved = await saveCompanion(companionToSave as Companion)
      if (saved) {
        toast({
          title: "Success",
          description: "Companion saved successfully!",
        })
        setIsDialogOpen(false)
        setEditingCompanion(null)
        setNewCompanion({
          name: "",
          relation: "",
          contact: "",
          image: "",
          notes: "",
        })
        loadCompanions() // Reload list to show changes
      } else {
        throw new Error("Failed to save companion")
      }
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
          toast({
            title: "Success",
            description: "Companion deleted successfully!",
          })
          loadCompanions() // Reload list
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
    setEditingCompanion(null)
    setNewCompanion({
      name: "",
      relation: "",
      contact: "",
      image: "",
      notes: "",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Travel Companions</h1>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Manage Companions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Companion
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[600px]"
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
                  value={editingCompanion?.name || newCompanion.name || ""}
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
                  value={editingCompanion?.relation || newCompanion.relation || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  value={editingCompanion?.contact || newCompanion.contact || ""}
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
                  value={editingCompanion?.image || newCompanion.image || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={editingCompanion?.notes || newCompanion.notes || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button onClick={handleSaveCompanion}>{editingCompanion ? "Save Changes" : "Add Companion"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Relation</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companions.length > 0 ? (
              companions.map((companion) => (
                <TableRow key={companion._id}>
                  <TableCell>
                    <SafeImage
                      src={companion.image || "/placeholder.svg?height=50&width=50"}
                      alt={companion.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{companion.name}</TableCell>
                  <TableCell>{companion.relation}</TableCell>
                  <TableCell>{companion.contact}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{companion.notes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => openEditDialog(companion)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteCompanion(companion._id)}
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
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No companions found. Add a new one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
