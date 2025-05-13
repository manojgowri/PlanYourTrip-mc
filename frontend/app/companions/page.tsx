"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchCompanions } from "@/lib/data"
import type { Companion } from "@/lib/models"
import { getImageUrl } from "@/lib/image-utils"

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCompanions = async () => {
      try {
        setLoading(true)
        const data = await fetchCompanions()
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companions.map((companion) => (
            <Card key={companion.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={getImageUrl(companion.image) || "/placeholder.svg"}
                  alt={companion.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=300&width=300"
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-bold">{companion.name}</h2>
                <Badge className="mt-2 mb-2">{companion.relationship}</Badge>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{companion.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
