"use client"

import { useState } from "react"
import { Check, Plus, X, Edit2, Save, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { ChecklistItem } from "@/lib/models"

interface PreTripChecklistProps {
  destination: string
  items: ChecklistItem[]
  onToggleItem?: (id: string) => void
  onAddItem?: (item: Omit<ChecklistItem, "id">) => void
  onEditItem?: (id: string, item: Partial<ChecklistItem>) => void
  onDeleteItem?: (id: string) => void
  readOnly?: boolean
  isAdmin?: boolean
}

const defaultChecklistItems = [
  { text: "Check passport validity (6+ months)", category: "documents" },
  { text: "Apply for visa if required", category: "documents" },
  { text: "Book flight tickets", category: "travel" },
  { text: "Reserve accommodation", category: "travel" },
  { text: "Get travel insurance", category: "insurance" },
  { text: "Notify bank of travel plans", category: "financial" },
  { text: "Pack essential medications", category: "health" },
  { text: "Check vaccination requirements", category: "health" },
  { text: "Download offline maps", category: "preparation" },
  { text: "Inform family/friends of itinerary", category: "safety" },
]

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "documents":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    case "travel":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    case "insurance":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
    case "financial":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    case "health":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    case "preparation":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
    case "safety":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }
}

export function PreTripChecklist({
  destination,
  items,
  onToggleItem,
  onAddItem,
  onEditItem,
  onDeleteItem,
  readOnly = false,
  isAdmin = false,
}: PreTripChecklistProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [newItemText, setNewItemText] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("preparation")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const handleToggleSelection = (itemId: string) => {
    if (isAdmin) {
      const newSelected = new Set(selectedItems)
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId)
      } else {
        newSelected.add(itemId)
      }
      setSelectedItems(newSelected)
    } else if (onToggleItem) {
      onToggleItem(itemId)
    }
  }

  const handleAddItem = () => {
    if (newItemText.trim() && onAddItem) {
      onAddItem({
        text: newItemText.trim(),
        category: newItemCategory,
        completed: false,
      })
      setNewItemText("")
      setNewItemCategory("preparation")
    }
  }

  const handleSaveEdit = (itemId: string) => {
    if (editText.trim() && onEditItem) {
      onEditItem(itemId, { text: editText.trim() })
      setEditingItem(null)
      setEditText("")
    }
  }

  const startEdit = (item: ChecklistItem) => {
    setEditingItem(item.id)
    setEditText(item.text)
  }

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-emerald-600" />
            <CardTitle>Pre-Trip Checklist for {destination}</CardTitle>
          </div>
          {!readOnly && (
            <Badge variant="outline">
              {completedCount}/{totalCount} completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Admin: Default Items Selection */}
        {isAdmin && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Select items to include in the checklist:</h4>
            <div className="grid grid-cols-1 gap-2">
              {defaultChecklistItems.map((item, index) => {
                const itemId = `default-${index}`
                const isSelected = selectedItems.has(itemId)
                return (
                  <div
                    key={itemId}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handleToggleSelection(itemId)}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <span className={isSelected ? "text-emerald-700 dark:text-emerald-300" : ""}>{item.text}</span>
                      <Badge className={`ml-2 ${getCategoryColor(item.category)}`} variant="secondary">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* User: Saved Checklist Items */}
        {!isAdmin && items.length > 0 && (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  item.completed
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <button
                  onClick={() => handleToggleSelection(item.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    item.completed
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 dark:border-gray-600 hover:border-green-400"
                  }`}
                  disabled={readOnly}
                >
                  {item.completed && <Check className="h-3 w-3" />}
                </button>
                <div className="flex-1">
                  {editingItem === item.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(item.id)
                          } else if (e.key === "Escape") {
                            setEditingItem(null)
                            setEditText("")
                          }
                        }}
                      />
                      <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingItem(null)
                          setEditText("")
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`${item.completed ? "text-green-700 dark:text-green-300" : ""}`}>
                          {item.text}
                        </span>
                        {item.category && (
                          <Badge className={`ml-2 ${getCategoryColor(item.category)}`} variant="secondary">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      {!readOnly && (
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          {onDeleteItem && (
                            <Button size="sm" variant="ghost" onClick={() => onDeleteItem(item.id)}>
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Item */}
        {!readOnly && onAddItem && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add custom checklist item..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddItem()
                  }
                }}
                className="flex-1"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="documents">Documents</option>
                <option value="travel">Travel</option>
                <option value="insurance">Insurance</option>
                <option value="financial">Financial</option>
                <option value="health">Health</option>
                <option value="preparation">Preparation</option>
                <option value="safety">Safety</option>
              </select>
              <Button onClick={handleAddItem} disabled={!newItemText.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {items.length === 0 && !isAdmin && (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No checklist items have been added yet.</p>
            <p className="text-sm">The admin can add items for this destination.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
