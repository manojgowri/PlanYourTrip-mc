// Image optimization utilities

// Default image dimensions
export const DEFAULT_IMAGE_DIMENSIONS = {
  thumbnail: { width: 300, height: 200 },
  card: { width: 400, height: 250 },
  banner: { width: 1200, height: 400 },
  avatar: { width: 100, height: 100 },
}

// Image formats
export type ImageFormat = "webp" | "jpeg" | "png" | "avif"

// Get optimized image URL
export function getOptimizedImageUrl(src: string, width: number, height: number, format: ImageFormat = "webp"): string {
  // If it's already a placeholder, return it
  if (src.includes("placeholder.com") || src.includes("placehold.co")) {
    return src
  }

  // If it's a relative URL, assume it's from our own API
  if (src.startsWith("/")) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
    return `${apiUrl}/images?url=${encodeURIComponent(src)}&width=${width}&height=${height}&format=${format}`
  }

  // For external URLs, we could use an image optimization service
  // For this example, we'll just return the original URL
  return src
}

// Get responsive image srcset
export function getResponsiveImageSrcSet(
  src: string,
  widths: number[],
  height: number,
  format: ImageFormat = "webp",
): string {
  return widths.map((width) => `${getOptimizedImageUrl(src, width, height, format)} ${width}w`).join(", ")
}

// Get image placeholder
export function getImagePlaceholder(width: number, height: number, text = ""): string {
  return `https://placehold.co/${width}x${height}/CCCCCC/666666${text ? `?text=${encodeURIComponent(text)}` : ""}`
}

/**
 * Gets a placeholder image URL with the specified dimensions
 * @param width Width of the placeholder image
 * @param height Height of the placeholder image
 * @returns URL to the placeholder image
 */
export function getPlaceholderImage(width = 400, height = 300): string {
  // Use a data URI for the placeholder to avoid 404 errors
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23888888'%3EImage Placeholder%3C/text%3E%3C/svg%3E`
}

// Check if image exists
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    return false
  }
}
