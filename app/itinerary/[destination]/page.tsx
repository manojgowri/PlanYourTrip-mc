import Link from "next/link"
import { ArrowLeft, MapPin, Utensils, Hotel, Star } from "lucide-react"
import { ItineraryDay } from "@/components/itinerary-day"
import { getItinerary } from "@/lib/data"
import { Footer } from "@/components/footer"
import { CommentSection } from "@/components/comment-section"

interface ItineraryPageProps {
  params: {
    destination: string
  }
}

export default function ItineraryPage({ params }: ItineraryPageProps) {
  const destination = params.destination
  const formattedDestination = destination.charAt(0).toUpperCase() + destination.slice(1)

  // In a real app, this would fetch from a database
  const itinerary = getItinerary(destination)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-1 px-4 py-8">
        <Link href="/" className="mb-6 flex items-center gap-2 text-emerald-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Travel Plans
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{formattedDestination} Itinerary</h1>
              <p className="mt-2 text-muted-foreground">May 15, 2023 - May 30, 2023 • Detailed travel plan</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400/50 text-yellow-400" />
              </div>
              <span className="font-medium">4.7</span>
              <span className="text-sm text-muted-foreground">(24 reviews)</span>
            </div>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border p-4 shadow-sm">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="font-medium">Locations</h3>
              <p className="text-sm text-muted-foreground">Hanoi, Ha Long Bay, Hoi An, Ho Chi Minh City</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-4 shadow-sm">
            <Hotel className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="font-medium">Accommodations</h3>
              <p className="text-sm text-muted-foreground">4 Hotels, 1 Resort</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-4 shadow-sm">
            <Utensils className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="font-medium">Restaurants</h3>
              <p className="text-sm text-muted-foreground">12 Recommended Places</p>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Daily Itinerary</h2>

          <ItineraryDay
            day={1}
            date="May 15, 2023"
            location="Hanoi"
            activities={[
              {
                time: "09:00 AM",
                title: "Arrival at Noi Bai International Airport",
                description: "Check-in at Hanoi La Siesta Hotel & Spa",
                type: "travel",
              },
              {
                time: "12:00 PM",
                title: "Lunch at Bún Chả Hương Liên",
                description: "Famous spot where Anthony Bourdain dined with Barack Obama",
                type: "food",
              },
              {
                time: "02:00 PM",
                title: "Old Quarter Walking Tour",
                description: "Explore the historic streets and shops of Hanoi's Old Quarter",
                type: "activity",
              },
              {
                time: "06:00 PM",
                title: "Dinner at Cha Ca La Vong",
                description: "Try the famous fish dish that the restaurant is named after",
                type: "food",
              },
            ]}
          />

          <ItineraryDay
            day={2}
            date="May 16, 2023"
            location="Hanoi"
            activities={[
              {
                time: "08:00 AM",
                title: "Breakfast at Hotel",
                description: "Continental breakfast included with stay",
                type: "food",
              },
              {
                time: "09:30 AM",
                title: "Ho Chi Minh Mausoleum",
                description: "Visit the memorial dedicated to the Vietnamese leader",
                type: "activity",
              },
              {
                time: "12:30 PM",
                title: "Lunch at Quan An Ngon",
                description: "Sample a variety of Vietnamese street food in a restaurant setting",
                type: "food",
              },
              {
                time: "03:00 PM",
                title: "Temple of Literature",
                description: "Explore Vietnam's first national university",
                type: "activity",
              },
              {
                time: "07:00 PM",
                title: "Water Puppet Show",
                description: "Evening performance at Thang Long Water Puppet Theatre",
                type: "activity",
              },
            ]}
          />

          {/* More days would be added here */}
        </section>

        <CommentSection />
      </div>
      <Footer />
    </div>
  )
}
