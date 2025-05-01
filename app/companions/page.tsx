"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"

interface Companion {
  id: number
  name: string
  relationship: string
  bio: string
  image: string
}

const companions: Companion[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    relationship: "Best Friend",
    bio: "Sarah has been my travel buddy for over 5 years. We've explored 12 countries together and she's always up for an adventure!",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    name: "Michael Chen",
    relationship: "College Friend",
    bio: "Michael is a photography enthusiast who captures the most amazing travel moments. He's particularly fond of street food adventures.",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    relationship: "Sister",
    bio: "My sister Emma joins me on family trips. She's the best at finding hidden local gems and speaking with locals.",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    name: "David Kim",
    relationship: "Hiking Partner",
    bio: "David is my go-to companion for outdoor adventures. He's climbed mountains on three continents and never gets tired.",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 5,
    name: "Priya Patel",
    relationship: "Foodie Friend",
    bio: "Priya and I bond over trying new cuisines. She's a culinary expert who knows the best restaurants in every city we visit.",
    image: "/placeholder.svg?height=400&width=300",
  },
]

export default function CompanionsPage() {
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null)

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
            Meet the amazing people who join me on my adventures around the world. Hover over their names to see their
            photos.
          </p>
        </header>

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
                <p className="text-sm text-emerald-600">{companion.relationship}</p>
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
                  <p className="text-emerald-600">{selectedCompanion.relationship}</p>
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center text-center text-muted-foreground">
                  <p>Hover over a companion to see their photo</p>
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
                <p className="text-emerald-600">{selectedCompanion.relationship}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
