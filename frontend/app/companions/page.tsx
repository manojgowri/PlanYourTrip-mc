"use client"

import { useState, useEffect } from "react"
import { getCompanions } from "@/lib/data"
import type { Companion } from "@/lib/models"
import { getPlaceholderImage } from "@/lib/image-utils"
import { SafeImage } from "@/components/safe-image"

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCompanion, setActiveCompanion] = useState<string | null>(null)

  useEffect(() => {
    const loadCompanions = async () => {
      try {
        setLoading(true)
        const data = await getCompanions()
        setCompanions(data)
        if (data.length > 0) {
          setActiveCompanion(data[0].id)
        }
        setError(null)
      } catch (err) {
        console.error("Error fetching companions:", err)
        setError("Failed to load travel companions. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadCompanions()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Travel Companions</h1>
        <p>Loading companions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Travel Companions</h1>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Travel Companions</h1>

      {companions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No travel companions have been added yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Names and details with scroll */}
            <div className="md:w-1/2 border-r">
              <div className="max-h-[600px] overflow-y-auto">
                {companions.map((companion) => (
                  <div
                    key={companion.id}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      activeCompanion === companion.id
                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                    onMouseEnter={() => setActiveCompanion(companion.id)}
                  >
                    <h2 className="text-xl font-bold">{companion.name}</h2>
                    <div className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 mt-1 mb-2">
                      {companion.relationship}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{companion.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Fixed image area */}
            <div className="md:w-1/2 bg-gray-100 dark:bg-gray-800">
              <div className="aspect-square h-[600px] flex items-center justify-center p-4">
                {activeCompanion && (
                  <div className="w-full h-full flex items-center justify-center">
                    <SafeImage
                      src={companions.find((c) => c.id === activeCompanion)?.image || getPlaceholderImage(500, 500)}
                      alt={companions.find((c) => c.id === activeCompanion)?.name || "Companion"}
                      className="object-cover max-w-full max-h-full rounded-lg shadow-lg transition-opacity duration-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
