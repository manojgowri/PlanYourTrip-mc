"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, X } from "lucide-react"
import { fetchCompanions, createCompanion, updateCompanion, deleteCompanion } from "@/lib/data"
import type { Companion } from "@/lib/models"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { SafeImage } from "@/components/safe-image"

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null)
  const [newCompanion, setNewCompanion] = useState({ name: "", title: "", image: "", instagramId: "" })
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const getCompanions = async () => {
      const data = await fetchCompanions()
      setCompanions(data)
      if (data.length > 0) {
        setSelectedCompanion(data[0])
      }
    }
    getCompanions()
  }, [])

  const handleAddCompanion = async () => {
    if (!newCompanion.name || !newCompanion.title) {
      toast({
        title: "Error",
        description: "Name and Title are required.",
        variant: "destructive",
      })
      return
    }

    try {
      const createdCompanion = await createCompanion(newCompanion)
      if (createdCompanion) {
        setCompanions([...companions, createdCompanion])
        setNewCompanion({ name: "", title: "", image: "", instagramId: "" })
        setIsAdding(false)
        toast({
          title: "Success",
          description: "Companion added successfully.",
        })
      } else {
        throw new Error("Failed to create companion")
      }
    } catch (error) {
      console.error("Error adding companion:", error)
      toast({
        title: "Error",
        description: "Failed to add companion. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCompanion = async () => {
    if (!selectedCompanion) return

    try {
      const updated = await updateCompanion(selectedCompanion._id, selectedCompanion)
      if (updated) {
        setCompanions(companions.map((c) => (c._id === updated._id ? updated : c)))
        setIsEditing(false)
        toast({
          title: "Success",
          description: "Companion updated successfully.",
        })
      } else {
        throw new Error("Failed to update companion")
      }
    } catch (error) {
      console.error("Error updating companion:", error)
      toast({
        title: "Error",
        description: "Failed to update companion. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCompanion = async (id: string) => {
    try {
      const success = await deleteCompanion(id)
      if (success) {
        setCompanions(companions.filter((c) => c._id !== id))
        if (selectedCompanion?._id === id) {
          setSelectedCompanion(companions.length > 1 ? companions[0] : null)
        }
        toast({
          title: "Success",
          description: "Companion deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete companion")
      }
    } catch (error) {
      console.error("Error deleting companion:", error)
      toast({
        title: "Error",
        description: "Failed to delete companion. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white flex flex-col lg:flex-row">
      {/* Left Sidebar - Companion List */}
      <div className="w-full lg:w-1/3 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">Our Travel Fam</h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {companions.map((companion) => (
            <div
              key={companion._id}
              className={`p-6 border-b border-gray-800 cursor-pointer transition-colors duration-200 ${
                selectedCompanion?._id === companion._id ? "bg-gray-800" : "hover:bg-gray-900"
              }`}
              onClick={() => {
                setSelectedCompanion(companion)
                setIsAdding(false)
                setIsEditing(false)
              }}
            >
              <h3 className="text-lg font-semibold uppercase">{companion.name}</h3>
              {selectedCompanion?._id === companion._id && (
                <div className="text-sm text-gray-400">
                  <p>{companion.title}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    {companion.instagramId && (
                      <a
                        href={`https://instagram.com/${companion.instagramId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {/* Admin controls for delete */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation() // Prevent selecting companion when deleting
                        handleDeleteCompanion(companion._id)
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-gray-800">
          <Button
            onClick={() => {
              setIsAdding(true)
              setIsEditing(false)
              setSelectedCompanion(null)
              setNewCompanion({ name: "", title: "", image: "", instagramId: "" })
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white"
          >
            Add New Companion
          </Button>
        </div>
      </div>

      {/* Right Content - Companion Details / Add/Edit Form */}
      <div className="w-full lg:w-2/3 p-6 flex flex-col items-center justify-center bg-gray-950">
        {isAdding ? (
          <Card className="w-full max-w-md bg-gray-900 border-gray-700 text-white">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold mb-4">Add New Companion</h3>
              <Input
                placeholder="Name"
                value={newCompanion.name}
                onChange={(e) => setNewCompanion({ ...newCompanion, name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="Title (e.g., CEO, Vercel)"
                value={newCompanion.title}
                onChange={(e) => setNewCompanion({ ...newCompanion, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="Image URL (optional)"
                value={newCompanion.image}
                onChange={(e) => setNewCompanion({ ...newCompanion, image: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="Instagram ID (optional)"
                value={newCompanion.instagramId}
                onChange={(e) => setNewCompanion({ ...newCompanion, instagramId: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button onClick={handleAddCompanion} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Save Companion
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
                className="w-full text-gray-300 border-gray-700 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        ) : selectedCompanion ? (
          <div className="flex flex-col items-center space-y-6 w-full max-w-lg">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-gray-700">
              <SafeImage
                src={selectedCompanion.image || "/placeholder.svg?height=256&width=256"}
                alt={selectedCompanion.name}
                className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                fill
              />
            </div>
            <h2 className="text-4xl font-bold uppercase text-center">{selectedCompanion.name}</h2>
            <p className="text-xl text-gray-400 text-center">{selectedCompanion.title}</p>
            <div className="flex space-x-4">
              {selectedCompanion.instagramId && (
                <a
                  href={`https://instagram.com/${selectedCompanion.instagramId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Instagram className="h-8 w-8" />
                </a>
              )}
            </div>
            <Button onClick={() => setIsEditing(true)} className="bg-gray-700 hover:bg-gray-600 text-white">
              Edit Companion
            </Button>
          </div>
        ) : (
          <p className="text-gray-400">Select a companion or add a new one.</p>
        )}

        {isEditing && selectedCompanion && (
          <Card className="w-full max-w-md bg-gray-900 border-gray-700 text-white mt-6">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold mb-4">Edit Companion</h3>
              <Input
                placeholder="Name"
                value={selectedCompanion.name}
                onChange={(e) => setSelectedCompanion({ ...selectedCompanion, name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="Title (e.g., CEO, Vercel)"
                value={selectedCompanion.title}
                onChange={(e) => setSelectedCompanion({ ...selectedCompanion, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="Image URL (optional)"
                value={selectedCompanion.image}
                onChange={(e) => setSelectedCompanion({ ...selectedCompanion, image: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="Instagram ID (optional)"
                value={selectedCompanion.instagramId}
                onChange={(e) => setSelectedCompanion({ ...selectedCompanion, instagramId: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button onClick={handleUpdateCompanion} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="w-full text-gray-300 border-gray-700 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
