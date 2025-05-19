"use client"

import { useState, useEffect } from "react"
import { getCompanions } from "@/lib/data"
import type { Companion } from "@/lib/models"
import { getPlaceholderImage } from "@/lib/image-utils"
import { SafeImage } from "@/components/safe-image"
import { User, MapPin, Calendar } from "lucide-react"

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
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Travel Companions</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse text-emerald-600 dark:text-emerald-400">Loading companions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Travel Companions</h1>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Travel Companions</h1>

      {companions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <User className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No travel companions have been added yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden shadow-sm dark:border-gray-700">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Names and details with scroll */}
            <div className="md:w-1/2 border-r dark:border-gray-700">
              <div className="max-h-[600px] overflow-y-auto">
                {companions.map((companion) => (
                  <div
                    key={companion.id}
                    className={`p-4 border-b cursor-pointer transition-colors dark:border-gray-700 ${
                      activeCompanion === companion.id
                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                    onMouseEnter={() => setActiveCompanion(companion.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        {companion.image ? (
                          <SafeImage
                            src={companion.image}
                            alt={companion.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{companion.name}</h2>
                        <div className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                          {companion.relationship}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{companion.bio}</p>
                      {companion.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3 w-3" />
                          <span>{companion.location}</span>
                        </div>
                      )}
                      {companion.travelsSince && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>Travels since {companion.travelsSince}</span>
                        </div>
                      )}
                    </div>
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
