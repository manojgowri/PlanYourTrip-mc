"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/currency-utils"

interface CurrencySelectorProps {
  initialCurrency: string
  onCurrencyChange: (currency: string) => void
  amount?: number
}

export function CurrencySelector({ initialCurrency, onCurrencyChange, amount }: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency)

  const handleValueChange = (value: string) => {
    setSelectedCurrency(value)
    onCurrencyChange(value)
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedCurrency} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
          <SelectItem value="GBP">GBP</SelectItem>
          <SelectItem value="JPY">JPY</SelectItem>
          <SelectItem value="INR">INR</SelectItem>
          {/* Add more currencies as needed */}
        </SelectContent>
      </Select>
      {amount !== undefined && (
        <span className="text-lg font-semibold">{formatCurrency(amount, selectedCurrency)}</span>
      )}
    </div>
  )
}
