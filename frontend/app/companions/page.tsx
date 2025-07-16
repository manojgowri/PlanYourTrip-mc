"use client"

import { useEffect, useState } from "react"
import { Instagram, Linkedin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCompanions, type Companion } from "@/lib/data"
import { useLoading } from "@/contexts/loading-context"
import { SafeImage } from "@/components/safe-image"

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

        const data = await getCompanions()
        setCompanions(data)
        if (data.length > 0) {
          setSelectedCompanion(data[0])
        }
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
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Travel Companions</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Meet our experienced travel companions who will make your journey unforgettable. Each brings unique
            expertise and local knowledge to enhance your travel experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Companions List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <div className="max-h-[600px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {companions.map((companion) => (
                <div
                  key={companion.id}
                  className={`p-4 border border-gray-700 rounded-lg cursor-pointer transition-all duration-200 hover:border-gray-500 ${
                    selectedCompanion?.id === companion.id ? "bg-gray-800 border-gray-500" : "bg-gray-900/50"
                  }`}
                  onClick={() => setSelectedCompanion(companion)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{companion.name}</h3>
                      {companion.role && (
                        <p className="text-sm text-gray-400 uppercase tracking-wide">{companion.role}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {companion.socialMedia?.instagram && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8 text-gray-400 hover:text-pink-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`https://instagram.com/${companion.socialMedia.instagram}`, "_blank")
                          }}
                        >
                          <Instagram className="h-4 w-4" />
                        </Button>
                      )}
                      {companion.socialMedia?.linkedin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`https://linkedin.com/in/${companion.socialMedia.linkedin}`, "_blank")
                          }}
                        >
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Companion Details */}
          <div className="lg:sticky lg:top-8">
            {selectedCompanion ? (
              <Card className="bg-gray-900 border-gray-700 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden">
                    <SafeImage
                      src={selectedCompanion.image || "/placeholder.svg?height=400&width=400"}
                      alt={selectedCompanion.name}
                      className="w-full h-full object-cover transition-all duration-500 filter grayscale hover:grayscale-0"
                      width={400}
                      height={400}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-2xl font-bold text-white mb-1">{selectedCompanion.name}</h2>
                      {selectedCompanion.role && (
                        <p className="text-gray-300 uppercase tracking-wide text-sm">{selectedCompanion.role}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {selectedCompanion.bio && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                        <p className="text-gray-300 leading-relaxed">{selectedCompanion.bio}</p>
                      </div>
                    )}

                    {selectedCompanion.expertise && selectedCompanion.expertise.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCompanion.expertise.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-gray-800 text-gray-300 hover:bg-gray-700"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedCompanion.languages && selectedCompanion.languages.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCompanion.languages.map((language, index) => (
                            <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedCompanion.socialMedia && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
                        <div className="flex space-x-3">
                          {selectedCompanion.socialMedia.instagram && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-pink-600 hover:border-pink-600 hover:text-white bg-transparent"
                              onClick={() =>
                                window.open(
                                  `https://instagram.com/${selectedCompanion.socialMedia?.instagram}`,
                                  "_blank",
                                )
                              }
                            >
                              <Instagram className="h-4 w-4 mr-2" />
                              Instagram
                            </Button>
                          )}
                          {selectedCompanion.socialMedia.linkedin && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white bg-transparent"
                              onClick={() =>
                                window.open(
                                  `https://linkedin.com/in/${selectedCompanion.socialMedia?.linkedin}`,
                                  "_blank",
                                )
                              }
                            >
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Select a companion to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Responsive Adjustments */}
        <style jsx>{`
          @media (max-width: 1024px) {
            .grid-cols-1.lg\\:grid-cols-2 {
              grid-template-columns: 1fr;
            }
            .lg\\:sticky {
              position: static;
            }
            .max-h-\\[600px\\] {
              max-height: 400px;
            }
          }
          
          .scrollbar-thin {
            scrollbar-width: thin;
          }
          
          .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
            background-color: #4b5563;
            border-radius: 4px;
          }
          
          .scrollbar-track-gray-800::-webkit-scrollbar-track {
            background-color: #1f2937;
          }
          
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
        `}</style>
      </div>
    </div>
  )
}
