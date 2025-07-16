"use client"

import { useState } from "react"
import { Check, Plus, X, Edit2, Trash2, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { ChecklistItem } from "@/lib/models"

interface PreTripChecklistProps {
  destination: string
  items: ChecklistItem[]
  onToggleItem?: (itemId: string) => void
  onUpdateItems?: (items: ChecklistItem[]) => void
  readOnly?: boolean
  isAdmin?: boolean
}

const defaultChecklistItems = [
  "Check passport validity (6+ months)",
  "Apply for visa if required",
  "Book flights and accommodation",
  "Get travel insurance",
  "Notify bank of travel plans",
  "Pack essentials and medications",
  "Download offline maps",
  "Check weather forecast",
  "Exchange currency",
  "Backup important documents",
]

export function PreTripChecklist({
  destination,
  items,
  onToggleItem,
  onUpdateItems,
  readOnly = false,
  isAdmin = false,
}: PreTripChecklistProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editableItems, setEditableItems] = useState<ChecklistItem[]>(items)
  const [newItemText, setNewItemText] = useState("")

  const handleToggleItem = (itemId: string) => {
    if (onToggleItem && !readOnly) {
      onToggleItem(itemId)
    }
  }

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false,
      }
      const updatedItems = [...editableItems, newItem]
      setEditableItems(updatedItems)
      setNewItemText("")
    }
  }

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = editableItems.filter((item) => item.id !== itemId)
    setEditableItems(updatedItems)
  }

  const handleToggleEditItem = (itemId: string) => {
    const updatedItems = editableItems.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    )
    setEditableItems(updatedItems)
  }

  const handleSaveChanges = () => {
    if (onUpdateItems) {
      onUpdateItems(editableItems)
    }
    setIsEditing(false)
  }

  const handleAddDefaultItems = () => {
    const existingTexts = editableItems.map((item) => item.text.toLowerCase())
    const newItems = defaultChecklistItems
      .filter((text) => !existingTexts.includes(text.toLowerCase()))
      .map((text) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text,
        completed: false,
      }))

    setEditableItems([...editableItems, ...newItems])
  }

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length

  if (items.length === 0 && !isAdmin) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-600" />
            Pre-Trip Checklist for {destination}
          </CardTitle>
          {isAdmin && (
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditableItems(items)
                      setIsEditing(false)
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveChanges}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        {totalCount > 0 && (
          <div className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} items completed
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdmin && isEditing ? (
          <>
            {/* Admin Edit Mode */}
            <div className="space-y-3">
              {editableItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg border">
                  <Checkbox checked={item.completed} onCheckedChange={() => handleToggleEditItem(item.id)} />
                  <span className="flex-1">{item.text}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add new item */}
            <div className="flex gap-2 pt-4 border-t">
              <Input
                placeholder="Add new checklist item..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
              />
              <Button onClick={handleAddItem} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add default items button */}
            {editableItems.length === 0 && (
              <Button variant="outline" onClick={handleAddDefaultItems} className="w-full bg-transparent">
                Add Default Checklist Items
              </Button>
            )}
          </>
        ) : (
          <>
            {/* User View Mode */}
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      item.completed
                        ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <button
                      onClick={() => handleToggleItem(item.id)}
                      disabled={readOnly}
                      className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                        item.completed
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-gray-300 hover:border-emerald-600"
                      } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {item.completed && <Check className="h-3 w-3" />}
                    </button>
                    <span
                      className={`flex-1 ${
                        item.completed ? "text-emerald-700 dark:text-emerald-300" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No checklist items have been added yet.</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
