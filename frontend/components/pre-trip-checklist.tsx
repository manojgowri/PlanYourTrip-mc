"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import type { ChecklistItem } from "@/lib/models"

interface PreTripChecklistProps {
  destination: string
  items: ChecklistItem[]
  onToggleItem?: (id: string) => void
  readOnly?: boolean
  isAdmin?: boolean
}

export function PreTripChecklist({
  destination,
  items,
  onToggleItem,
  readOnly = false,
  isAdmin = false,
}: PreTripChecklistProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    if (readOnly || (!isAdmin && !onToggleItem)) return
    onToggleItem?.(id)
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">{destination} Pre-Trip Checklist</h3>

      {items.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No checklist items have been added yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex items-center justify-between rounded-md border p-3 ${
                item.completed ? "bg-emerald-50 dark:bg-emerald-950/20" : ""
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    item.completed
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                  }`}
                >
                  {item.completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <span className={item.completed ? "text-muted-foreground line-through" : ""}>{item.title}</span>
              </div>

              {isAdmin && onToggleItem && (
                <button
                  onClick={() => handleToggle(item.id)}
                  disabled={readOnly}
                  className={`rounded-md px-2 py-1 text-xs font-medium ${
                    readOnly ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
