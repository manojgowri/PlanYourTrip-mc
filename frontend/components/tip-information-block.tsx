"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addTip, deleteTip } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { Tip } from "@/lib/models"
import { PlusCircle, Trash2 } from "lucide-react"

interface TipInformationBlockProps {
  itineraryId: string
  initialTips: Tip[]
  isAdmin: boolean
}

export function TipInformationBlock({ itineraryId, initialTips, isAdmin }: TipInformationBlockProps) {
  const [tips, setTips] = useState<Tip[]>(initialTips)
  const [newTip, setNewTip] = useState({ title: "", content: "" })
  const { toast } = useToast()

  useEffect(() => {
    setTips(initialTips)
  }, [initialTips])

  const handleAddTip = async () => {
    if (isAdmin) {
      toast({
        title: "Admin Mode",
        description: "Tips can only be updated by users in view mode.",
        variant: "default",
      })
      return
    }

    if (!newTip.title.trim() || !newTip.content.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter both a title and content for the tip.",
        variant: "destructive",
      })
      return
    }

    const tipToAdd: Tip = {
      _id: `temp-${Date.now()}`, // Temporary ID for optimistic update
      title: newTip.title.trim(),
      content: newTip.content.trim(),
    }

    setTips((prev) => [...prev, tipToAdd])
    setNewTip({ title: "", content: "" })

    try {
      const updatedItinerary = await addTip(itineraryId, tipToAdd.title, tipToAdd.content)
      if (updatedItinerary) {
        // Replace temporary ID with actual ID from server
        setTips((prev) =>
          prev.map((tip) =>
            tip._id === tipToAdd._id
              ? updatedItinerary.tips.find((t) => t.title === tipToAdd.title && t.content === tipToAdd.content) || tip
              : tip,
          ),
        )
        toast({
          title: "Tip Added",
          description: `Tip "${tipToAdd.title}" added successfully.`,
        })
      } else {
        throw new Error("Failed to add tip on server.")
      }
    } catch (error) {
      console.error("Error adding tip:", error)
      toast({
        title: "Error",
        description: "Failed to add tip. Please try again.",
        variant: "destructive",
      })
      // Revert optimistic update on error
      setTips((prev) => prev.filter((tip) => tip._id !== tipToAdd._id))
    }
  }

  const handleDeleteTip = async (tipId: string) => {
    if (isAdmin) {
      toast({
        title: "Admin Mode",
        description: "Tips can only be updated by users in view mode.",
        variant: "default",
      })
      return
    }

    const originalTips = tips
    setTips((prev) => prev.filter((tip) => tip._id !== tipId))

    try {
      const updatedItinerary = await deleteTip(itineraryId, tipId)
      if (!updatedItinerary) {
        throw new Error("Failed to delete tip on server.")
      }
      toast({
        title: "Tip Deleted",
        description: "Tip removed successfully.",
      })
    } catch (error) {
      console.error("Error deleting tip:", error)
      toast({
        title: "Error",
        description: "Failed to delete tip. Please try again.",
        variant: "destructive",
      })
      // Revert optimistic update on error
      setTips(originalTips)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Tips & Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 mb-4">
          {tips.length === 0 ? (
            <p className="text-muted-foreground text-sm">No tips added yet.</p>
          ) : (
            tips.map((tip) => (
              <div key={tip._id} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-base">{tip.title}</h3>
                  {!isAdmin && (
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTip(tip._id)} className="h-6 w-6">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete tip</span>
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{tip.content}</p>
              </div>
            ))
          )}
        </div>
        {!isAdmin && (
          <div className="mt-4 space-y-2">
            <div>
              <Label htmlFor="new-tip-title" className="sr-only">
                Tip Title
              </Label>
              <Input
                id="new-tip-title"
                placeholder="Tip title"
                value={newTip.title}
                onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="new-tip-content" className="sr-only">
                Tip Content
              </Label>
              <Textarea
                id="new-tip-content"
                placeholder="Tip content"
                value={newTip.content}
                onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                rows={3}
              />
            </div>
            <Button onClick={handleAddTip} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Tip
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
