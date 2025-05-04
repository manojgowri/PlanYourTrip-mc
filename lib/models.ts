// Currency conversion rates (example rates)
export const currencyRates = {
  VND: 0.0034, // Vietnamese Dong to INR
  USD: 83.15, // USD to INR
  EUR: 90.12, // EUR to INR
  GBP: 105.67, // GBP to INR
  AUD: 55.23, // AUD to INR
  // Add more currencies as needed
}

export interface CurrencyInfo {
  code: string
  symbol: string
  name: string
}

export const currencies: Record<string, CurrencyInfo> = {
  VND: { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee" },
  AUD: { code: "AUD", symbol: "$", name: "Australian Dollar" },
  // Add more currencies as needed
}

export function convertCurrency(amount: number, fromCurrency: string, toCurrency = "INR"): number {
  if (fromCurrency === toCurrency) return amount
  if (fromCurrency === "INR") return amount / currencyRates[toCurrency]
  if (toCurrency === "INR") return amount * currencyRates[fromCurrency]

  // Convert from source to INR, then INR to target
  const amountInINR = amount * currencyRates[fromCurrency]
  return amountInINR / currencyRates[toCurrency]
}

export function formatCurrency(amount: number, currency = "INR"): string {
  const currencyInfo = currencies[currency] || currencies.INR
  return `${currencyInfo.symbol}${amount.toFixed(2)}`
}

export interface ExpenseInfo {
  amount: number
  currency: string
  category: string
}
