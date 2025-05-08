// Offline mode utilities

// Check if the app is currently offline
export function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine
}

// Register a callback for when the app goes online/offline
export function registerConnectivityListeners(onOffline: () => void, onOnline: () => void): () => void {
  if (typeof window === "undefined") return () => {}

  window.addEventListener("offline", onOffline)
  window.addEventListener("online", onOnline)

  return () => {
    window.removeEventListener("offline", onOffline)
    window.removeEventListener("online", onOnline)
  }
}

// Local storage key for cached data
const CACHE_PREFIX = "travel_app_cache_"

// Save data to local cache
export function saveToCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    )
  } catch (error) {
    console.error("Error saving to cache:", error)
  }
}

// Get data from local cache
export function getFromCache<T>(key: string, maxAgeMs = 3600000): T | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`)
    if (!cached) return null

    const { timestamp, data } = JSON.parse(cached)

    // Check if cache is expired
    if (Date.now() - timestamp > maxAgeMs) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`)
      return null
    }

    return data as T
  } catch (error) {
    console.error("Error retrieving from cache:", error)
    return null
  }
}

// Clear all cached data
export function clearCache(): void {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("Error clearing cache:", error)
  }
}

// Sync pending changes when back online
export function syncPendingChanges(syncFunction: () => Promise<void>): void {
  if (isOffline()) {
    // Register to sync when back online
    const handleOnline = () => {
      syncFunction()
      window.removeEventListener("online", handleOnline)
    }

    window.addEventListener("online", handleOnline)
  } else {
    // If online, sync immediately
    syncFunction()
  }
}
