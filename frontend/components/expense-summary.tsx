"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencySelector } from "@/components/currency-selector"
import { convertAndFormatCurrency } from "@/lib/currency-utils"

interface ExpenseSummaryProps {
  expenses: {
    category: string
    amount: number
    currency: string
  }[]
  defaultCurrency?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  food: "Food & Drinks",
  transportation: "Transportation",
  accommodation: "Accommodation",
  activities: "Activities",
  shopping: "Shopping",
}

export function ExpenseSummary({ expenses, defaultCurrency = "INR" }: ExpenseSummaryProps) {
  const [displayCurrency, setDisplayCurrency] = useState(defaultCurrency)

  // Group expenses by category and convert to display currency
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      const category = expense.category || "general"
      const { value } = convertAndFormatCurrency(expense.amount, expense.currency, displayCurrency)

      if (!acc[category]) {
        acc[category] = 0
      }

      acc[category] += value
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate total
  const total = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Expense Summary</CardTitle>
        <CurrencySelector value={displayCurrency} onChange={setDisplayCurrency} />
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-3xl font-bold">
            {convertAndFormatCurrency(total, displayCurrency, displayCurrency).formatted}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {Object.entries(expensesByCategory).map(([category, amount], index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500 opacity-80" />
                <span>{CATEGORY_LABELS[category] || category}</span>
              </div>
              <span className="font-medium">
                {convertAndFormatCurrency(amount, displayCurrency, displayCurrency).formatted}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
