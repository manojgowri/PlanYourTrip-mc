"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Lightbulb, Wallet, Shield, Globe, Utensils, Camera } from "lucide-react"
import { updateItinerary } from "@/lib/data"
import type { Tip } from "@/lib/models"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface TipInformationBlockProps {
  itineraryId: string
  initialTips: Tip[]
  isAdmin: boolean
}

const tipCategories = [
  { value: "general", label: "General", icon: Lightbulb, color: "bg-blue-500" },
  { value: "money", label: "Money Saving", icon: Wallet, color: "bg-green-500" },
  { value: "safety", label: "Safety", icon: Shield, color: "bg-red-500" },
  { value: "culture", label: "Culture", icon: Globe, color: "bg-purple-500" },
  { value: "food", label: "Food", icon: Utensils, color: "bg-orange-500" },
  { value: "photography", label: "Photography", icon: Camera, color: "bg-yellow-500" },
]

export function TipInformationBlock({ itineraryId, initialTips, isAdmin }: TipInformationBlockProps) {
  const [tips, setTips] = useState<Tip[]>(initialTips)
  const [newTip, setNewTip] = useState({ title: "", content: "", category: "general" })
  const [editingTipId, setEditingTipId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setTips(initialTips)
  }, [initialTips])

  const handleAddTip = async () => {
    if (newTip.title.trim() === "" || newTip.content.trim() === "") return

    const newItem: Tip = {
      _id: `temp-${Date.now()}`, // Temporary ID for UI
      title: newTip.title.trim(),
      content: newTip.content.trim(),
      category: newTip.category,
    }

    const updatedTips = [...tips, newItem]
    setTips(updatedTips)
    setNewTip({ title: "", content: "", category: "general" })

    try {
      const response = await updateItinerary(itineraryId, { tips: updatedTips })
      if (response) {
        // Replace temporary ID with actual ID from backend if available
        const finalTips = updatedTips.map((item) =>
          item._id === newItem._id
            ? {
                ...item,
                _id:
                  response.tips?.find((t) => t.title === newItem.title && t.content === newItem.content)?._id ||
                  item._id,
              }
            : item,
        )
        setTips(finalTips)
        toast({
          title: "Tip Added",
          description: "New travel tip added successfully.",
        })
      } else {
        throw new Error("Failed to add tip to backend")
      }
    } catch (error) {
      console.error("Failed to add tip:", error)
      toast({
        title: "Error",
        description: "Failed to add tip. Please try again.",
        variant: "destructive",
      })
      // Revert on error
      setTips(initialTips)
    }
  }

  const handleUpdateTip = async (id: string) => {
    const tipToUpdate = tips.find((tip) => tip._id === id)
    if (!tipToUpdate) return

    try {
      await updateItinerary(itineraryId, { tips: tips }) // Send the whole updated array
      toast({
        title: "Tip Updated",
        description: "Travel tip updated successfully.",
      })
      setEditingTipId(null)
    } catch (error) {
      console.error("Failed to update tip:", error)
      toast({
        title: "Error",
        description: "Failed to update tip. Please try again.",
        variant: "destructive",
      })
      // Revert on error
      setTips(initialTips)
    }
  }

  const handleDeleteTip = async (id: string) => {
    const updatedTips = tips.filter((tip) => tip._id !== id)
    setTips(updatedTips)

    try {
      await updateItinerary(itineraryId, { tips: updatedTips })
      toast({
        title: "Tip Removed",
        description: "Travel tip removed successfully.",
      })
    } catch (error) {
      console.error("Failed to delete tip:", error)
      toast({
        title: "Error",
        description: "Failed to remove tip. Please try again.",
        variant: "destructive",
      })
      // Revert on error
      setTips(initialTips)
    }
  }

  const getCategoryIcon = (category: string) => {
    const cat = tipCategories.find((c) => c.value === category)
    return cat ? <cat.icon className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />
  }

  const getCategoryColor = (category: string) => {
    const cat = tipCategories.find((c) => c.value === category)
    return cat ? cat.color : "bg-gray-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdmin && (
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-semibold">Add New Tip</h3>
            <Input
              placeholder="Tip Title"
              value={newTip.title}
              onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
            />
            <Textarea
              placeholder="Tip Content"
              value={newTip.content}
              onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
            />
            <Select value={newTip.category} onValueChange={(value) => setNewTip({ ...newTip, category: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {tipCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center">
                      {<cat.icon className={cn("mr-2 h-4 w-4", getCategoryColor(cat.value).replace("bg-", "text-"))} />}
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddTip} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Tip
            </Button>
          </div>
        )}

        {tips.length === 0 && <p className="text-muted-foreground">No tips added yet.</p>}

        <div className="grid gap-4">
          {tips.map((tip) => (
            <Card key={tip._id} className="relative overflow-hidden">
              <div className={cn("absolute inset-y-0 left-0 w-2", getCategoryColor(tip.category))}></div>
              <CardContent className="p-4 pl-6">
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (editingTipId === tip._id) {
                          handleUpdateTip(tip._id)
                        } else {
                          setEditingTipId(tip._id)
                          setNewTip({ title: tip.title, content: tip.content, category: tip.category })
                        }
                      }}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {editingTipId === tip._id ? "Save" : "Edit"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTip(tip._id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center mb-2">
                  <div className={cn("p-2 rounded-full mr-3 text-white", getCategoryColor(tip.category))}>
                    {getCategoryIcon(tip.category)}
                  </div>
                  {editingTipId === tip._id ? (
                    <Input
                      value={newTip.title}
                      onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold">{tip.title}</h3>
                  )}
                </div>
                {editingTipId === tip._id ? (
                  <Textarea
                    value={newTip.content}
                    onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                    className="text-sm text-muted-foreground"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{tip.content}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
