"use client"

import { useEffect, useState } from "react"
import { Instagram, MapPin, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SafeImage } from "@/components/safe-image"
import { getCompanions, type Companion } from "@/lib/data"
import { useLoading } from "@/contexts/loading-context"

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null)
  const { setLoading, setLoadingMessage } = useLoading()

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        setLoading(true)
        setLoadingMessage("Loading travel companions...")
        const companionsData = await getCompanions()
        setCompanions(companionsData)
        if (companionsData.length > 0) {
          setSelectedCompanion(companionsData[0])
        }
      } catch (error) {
        console.error("Error fetching companions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanions()
  }, [setLoading, setLoadingMessage])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Travel Companions</h1>
          <p className="text-gray-400 text-lg">Meet the amazing people who make our journeys unforgettable</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          {/* Companions List - Scrollable */}
          <div className="lg:col-span-1">
            <div className="h-full overflow-y-auto pr-2 space-y-2">
              {companions.map((companion) => (
                <div
                  key={companion.id}
                  className={`p-4 border border-gray-800 cursor-pointer transition-all duration-200 ${
                    selectedCompanion?.id === companion.id
                      ? "bg-gray-900 border-emerald-600"
                      : "hover:bg-gray-900/50 hover:border-gray-700"
                  }`}
                  onClick={() => setSelectedCompanion(companion)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <SafeImage
                        src={companion.image || "/placeholder.svg?height=48&width=48"}
                        alt={companion.name}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white truncate">{companion.name}</h3>
                      <p className="text-sm text-gray-400 truncate">{companion.relationship}</p>
                    </div>
                    {companion.instagramId && <Instagram className="h-4 w-4 text-gray-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Companion Details */}
          <div className="lg:col-span-2">
            {selectedCompanion ? (
              <Card className="bg-gray-900 border-gray-800 h-full">
                <CardContent className="p-0 h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <SafeImage
                        src={selectedCompanion.image || "/placeholder.svg?height=600&width=400"}
                        alt={selectedCompanion.name}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Details */}
                    <div className="p-8 flex flex-col justify-center">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">{selectedCompanion.name}</h2>
                          <p className="text-emerald-400 font-medium text-lg">{selectedCompanion.relationship}</p>
                        </div>

                        {selectedCompanion.bio && (
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                            <p className="text-gray-300 leading-relaxed">{selectedCompanion.bio}</p>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-emerald-400" />
                            <span className="text-gray-300">Travel Enthusiast</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-emerald-400" />
                            <span className="text-gray-300">Active Traveler</span>
                          </div>
                        </div>

                        {selectedCompanion.instagramId && (
                          <div className="pt-4">
                            <Button
                              variant="outline"
                              className="bg-transparent border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                              onClick={() =>
                                window.open(`https://instagram.com/${selectedCompanion.instagramId}`, "_blank")
                              }
                            >
                              <Instagram className="h-4 w-4 mr-2" />
                              Follow on Instagram
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Companion Selected</h3>
                  <p className="text-gray-500">Select a companion from the list to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {companions.map((companion) => (
              <Card key={companion.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <SafeImage
                        src={companion.image || "/placeholder.svg?height=64&width=64"}
                        alt={companion.name}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white">{companion.name}</h3>
                      <p className="text-sm text-emerald-400">{companion.relationship}</p>
                    </div>
                  </div>

                  {companion.bio && <p className="text-gray-300 text-sm mb-4 line-clamp-3">{companion.bio}</p>}

                  {companion.instagramId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                      onClick={() => window.open(`https://instagram.com/${companion.instagramId}`, "_blank")}
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Follow
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
