"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export interface ChecklistItem {
  id: string
  title: string
  completed: boolean
  notes: string
}

interface PreTripChecklistFormProps {
  checklist: ChecklistItem[]
  onChange: (checklist: ChecklistItem[]) => void
}

export function PreTripChecklistForm({ checklist, onChange }: PreTripChecklistFormProps) {
  const defaultChecklist: ChecklistItem[] = [
    { id: "rooms", title: "Rooms Booked", completed: false, notes: "" },
    { id: "flights", title: "Flight Tickets Booked", completed: false, notes: "" },
    { id: "trains", title: "Train Bookings", completed: false, notes: "" },
    { id: "car", title: "Car Rentals", completed: false, notes: "" },
    { id: "visa", title: "Visa Requirements", completed: false, notes: "" },
    { id: "insurance", title: "Travel Insurance", completed: false, notes: "" },
  ]

  const [items, setItems] = useState<ChecklistItem[]>(checklist.length > 0 ? checklist : defaultChecklist)

  const handleToggle = (id: string) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    setItems(updatedItems)
    onChange(updatedItems)
  }

  const handleNotesChange = (id: string, notes: string) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, notes } : item))
    setItems(updatedItems)
    onChange(updatedItems)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre-Trip Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`checklist-${item.id}`} className="text-base font-medium">
                  {item.title}
                </Label>
                <Switch
                  id={`checklist-${item.id}`}
                  checked={item.completed}
                  onCheckedChange={() => handleToggle(item.id)}
                />
              </div>
              <Textarea
                placeholder={`Notes about ${item.title.toLowerCase()}...`}
                value={item.notes}
                onChange={(e) => handleNotesChange(item.id, e.target.value)}
                className="h-20"
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="other-notes" className="text-base font-medium">
              Other Notes
            </Label>
            <Textarea
              id="other-notes"
              placeholder="Any other pre-trip notes..."
              value={items.find((i) => i.id === "other")?.notes || ""}
              onChange={(e) => {
                const otherItem = items.find((i) => i.id === "other")
                if (otherItem) {
                  handleNotesChange("other", e.target.value)
                } else {
                  const newItems = [
                    ...items,
                    { id: "other", title: "Other Notes", completed: false, notes: e.target.value },
                  ]
                  setItems(newItems)
                  onChange(newItems)
                }
              }}
              className="h-24"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
