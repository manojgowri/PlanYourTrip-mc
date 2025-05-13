import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Itinerary } from "@/lib/models"
import { getImageUrl } from "@/lib/image-utils"

interface TravelCardProps {
  itinerary: Itinerary
}

export function TravelCard({ itinerary }: TravelCardProps) {
  const { id, destination, startDate, endDate, image, description, locations, season, isCompleted } = itinerary

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        {isCompleted && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="bg-white text-black font-medium">
              Completed
            </Badge>
          </div>
        )}
        <div className="aspect-video bg-gray-100 relative">
          <img
            src={getImageUrl(image) || "/placeholder.svg"}
            alt={destination}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=300&width=300"
            }}
          />
        </div>
      </div>

      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{destination}</h3>
          {season && (
            <Badge variant="outline" className="ml-2">
              {season}
            </Badge>
          )}
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </div>

        {locations && locations.length > 0 && (
          <div className="flex items-start text-gray-600 dark:text-gray-400 mb-3">
            <MapPin className="h-4 w-4 mr-1 mt-0.5" />
            <span className="text-sm">{locations.join(", ")}</span>
          </div>
        )}

        {description && <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{description}</p>}

        <Link
          href={`/itinerary/${id}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm mt-auto"
        >
          View Itinerary
        </Link>
      </CardContent>
    </Card>
  )
}
