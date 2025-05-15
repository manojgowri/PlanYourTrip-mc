"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCompanions } from "@/lib/data"
import type { Companion } from "@/lib/models"
import { getPlaceholderImage } from "@/lib/image-utils"

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCompanions = async () => {
      try {
        setLoading(true)
        const data = await getCompanions()
        setCompanions(data)
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
        <div className="space-y-6">
          {companions.map((companion) => (
            <Card key={companion.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <CardContent className="p-6 md:w-1/2">
                  <h2 className="text-2xl font-bold">{companion.name}</h2>
                  <Badge className="mt-2 mb-3">{companion.relationship}</Badge>
                  <p className="text-gray-600 dark:text-gray-400">{companion.bio}</p>
                </CardContent>

                <div className="md:w-1/2 bg-gray-100 dark:bg-gray-800 relative group">
                  <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <img
                      src={companion.image || getPlaceholderImage(300, 300)}
                      alt={companion.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = getPlaceholderImage(300, 300)
                      }}
                    />
                  </div>
                  <div className="md:block hidden aspect-square"></div>
                  <div className="md:hidden aspect-square">
                    <img
                      src={companion.image || getPlaceholderImage(300, 300)}
                      alt={companion.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = getPlaceholderImage(300, 300)
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
