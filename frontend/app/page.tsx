import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, MapPin, Users, DollarSign } from "lucide-react"
import { getTravelItineraries } from "@/lib/data"
import { TravelCard } from "@/components/travel-card"
import type { TravelItinerary } from "@/lib/models"

export default async function HomePage() {
  const itineraries: TravelItinerary[] = await getTravelItineraries()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
          Your Ultimate Travel Planner
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground sm:mt-5">
          Plan, organize, and enjoy your trips with ease. From detailed itineraries to budget tracking, we&apos;ve got
          you covered.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/itinerary/new">Start Planning</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/companions">Find Companions</Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-6xl mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Plane className="mx-auto h-12 w-12 text-primary mb-2" />
              <CardTitle>Effortless Itineraries</CardTitle>
            </CardHeader>
            <CardContent>Create detailed day-by-day plans for your adventures.</CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <MapPin className="mx-auto h-12 w-12 text-primary mb-2" />
              <CardTitle>Destination Guides</CardTitle>
            </CardHeader>
            <CardContent>Discover hidden gems and popular spots for your next trip.</CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Users className="mx-auto h-12 w-12 text-primary mb-2" />
              <CardTitle>Travel Companions</CardTitle>
            </CardHeader>
            <CardContent>Connect with fellow travelers and share experiences.</CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <DollarSign className="mx-auto h-12 w-12 text-primary mb-2" />
              <CardTitle>Budget Tracking</CardTitle>
            </CardHeader>
            <CardContent>Keep an eye on your expenses and stay within budget.</CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-8">Your Recent Itineraries</h2>
        {itineraries.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p className="mb-4">No itineraries found. Start planning your first adventure!</p>
            <Button asChild>
              <Link href="/itinerary/new">Create New Itinerary</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <TravelCard key={itinerary._id} itinerary={itinerary} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
