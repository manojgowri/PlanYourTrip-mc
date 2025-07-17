"use client"

import { useState, useEffect } from "react"
import { getItineraries } from "@/lib/data"
import { TravelCard } from "@/components/travel-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Itinerary } from "@/lib/models"
import { SafeImage } from "@/components/safe-image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
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
              <span className="font-medium text-white">Budget Travel Made Easy</span> - Create detailed itineraries,
              track expenses, and share your adventures with friends and family.
            </p>
          </div>
        </section>

        {/* Itineraries Section */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Featured Itineraries</h3>
          {loading ? (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300">Loading itineraries...</p>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          ) : itineraries.length === 0 ? (
            <p className="text-center text-muted-foreground">No itineraries available yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {itineraries.map((itinerary) => (
                <TravelCard key={itinerary.id} itinerary={itinerary} />
              ))}
            </div>
          )}
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
      <Footer />
    </div>
  )
}
