"use client"

import { useState, useEffect } from "react"
import { Instagram } from "lucide-react"
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading companions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Left sidebar - Companion list */}
        <div className="w-1/2 border-r border-gray-800">
          <div className="h-screen overflow-y-auto">
            {companions.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No travel companions available</p>
              </div>
            ) : (
              companions.map((companion, index) => (
                <div
                  key={companion.id}
                  className={`border-b border-gray-800 p-6 cursor-pointer transition-colors ${
                    activeCompanion === companion.id ? "bg-gray-900" : "hover:bg-gray-900/50"
                  }`}
                  onClick={() => setActiveCompanion(companion.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-light tracking-wide text-gray-300 uppercase">{companion.name}</h2>
                      {companion.relationship && (
                        <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider">{companion.relationship}</p>
                      )}
                    </div>
                    {companion.instagramUrl && (
                      <a
                        href={companion.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side - Companion image */}
        <div className="w-1/2 bg-black">
          <div className="h-screen flex items-center justify-center p-8">
            {activeCompanion && companions.length > 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <SafeImage
                  src={companions.find((c) => c.id === activeCompanion)?.image || getPlaceholderImage(600, 800)}
                  alt={companions.find((c) => c.id === activeCompanion)?.name || "Companion"}
                  className="max-w-full max-h-full object-cover rounded-lg filter grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ) : (
              <div className="text-gray-600">Select a companion to view their photo</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
