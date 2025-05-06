"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencySelector } from "@/components/currency-selector"
import { convertAndFormatCurrency } from "@/lib/currency-utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ExpenseSummaryProps {
  expenses: {
    category: string
    amount: number
    currency: string
  }[]
  defaultCurrency?: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

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

  // Prepare data for chart
  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: CATEGORY_LABELS[category] || category,
    value: amount,
    percentage: ((amount / total) * 100).toFixed(1),
  }))

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

        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    convertAndFormatCurrency(value, displayCurrency, displayCurrency).formatted
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-center text-muted-foreground">No expense data available</p>
          </div>
        )}

        <div className="mt-4 space-y-2">
          {chartData.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{category.name}</span>
              </div>
              <span className="font-medium">
                {convertAndFormatCurrency(category.value, displayCurrency, displayCurrency).formatted}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
