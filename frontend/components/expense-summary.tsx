"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencySelector } from "@/components/currency-selector"
import { formatCurrency } from "@/lib/currency-utils"
import type { Expense } from "@/lib/models"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign } from "lucide-react"

interface ExpenseSummaryProps {
  expenses: Expense[]
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("INR") // Default to INR
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    const sum = expenses.reduce((acc, expense) => acc + expense.cost, 0)
    setTotalExpenses(sum)
  }, [expenses])

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Expense Summary</CardTitle>
        <DollarSign className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Total Expenses:</h3>
          <CurrencySelector
            initialCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
            amount={totalExpenses}
          />
        </div>
        {expenses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.item}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="text-right">{formatCurrency(expense.cost, selectedCurrency)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center">No expenses recorded yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
