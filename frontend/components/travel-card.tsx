import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users, Plane } from "lucide-react"
import type { TravelItinerary } from "@/lib/models"
import { formatCurrency } from "@/lib/currency-utils"

interface TravelCardProps {
  itinerary: TravelItinerary
}

export function TravelCard({ itinerary }: TravelCardProps) {
  const startDate = new Date(itinerary.startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const endDate = new Date(itinerary.endDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const totalEstimatedCost = itinerary.expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Link href={`/itinerary/${itinerary._id}`}>
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src={itinerary.imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={itinerary.destination}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
          {itinerary.completed && <Badge className="absolute top-2 left-2 bg-emerald-500 text-white">Completed</Badge>}
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="text-xl font-semibold mb-2">{itinerary.destination}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-1">
            <MapPin className="h-4 w-4 mr-2" /> {itinerary.location}
          </div>
          <div className="flex items-center text-muted-foreground text-sm mb-1">
            <Calendar className="h-4 w-4 mr-2" /> {startDate} - {endDate}
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Users className="h-4 w-4 mr-2" /> {itinerary.companions.length} Companions
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t flex justify-between items-center">
          <div className="text-lg font-bold text-primary">{formatCurrency(totalEstimatedCost)}</div>
          <Button variant="outline" size="sm">
            View Details <Plane className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
