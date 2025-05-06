"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAvailableCurrencies } from "@/lib/currency-utils"
import { currencies } from "@/lib/models"

interface CurrencySelectorProps {
  value: string
  onChange: (currency: string) => void
  className?: string
}

export function CurrencySelector({ value, onChange, className }: CurrencySelectorProps) {
  const [mounted, setMounted] = useState(false)
  const availableCurrencies = getAvailableCurrencies()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`h-10 w-[120px] ${className}`} />
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[120px] ${className}`}>
        <SelectValue placeholder="Currency">
          {value && currencies[value] ? `${currencies[value].code} (${currencies[value].symbol})` : "Currency"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableCurrencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.code} ({currency.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
