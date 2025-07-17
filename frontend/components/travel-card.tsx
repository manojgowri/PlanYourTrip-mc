import type React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/safe-image"
import type { Itinerary } from "@/lib/models"

interface TravelCardProps {
  itinerary: Itinerary
}

export function TravelCard({ itinerary }: TravelCardProps) {
  return (
    <Link href={`/itinerary/${itinerary._id}`} passHref>
      <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer h-full flex flex-col">
        <div className="relative w-full h-48">
          <SafeImage
            src={itinerary.image || "/placeholder.svg?height=200&width=300"}
            alt={itinerary.destination}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-3 left-3 text-xs px-2 py-1">{itinerary.category}</Badge>
          {itinerary.status === "completed" && (
            <Badge className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1">Completed</Badge>
          )}
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-semibold mb-2 leading-tight">{itinerary.destination}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">{itinerary.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mt-auto">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>
                {itinerary.startDate} - {itinerary.endDate}
              </span>
            </div>
            <div className="flex items-center justify-end">
              <UsersIcon className="w-4 h-4 mr-1" />
              <span>{itinerary.travellersCount} Travellers</span>
            </div>
            <div className="flex items-center">
              <DollarSignIcon className="w-4 h-4 mr-1" />
              <span>₹{itinerary.totalBudget?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-end">
              <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
              <span>
                {itinerary.rating?.toFixed(1)} ({itinerary.reviewsCount})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
