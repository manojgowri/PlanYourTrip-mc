// This is a placeholder file for offline utility functions.
// In a real application, you might implement service workers,
// IndexedDB, or other caching strategies here for offline support.

export function isOnline(): boolean {
  if (typeof navigator !== "undefined") {
    return navigator.onLine
  }
  return true // Assume online if not in browser environment
}

export function saveToOfflineCache<T>(key: string, data: T): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving to offline cache:", error)
    }
  }
}

export function getFromOfflineCache<T>(key: string): T | null {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error reading from offline cache:", error)
      return null
    }
  }
  return null
}

export function removeFromOfflineCache(key: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from offline cache:", error)
    }
  }
}
