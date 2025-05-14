/**
 * Utility functions for handling images
 */

// Get a placeholder image with specified dimensions
export function getPlaceholderImage(width: number, height: number): string {
  return `/placeholder.svg?width=${width}&height=${height}`
}

// Process image URL to ensure it's valid
export function getImageUrl(url?: string): string {
  if (!url) return getPlaceholderImage(400, 300)

  // If it's already a data URL or an absolute URL, return it
  if (url.startsWith("data:") || url.startsWith("http")) {
    return url
  }

  // If it's a relative URL, ensure it starts with /
  if (!url.startsWith("/")) {
    return `/${url}`
  }

  return url
}
