"use client"

import { Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
}

interface PreTripChecklistProps {
  destination: string
  items: ChecklistItem[]
  onToggleItem?: (id: string) => void
}

export function PreTripChecklist({ destination, items, onToggleItem }: PreTripChecklistProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre-Trip Checklist for {destination}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex items-start gap-3 p-2 rounded-md ${
                item.completed ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-gray-50 dark:bg-gray-800/20"
              }`}
              onClick={() => onToggleItem && onToggleItem(item.id)}
            >
              <div
                className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${
                  item.completed
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700"
                }`}
              >
                {item.completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </div>
              <div>
                <h4 className={`font-medium ${item.completed ? "text-emerald-700 dark:text-emerald-400" : ""}`}>
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
