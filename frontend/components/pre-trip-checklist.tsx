"use client"

import { useState } from "react"
import { Check, X, Trash2, Edit, Save, Plus, Circle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ChecklistItem } from "@/lib/models"

interface PreTripChecklistProps {
  destination?: string
  items: ChecklistItem[]
  onToggleItem?: (id: string) => void
  onUpdateItems?: (items: ChecklistItem[]) => void
  readOnly?: boolean
  isAdmin?: boolean
}

export function PreTripChecklist({
  destination,
  items,
  onToggleItem,
  onUpdateItems,
  readOnly = false,
  isAdmin = false,
}: PreTripChecklistProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [editingNotes, setEditingNotes] = useState("")
  const [newItemTitle, setNewItemTitle] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    () => new Set(items.filter((item) => item.completed).map((item) => item.id)),
  )

  const handleToggle = (id: string) => {
    if (readOnly) return

    if (isAdmin && onUpdateItems) {
      // Admin can select/deselect items for inclusion
      const newSelectedItems = new Set(selectedItems)
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id)
      } else {
        newSelectedItems.add(id)
      }
      setSelectedItems(newSelectedItems)
    } else if (onToggleItem) {
      // User can toggle completion status
      onToggleItem(id)
    }
  }

  const handleSaveSelection = () => {
    if (!onUpdateItems) return

    const selectedItemsList = items.filter((item) => selectedItems.has(item.id))
    onUpdateItems(selectedItemsList)
  }

  const startEditing = (item: ChecklistItem) => {
    setEditingItemId(item.id)
    setEditingTitle(item.title)
    setEditingNotes(item.notes || "")
  }

  const saveEditing = () => {
    if (!editingItemId || !onUpdateItems) return

    const updatedItems = items.map((item) =>
      item.id === editingItemId ? { ...item, title: editingTitle, notes: editingNotes } : item,
    )

    onUpdateItems(updatedItems)
    setEditingItemId(null)
  }

  const deleteItem = (id: string) => {
    if (!onUpdateItems) return

    const updatedItems = items.filter((item) => item.id !== id)
    onUpdateItems(updatedItems)

    // Remove from selected items if it was selected
    const newSelectedItems = new Set(selectedItems)
    newSelectedItems.delete(id)
    setSelectedItems(newSelectedItems)
  }

  const addNewItem = () => {
    if (!newItemTitle.trim() || !onUpdateItems) return

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      notes: "",
      completed: false,
    }

    onUpdateItems([...items, newItem])
    setSelectedItems((prev) => new Set([...prev, newItem.id]))
    setNewItemTitle("")
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {destination ? `${destination} Pre-Trip Checklist` : "Pre-Trip Checklist"}
        </h3>
        {isAdmin && onUpdateItems && (
          <Button onClick={handleSaveSelection} size="sm">
            Save Selected Items
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No checklist items have been added yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex items-center justify-between rounded-md border p-3 ${
                isAdmin
                  ? selectedItems.has(item.id)
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                    : "bg-gray-50 dark:bg-gray-800/20"
                  : item.completed
                    ? "bg-emerald-50 dark:bg-emerald-950/20"
                    : ""
              }`}
            >
              {editingItemId === item.id ? (
                <div className="w-full space-y-2">
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder="Item title"
                  />
                  <Textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Notes"
                    className="h-20"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingItemId(null)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveEditing}>
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full cursor-pointer ${
                        isAdmin
                          ? selectedItems.has(item.id)
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                          : item.completed
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                      }`}
                      onClick={() => handleToggle(item.id)}
                    >
                      {isAdmin ? (
                        selectedItems.has(item.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )
                      ) : item.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <span className={item.completed && !isAdmin ? "text-emerald-700 dark:text-emerald-400" : ""}>
                        {item.title}
                      </span>
                      {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
                    </div>
                  </div>

                  {isAdmin && onUpdateItems && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditing(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {isAdmin && onUpdateItems && (
        <div className="mt-4 flex gap-2">
          <Input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Add new checklist item"
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && addNewItem()}
          />
          <Button onClick={addNewItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      )}
    </div>
  )
}
