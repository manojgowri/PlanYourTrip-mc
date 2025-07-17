"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/currency-utils"
import type { Activity } from "@/lib/models"

interface ExpenseSummaryProps {
  activities: Activity[]
}

export function ExpenseSummary({ activities }: ExpenseSummaryProps) {
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [currency, setCurrency] = useState("INR") // Default currency

  useEffect(() => {
    const calculatedTotal = activities.reduce((sum, activity) => sum + (activity.cost || 0), 0)
    setTotalExpenses(calculatedTotal)
  }, [activities])

  // In a real app, you'd likely have a context or prop to get the selected currency
  // For now, we'll just use INR as the base for calculation and display.

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Activity Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity._id} className="flex justify-between text-sm">
                <span>{activity.name}</span>
                <span>{formatCurrency(activity.cost || 0, currency)}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No expenses recorded for activities.</p>
          )}
        </div>
        <div className="border-t pt-2 mt-4 flex justify-between font-semibold">
          <span>Total Activity Expenses:</span>
          <span>{formatCurrency(totalExpenses, currency)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
