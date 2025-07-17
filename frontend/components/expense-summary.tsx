"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/currency-utils"
import { addExpenseItem, deleteExpenseItem } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { Expense } from "@/lib/models"
import { PlusCircle, Trash2 } from "lucide-react"

interface ExpenseSummaryProps {
  itineraryId: string
  initialExpenses: Expense[]
  isAdmin: boolean
}

export function ExpenseSummary({ itineraryId, initialExpenses, isAdmin }: ExpenseSummaryProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [newItem, setNewItem] = useState({ description: "", amount: "" })
  const { toast } = useToast()

  useEffect(() => {
    setExpenses(initialExpenses)
  }, [initialExpenses])

  const handleAddExpense = async () => {
    if (isAdmin) {
      toast({
        title: "Admin Mode",
        description: "Expenses can only be updated by users in view mode.",
        variant: "default",
      })
      return
    }

    const amount = Number.parseFloat(newItem.amount)
    if (!newItem.description || isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid description and a positive amount.",
        variant: "destructive",
      })
      return
    }

    const newExpense: Expense = {
      _id: `temp-${Date.now()}`, // Temporary ID for optimistic update
      description: newItem.description,
      amount: amount,
    }

    setExpenses((prev) => [...prev, newExpense])
    setNewItem({ description: "", amount: "" })

    try {
      const updatedItinerary = await addExpenseItem(itineraryId, newExpense.description, newExpense.amount)
      if (updatedItinerary) {
        // Replace temporary ID with actual ID from server
        setExpenses((prev) =>
          prev.map((exp) =>
            exp._id === newExpense._id
              ? updatedItinerary.expenses.find(
                  (e) => e.description === newExpense.description && e.amount === newExpense.amount,
                ) || exp
              : exp,
          ),
        )
        toast({
          title: "Expense Added",
          description: `Added ${formatCurrency(newExpense.amount)} for "${newExpense.description}".`,
        })
      } else {
        throw new Error("Failed to add expense on server.")
      }
    } catch (error) {
      console.error("Error adding expense:", error)
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
      // Revert optimistic update on error
      setExpenses((prev) => prev.filter((exp) => exp._id !== newExpense._id))
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    if (isAdmin) {
      toast({
        title: "Admin Mode",
        description: "Expenses can only be updated by users in view mode.",
        variant: "default",
      })
      return
    }

    const originalExpenses = expenses
    setExpenses((prev) => prev.filter((exp) => exp._id !== expenseId))

    try {
      const updatedItinerary = await deleteExpenseItem(itineraryId, expenseId)
      if (!updatedItinerary) {
        throw new Error("Failed to delete expense on server.")
      }
      toast({
        title: "Expense Deleted",
        description: "Expense removed successfully.",
      })
    } catch (error) {
      console.error("Error deleting expense:", error)
      toast({
        title: "Error",
        description: "Failed to delete expense. Please try again.",
        variant: "destructive",
      })
      // Revert optimistic update on error
      setExpenses(originalExpenses)
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 mb-4">
          {expenses.length === 0 ? (
            <p className="text-muted-foreground text-sm">No expenses added yet.</p>
          ) : (
            <ul className="space-y-2">
              {expenses.map((expense) => (
                <li key={expense._id} className="flex justify-between items-center text-sm">
                  <span>{expense.description}</span>
                  <div className="flex items-center gap-2">
                    <span>{formatCurrency(expense.amount)}</span>
                    {!isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="h-6 w-6"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete expense</span>
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t pt-3 mt-3 flex justify-between items-center font-semibold">
          <span>Total:</span>
          <span>{formatCurrency(totalExpenses)}</span>
        </div>
        {!isAdmin && (
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="new-expense-description" className="sr-only">
                  Description
                </Label>
                <Input
                  id="new-expense-description"
                  placeholder="Expense description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="new-expense-amount" className="sr-only">
                  Amount
                </Label>
                <Input
                  id="new-expense-amount"
                  type="number"
                  placeholder="Amount"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleAddExpense} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Expense
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
