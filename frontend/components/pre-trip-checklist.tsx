"use client"

import { useState } from "react"
import { Check, X, Trash2, Edit, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export interface ChecklistItem {
  id: string
  title: string
  notes?: string
  description?: string
  completed: boolean
}

interface PreTripChecklistProps {
  destination?: string
  items: ChecklistItem[]
  onToggleItem?: (id: string) => void
  onUpdateItems?: (items: ChecklistItem[]) => void
  isAdmin?: boolean
  readOnly?: boolean
}

export function PreTripChecklist({
  destination,
  items,
  onToggleItem,
  onUpdateItems,
  isAdmin = false,
  readOnly = false,
}: PreTripChecklistProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [editingNotes, setEditingNotes] = useState("")
  const [newItemTitle, setNewItemTitle] = useState("")

  const handleToggle = (id: string) => {
    if (readOnly) return

    if (onToggleItem) {
      onToggleItem(id)
    } else if (onUpdateItems) {
      const updatedItems = items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
      onUpdateItems(updatedItems)
    }
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
    setNewItemTitle("")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{destination ? `Pre-Trip Checklist for ${destination}` : "Pre-Trip Checklist"}</CardTitle>
        {isAdmin && (
          <div className="text-sm text-muted-foreground">
            {items.filter((i) => i.completed).length}/{items.length} completed
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex items-start gap-3 p-2 rounded-md ${
                item.completed ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-gray-50 dark:bg-gray-800/20"
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
                  <div
                    className={`mt-0.5 flex-shrink-0 rounded-full p-1 cursor-pointer ${
                      item.completed
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-700"
                    }`}
                    onClick={() => handleToggle(item.id)}
                    title={item.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {item.completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${item.completed ? "text-emerald-700 dark:text-emerald-400" : ""}`}>
                      {item.title}
                    </h4>
                    {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                    {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
                  </div>
                  {isAdmin && (
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

        {isAdmin && (
          <div className="mt-4 flex gap-2">
            <Input
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Add new checklist item"
              className="flex-1"
            />
            <Button onClick={addNewItem}>Add</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
