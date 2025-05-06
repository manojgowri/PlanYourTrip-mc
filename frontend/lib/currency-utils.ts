import { currencyRates, currencies, type CurrencyInfo } from "./models"

// Get all available currencies
export function getAvailableCurrencies(): CurrencyInfo[] {
  return Object.values(currencies)
}

// Convert currency with proper formatting
export function convertAndFormatCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency = "INR",
): { value: number; formatted: string } {
  if (!amount) return { value: 0, formatted: formatCurrency(0, toCurrency) }

  const convertedValue = convertCurrency(amount, fromCurrency, toCurrency)
  return {
    value: convertedValue,
    formatted: formatCurrency(convertedValue, toCurrency),
  }
}

// Convert currency
export function convertCurrency(amount: number, fromCurrency: string, toCurrency = "INR"): number {
  if (fromCurrency === toCurrency) return amount
  if (fromCurrency === "INR") return amount / (currencyRates[toCurrency] || 1)
  if (toCurrency === "INR") return amount * (currencyRates[fromCurrency] || 1)

  // Convert from source to INR, then INR to target
  const amountInINR = amount * (currencyRates[fromCurrency] || 1)
  return amountInINR / (currencyRates[toCurrency] || 1)
}

// Format currency with symbol
export function formatCurrency(amount: number, currency = "INR"): string {
  const currencyInfo = currencies[currency] || currencies.INR
  return `${currencyInfo.symbol}${amount.toFixed(2)}`
}
