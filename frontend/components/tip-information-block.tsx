"use client"

import { useState } from "react"
import { Lightbulb, DollarSign, Shield, MapPin, Car, Home, Plus, Edit, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TipItem } from "@/lib/models"

interface TipInformationBlockProps {
  destination?: string
  tips: TipItem[]
  onUpdateTips?: (tips: TipItem[]) => void
  isAdmin?: boolean
  readOnly?: boolean
}

const tipIcons = {
  "money-saving": DollarSign,
  safety: Shield,
  cultural: MapPin,
  transportation: Car,
  accommodation: Home,
  general: Lightbulb,
}

const tipCategories = [
  { value: "money-saving", label: "Money Saving" },
  { value: "safety", label: "Safety" },
  { value: "cultural", label: "Cultural" },
  { value: "transportation", label: "Transportation" },
  { value: "accommodation", label: "Accommodation" },
  { value: "general", label: "General" },
]

export function TipInformationBlock({
  destination,
  tips,
  onUpdateTips,
  isAdmin = false,
  readOnly = false,
}: TipInformationBlockProps) {
  const [editingTipId, setEditingTipId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [editingDescription, setEditingDescription] = useState("")
  const [editingCategory, setEditingCategory] = useState<TipItem["category"]>("general")
  const [newTipTitle, setNewTipTitle] = useState("")
  const [newTipDescription, setNewTipDescription] = useState("")
  const [newTipCategory, setNewTipCategory] = useState<TipItem["category"]>("general")

  const startEditing = (tip: TipItem) => {
    setEditingTipId(tip.id)
    setEditingTitle(tip.title)
    setEditingDescription(tip.description)
    setEditingCategory(tip.category)
  }

  const saveEditing = () => {
    if (!editingTipId || !onUpdateTips) return

    const updatedTips = tips.map((tip) =>
      tip.id === editingTipId
        ? { ...tip, title: editingTitle, description: editingDescription, category: editingCategory }
        : tip,
    )

    onUpdateTips(updatedTips)
    setEditingTipId(null)
  }

  const deleteTip = (id: string) => {
    if (!onUpdateTips) return
    const updatedTips = tips.filter((tip) => tip.id !== id)
    onUpdateTips(updatedTips)
  }

  const addNewTip = () => {
    if (!newTipTitle.trim() || !newTipDescription.trim() || !onUpdateTips) return

    const newTip: TipItem = {
      id: Date.now().toString(),
      title: newTipTitle,
      description: newTipDescription,
      category: newTipCategory,
    }

    onUpdateTips([...tips, newTip])
    setNewTipTitle("")
    setNewTipDescription("")
    setNewTipCategory("general")
  }

  if (tips.length === 0 && !isAdmin) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          {destination ? `${destination} Travel Tips` : "Travel Tips"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tips.length === 0 && isAdmin ? (
          <p className="text-center text-sm text-muted-foreground mb-4">
            No travel tips have been added yet. Add some helpful tips for travelers!
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tips.map((tip) => {
              const IconComponent = tipIcons[tip.category]

              return (
                <div
                  key={tip.id}
                  className="rounded-lg border p-4 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20"
                >
                  {editingTipId === tip.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder="Tip title"
                      />
                      <Textarea
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        placeholder="Tip description"
                        rows={3}
                      />
                      <Select
                        value={editingCategory}
                        onValueChange={(value: TipItem["category"]) => setEditingCategory(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingTipId(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={saveEditing}>
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-white dark:bg-gray-800 p-2 shadow-sm">
                          <IconComponent className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{tip.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{tip.description}</p>
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                            {tipCategories.find((cat) => cat.value === tip.category)?.label}
                          </span>
                        </div>
                        {isAdmin && onUpdateTips && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditing(tip)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => deleteTip(tip.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {isAdmin && onUpdateTips && (
          <div className="mt-6 space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h4 className="font-medium">Add New Travel Tip</h4>
            <Input value={newTipTitle} onChange={(e) => setNewTipTitle(e.target.value)} placeholder="Tip title" />
            <Textarea
              value={newTipDescription}
              onChange={(e) => setNewTipDescription(e.target.value)}
              placeholder="Tip description"
              rows={3}
            />
            <Select value={newTipCategory} onValueChange={(value: TipItem["category"]) => setNewTipCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {tipCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addNewTip} className="w-full">
              <Plus className="h-4 w-4 mr-1" />
              Add Travel Tip
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
