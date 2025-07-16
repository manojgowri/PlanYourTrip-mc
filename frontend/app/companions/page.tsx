"use client"

import { useState, useEffect } from "react"
import { Instagram, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SafeImage } from "@/components/safe-image"
import { useLoading } from "@/contexts/loading-context"
import type { Companion } from "@/lib/models"

// Mock data - replace with actual API call
const mockCompanions: Companion[] = [
  {
    id: "1",
    name: "GUILLERMO RAUCH",
    role: "",
    bio: "Travel enthusiast and adventure seeker",
    image: "/placeholder.svg?height=400&width=400",
    instagramId: "",
    isActive: true,
  },
  {
    id: "2",
    name: "JEANNE GROSSER",
    role: "COO, VERCEL",
    bio: "Passionate about exploring new cultures and destinations",
    image: "/placeholder.svg?height=400&width=400",
    instagramId: "jeannegrosser",
    isActive: true,
  },
  {
    id: "3",
    name: "PEPTIJN SENDERS",
    role: "",
    bio: "Photography and travel blogger",
    image: "/placeholder.svg?height=400&width=400",
    instagramId: "",
    isActive: true,
  },
  {
    id: "4",
    name: "MALAVIKA BALACHANDRAN TADEUSZ",
    role: "",
    bio: "Cultural explorer and food enthusiast",
    image: "/placeholder.svg?height=400&width=400",
    instagramId: "",
    isActive: true,
  },
  {
    id: "5",
    name: "TOMAS JANSSON",
    role: "",
    bio: "Adventure sports and nature lover",
    image: "/placeholder.svg?height=400&width=400",
    instagramId: "",
    isActive: true,
  },
  {
    id: "6",
    name: "JOE ZENG",
    role: "",
    bio: "Tech traveler and digital nomad",
    image: "/placeholder.svg?height=400&width=400",
    instagramId: "",
    isActive: true,
  },
]

export default function CompanionsPage() {
  const { setLoading, setLoadingMessage } = useLoading()
  const [companions, setCompanions] = useState<Companion[]>([])
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null)
  const [loading, setLocalLoading] = useState(true)

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        setLoading(true)
        setLoadingMessage("Loading travel companions...")
        setLocalLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setCompanions(mockCompanions)
        setSelectedCompanion(mockCompanions[1]) // Default to Jeanne Grosser
      } catch (error) {
        console.error("Error fetching companions:", error)
      } finally {
        setLoading(false)
        setLocalLoading(false)
      }
    }

    fetchCompanions()
  }, [setLoading, setLoadingMessage])

  if (loading) {
    return null // Loading handled by global loader
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-white" />
            <h1 className="text-4xl font-bold">Travel Companions</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Meet our amazing travel companions who make every journey unforgettable. Each brings their unique
            perspective and expertise to create extraordinary experiences.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-8 h-[600px]">
          {/* Left Panel - Companions List */}
          <div className="w-1/2">
            <Card className="bg-gray-900 border-gray-800 h-full">
              <CardContent className="p-0">
                <div className="h-full overflow-y-auto">
                  {companions.map((companion) => (
                    <div
                      key={companion.id}
                      onClick={() => setSelectedCompanion(companion)}
                      className={`p-6 border-b border-gray-800 cursor-pointer transition-colors hover:bg-gray-800 ${
                        selectedCompanion?.id === companion.id ? "bg-gray-800" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-wide">{companion.name}</h3>
                          {companion.role && <p className="text-sm text-gray-400 mt-1">{companion.role}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {companion.instagramId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(`https://instagram.com/${companion.instagramId}`, "_blank")
                              }}
                            >
                              <Instagram className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Selected Companion */}
          <div className="w-1/2">
            {selectedCompanion && (
              <Card className="bg-gray-900 border-gray-800 h-full">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full overflow-hidden rounded-lg">
                    <SafeImage
                      src={selectedCompanion.image || "/placeholder.svg?height=600&width=600"}
                      alt={selectedCompanion.name}
                      className="h-full w-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedCompanion.name}</h2>
                      {selectedCompanion.role && <p className="text-gray-300 mb-3">{selectedCompanion.role}</p>}
                      {selectedCompanion.bio && (
                        <p className="text-gray-400 text-sm leading-relaxed">{selectedCompanion.bio}</p>
                      )}
                      {selectedCompanion.instagramId && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 bg-transparent border-white text-white hover:bg-white hover:text-black"
                          onClick={() =>
                            window.open(`https://instagram.com/${selectedCompanion.instagramId}`, "_blank")
                          }
                        >
                          <Instagram className="h-4 w-4 mr-2" />
                          Follow on Instagram
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {companions.map((companion) => (
            <Card key={companion.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Left side - Info */}
                  <div className="flex-1 p-6">
                    <h3 className="text-xl font-bold text-white tracking-wide mb-2">{companion.name}</h3>
                    {companion.role && <p className="text-sm text-gray-400 mb-3">{companion.role}</p>}
                    {companion.bio && <p className="text-gray-400 text-sm leading-relaxed mb-4">{companion.bio}</p>}
                    {companion.instagramId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-white text-white hover:bg-white hover:text-black"
                        onClick={() => window.open(`https://instagram.com/${companion.instagramId}`, "_blank")}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                    )}
                  </div>

                  {/* Right side - Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <SafeImage
                      src={companion.image || "/placeholder.svg?height=128&width=128"}
                      alt={companion.name}
                      className="h-full w-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 rounded-r-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
