"use client"

import { useState, useEffect } from "react"
import { getItineraries } from "@/lib/data"
import { TravelCard } from "@/components/travel-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Itinerary } from "@/lib/models"
import { SafeImage } from "@/components/safe-image"
import { Compass } from "lucide-react"

export default function Home() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Slider images
  const sliderImages = [
    "/images/budget_travel_planning.jpg",
    "/images/travel-adventures-bg.jpg",
    "/images/backgroundimage.jpg",
  ]

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true)
        const data = await getItineraries()
        setItineraries(data)
      } catch (err) {
        console.error("Error fetching itineraries:", err)
        setError("Failed to load itineraries. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchItineraries()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1))
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Background Image */}
      <section
        className="relative py-24 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/backgroundimage.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            <span className="text-emerald-400">Plan Your Trip</span> <span className="text-amber-500">Amigos</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200">
            <span className="font-medium text-white">Budget Travel Made Easy</span> - Create detailed itineraries, track
            expenses, and share your adventures with friends and family.
          </p>
        </div>
      </section>

      {/* Itineraries Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Travel Adventures</h2>
          </div>

          {loading ? (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300">Loading itineraries...</p>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          ) : itineraries.length === 0 ? (
            <div className="rounded-md bg-amber-50 p-8 text-center dark:bg-amber-900/20">
              <Compass className="mx-auto mb-4 h-12 w-12 text-amber-500" />
              <h3 className="mb-2 text-xl font-semibold text-amber-800 dark:text-amber-300">No adventures yet</h3>
              <p className="text-amber-700 dark:text-amber-400">
                Your travel adventures will appear here once you create them.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {itineraries.map((itinerary) => (
                <TravelCard key={itinerary.id} itinerary={itinerary} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="bg-gray-100 py-12 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">Travel Inspiration</h2>

          <div className="relative mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <div className="relative h-[400px] w-full">
                {sliderImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <SafeImage
                      src={image}
                      alt={`Travel inspiration ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md transition-colors hover:bg-white"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md transition-colors hover:bg-white"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="mt-4 flex justify-center gap-2">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index === currentSlide ? "bg-emerald-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
