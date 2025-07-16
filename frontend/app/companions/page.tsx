"use client"

import { useState, useEffect } from "react"
import { Instagram } from "lucide-react"
import { getCompanions } from "@/lib/data"
import { useLoading } from "@/contexts/loading-context"
import type { Companion } from "@/lib/models"

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null)
  const { setLoading, setLoadingMessage } = useLoading()

  useEffect(() => {
    const loadCompanions = async () => {
      try {
        setLoading(true)
        setLoadingMessage("Loading travel companions...")
        const data = await getCompanions()
        setCompanions(data)
        if (data.length > 0) {
          setSelectedCompanion(data[0])
        }
      } catch (error) {
        console.error("Error loading companions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCompanions()
  }, [setLoading, setLoadingMessage])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
          {/* Left Panel - Companions List */}
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <div className="h-full overflow-y-auto max-h-[600px] lg:max-h-full">
              {companions.map((companion, index) => (
                <div
                  key={companion.id}
                  className={`border-b border-gray-800 p-6 cursor-pointer transition-colors hover:bg-gray-900/50 ${
                    selectedCompanion?.id === companion.id ? "bg-gray-900/50" : ""
                  }`}
                  onClick={() => setSelectedCompanion(companion)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold tracking-wide uppercase">{companion.name}</h3>
                      {companion.role && (
                        <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider">{companion.role}</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {companion.instagramId && (
                        <a
                          href={`https://instagram.com/${companion.instagramId}`}
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
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Selected Companion Image */}
          <div className="flex items-center justify-center bg-gray-900/20 rounded-lg overflow-hidden">
            {selectedCompanion ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="relative w-full max-w-md aspect-square">
                  <img
                    src={selectedCompanion.image || "/placeholder.svg?height=400&width=400"}
                    alt={selectedCompanion.name}
                    className="w-full h-full object-cover rounded-lg grayscale hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Select a companion to view their photo</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-specific adjustments */}
        <style jsx>{`
          @media (max-width: 1024px) {
            .grid {
              grid-template-rows: auto 1fr;
              height: auto;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
