import Link from "next/link"
import { Compass, MapPin } from "lucide-react"
import { TravelCard } from "@/components/travel-card"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-1 px-4 py-8">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold">PlanYourTrip</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/companions" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Travel Companions
            </Link>
            {/* Admin link removed from public view */}
          </div>
        </header>

        <section className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold">Our Travel Adventures</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We're a group of budget travelers exploring the world together. Follow our journeys and discover how we
              experience amazing destinations without breaking the bank!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TravelCard
              destination="Vietnam"
              image="/placeholder.svg?height=300&width=400"
              description="Exploring the beauty of Vietnam - from bustling cities to serene landscapes."
              startDate="May 15, 2023"
              endDate="May 30, 2023"
              locations={["Hanoi", "Ha Long Bay", "Hoi An", "Ho Chi Minh City"]}
              status="online"
              season="Spring"
              days={15}
              rating={4.7}
              reviewCount={24}
            />
            <TravelCard
              destination="Thailand"
              image="/placeholder.svg?height=300&width=400"
              description="Discovering the rich culture and stunning beaches of Thailand."
              startDate="December 10, 2022"
              endDate="December 25, 2022"
              locations={["Bangkok", "Chiang Mai", "Phuket"]}
              status="completed"
              season="Winter"
              days={15}
              rating={4.9}
              reviewCount={32}
            />
            <TravelCard
              destination="Japan"
              image="/placeholder.svg?height=300&width=400"
              description="Experiencing the perfect blend of tradition and modernity in Japan."
              startDate="March 5, 2022"
              endDate="March 20, 2022"
              locations={["Tokyo", "Kyoto", "Osaka", "Hiroshima"]}
              status="completed"
              season="Spring"
              days={15}
              rating={4.8}
              reviewCount={18}
            />
          </div>
        </section>

        <section className="mb-12">
          <div className="rounded-xl bg-emerald-50 p-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold">Budget Travel Made Easy</h2>
                <p className="mb-6 text-muted-foreground">
                  We know the struggle of traveling on a budget. That's why we share our detailed itineraries,
                  affordable accommodations, and money-saving tips to help fellow budget travelers explore the world.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Affordable Accommodations</h3>
                      <p className="text-sm text-muted-foreground">
                        We find and share the best budget-friendly places to stay.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Local Food Recommendations</h3>
                      <p className="text-sm text-muted-foreground">
                        Discover delicious and inexpensive local eateries.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Hidden Gems</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore off-the-beaten-path locations that tourists often miss.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-full overflow-hidden rounded-lg sm:h-80">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Budget travel planning"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
