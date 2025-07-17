export const formatCurrency = (amount: number, currencyCode = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount)
}

export const getCurrencySymbol = (currencyCode = "USD"): string => {
  switch (currencyCode) {
    case "USD":
      return "$"
    case "EUR":
      return "€"
    case "GBP":
      return "£"
    case "JPY":
      return "¥"
    case "VND":
      return "₫"
    default:
      return "$"
  }
}
