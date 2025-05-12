"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCompanions, type Companion } from "@/lib/data"

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        setLoading(true)
        const data = await getCompanions()
        setCompanions(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching companions:", error)
        setLoading(false)
      }
    }

    fetchCompanions()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-1 px-4 py-8">
        <Link href="/" className="mb-6 flex items-center gap-2 text-emerald-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <header className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold">Travel Companions</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Meet the amazing people who join me on my adventures around the world.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-12">
            <p>Loading companions...</p>
          </div>
        ) : companions.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              {companions.map((companion) => (
                <div
                  key={companion.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-emerald-50 ${
                    selectedCompanion?.id === companion.id ? "border-emerald-500 bg-emerald-50" : ""
                  }`}
                  onMouseEnter={() => setSelectedCompanion(companion)}
                  onClick={() => setSelectedCompanion(companion)}
                >
                  <h3 className="text-lg font-medium">{companion.name}</h3>
                  <p className="text-sm text-emerald-600">Role: {companion.relationship}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{companion.bio}</p>
                </div>
              ))}
            </div>

            <div className="sticky top-4 hidden md:block">
              <div className="overflow-hidden rounded-lg border bg-white p-4 shadow-sm">
                {selectedCompanion ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 overflow-hidden rounded-lg">
                      <img
                        src={selectedCompanion.image || "/placeholder.svg"}
                        alt={selectedCompanion.name}
                        className="h-80 w-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-medium">{selectedCompanion.name}</h3>
                    <p className="text-emerald-600">Role: {selectedCompanion.relationship}</p>
                  </div>
                ) : (
                  <div className="flex h-80 items-center justify-center text-center text-muted-foreground">
                    <p>Select a companion to see their photo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile view for the selected companion */}
            {selectedCompanion && (
              <div className="mt-4 block rounded-lg border bg-white p-4 shadow-sm md:hidden">
                <div className="text-center">
                  <div className="mx-auto mb-4 overflow-hidden rounded-lg">
                    <img
                      src={selectedCompanion.image || "/placeholder.svg"}
                      alt={selectedCompanion.name}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium">{selectedCompanion.name}</h3>
                  <p className="text-emerald-600">Role: {selectedCompanion.relationship}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12">
              <h3 className="mb-2 text-lg font-medium">No companions yet</h3>
              <p className="text-muted-foreground">Travel companions will be added by the administrator soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
