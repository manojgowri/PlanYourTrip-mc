"use client"

import { useState } from "react"
import { Check, Plus, X, Edit3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [newItemNotes, setNewItemNotes] = useState("")
  const [editingItem, setEditingItem] = useState<string | null>(null)

  const handleAddItem = () => {
    if (newItemTitle.trim() && onAddItem) {
      onAddItem({
        title: newItemTitle.trim(),
        notes: newItemNotes.trim() || undefined,
        completed: false,
      })
      setNewItemTitle("")
      setNewItemNotes("")
      setIsAddingItem(false)
    }
  }

  const handleEditItem = (id: string, title: string, notes?: string) => {
    if (onEditItem) {
      onEditItem(id, { title, notes })
      setEditingItem(null)
    }
  }

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>Pre-Trip Checklist</span>
              <Badge variant="outline">
                {completedCount}/{totalCount} completed
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Essential items to prepare for your {destination} trip</p>
          </div>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingItem(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        )}

        {/* Checklist Items */}
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
              item.completed
                ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                : "bg-background hover:bg-muted/50"
            }`}
          >
            {/* Checkbox */}
            <button
              onClick={() => !readOnly && onToggleItem?.(item.id)}
              disabled={readOnly}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                item.completed
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-gray-300 hover:border-emerald-400 dark:border-gray-600"
              } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            >
              {item.completed && <Check className="h-3 w-3" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {editingItem === item.id ? (
                <div className="space-y-2">
                  <Input
                    defaultValue={item.title}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement
                        const notesInput = target.parentElement?.querySelector("textarea") as HTMLTextAreaElement
                        handleEditItem(item.id, target.value, notesInput?.value)
                      }
                    }}
                  />
                  <Textarea defaultValue={item.notes || ""} placeholder="Add notes (optional)" rows={2} />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const titleInput = document.querySelector(
                          `input[defaultValue="${item.title}"]`,
                        ) as HTMLInputElement
                        const notesInput = titleInput?.parentElement?.querySelector("textarea") as HTMLTextAreaElement
                        handleEditItem(item.id, titleInput?.value || item.title, notesInput?.value)
                      }}
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${item.completed ? "text-emerald-700 dark:text-emerald-300" : ""}`}>
                      {item.title}
                    </h4>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteItem?.(item.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Add New Item Form */}
        {isAddingItem && (
          <div className="p-3 border rounded-lg bg-muted/50">
            <div className="space-y-3">
              <Input
                placeholder="Enter checklist item..."
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleAddItem()
                  }
                }}
              />
              <Textarea
                placeholder="Add notes (optional)"
                value={newItemNotes}
                onChange={(e) => setNewItemNotes(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddItem} disabled={!newItemTitle.trim()}>
                  Add Item
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsAddingItem(false)
                    setNewItemTitle("")
                    setNewItemNotes("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Check className="h-8 w-8" />
            </div>
            <p className="font-medium">No checklist items yet</p>
            <p className="text-sm">
              {isAdmin
                ? "Add items to help travelers prepare for their trip"
                : "Check back later for pre-trip preparation items"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
