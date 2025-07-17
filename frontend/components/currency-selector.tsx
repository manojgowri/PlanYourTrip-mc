"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { currencies } from "@/lib/models"

interface CurrencySelectorProps {
  initialCurrency?: string
  onCurrencyChange?: (currency: string) => void
}

export function CurrencySelector({ initialCurrency = "INR", onCurrencyChange }: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency)

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value)
    if (onCurrencyChange) {
      onCurrencyChange(value)
    }
    // Example usage:
    // const convertedAmount = convertCurrency(100, "USD", value);
    // console.log(`100 USD is ${convertedAmount} ${value}`);
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium">Display Currency:</span>
      <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select currency">
            {selectedCurrency && currencies[selectedCurrency]
              ? `${currencies[selectedCurrency].code} (${currencies[selectedCurrency].symbol})`
              : "Select currency"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="INR">INR (₹)</SelectItem>
          <SelectItem value="USD">USD ($)</SelectItem>
          <SelectItem value="EUR">EUR (€)</SelectItem>
          <SelectItem value="GBP">GBP (£)</SelectItem>
          {/* Add more currencies as needed */}
        </SelectContent>
      </Select>
    </div>
  )
}
