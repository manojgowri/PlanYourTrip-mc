// This is a placeholder for currency conversion logic.
// In a real application, you would integrate with a currency exchange API.

const EXCHANGE_RATES: { [key: string]: { [key: string]: number } } = {
  INR: {
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    INR: 1,
  },
  USD: {
    INR: 83.33,
    EUR: 0.92,
    GBP: 0.79,
    USD: 1,
  },
  EUR: {
    INR: 90.5,
    USD: 1.08,
    GBP: 0.86,
    EUR: 1,
  },
  GBP: {
    INR: 105.0,
    USD: 1.27,
    EUR: 1.16,
    GBP: 1,
  },
}

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const rateFrom = EXCHANGE_RATES[fromCurrency]?.[toCurrency]
  if (rateFrom) {
    return amount * rateFrom
  }

  // If direct conversion not found, try via a common base (e.g., USD)
  const amountInUSD = amount * (EXCHANGE_RATES[fromCurrency]?.["USD"] || 0)
  const rateTo = EXCHANGE_RATES["USD"]?.[toCurrency]
  if (amountInUSD && rateTo) {
    return amountInUSD * rateTo
  }

  console.warn(`Conversion rate not found for ${fromCurrency} to ${toCurrency}. Returning original amount.`)
  return amount
}

export function formatCurrency(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return `${currencyCode} ${amount.toFixed(2)}` // Fallback
  }
}
