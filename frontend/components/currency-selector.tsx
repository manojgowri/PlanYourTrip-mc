"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"

export function CurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD") // Default to USD

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency)
    // In a real application, you would update a currency context or state here
    console.log(`Currency changed to: ${currency}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <DollarSign className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Select currency</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleCurrencyChange("USD")}>USD</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCurrencyChange("EUR")}>EUR</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCurrencyChange("GBP")}>GBP</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCurrencyChange("JPY")}>JPY</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCurrencyChange("VND")}>VND</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
