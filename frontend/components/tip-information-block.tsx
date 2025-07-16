"use client"

import { Lightbulb, DollarSign, Shield, Heart, MapPin, Camera, Utensils, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TipItem } from "@/lib/models"

interface TipInformationBlockProps {
  tips: TipItem[]
}

const getTipIcon = (category: string) => {
  switch (category) {
    case "money-saving":
      return <DollarSign className="h-5 w-5" />
    case "safety":
      return <Shield className="h-5 w-5" />
    case "cultural":
      return <Heart className="h-5 w-5" />
    case "navigation":
      return <MapPin className="h-5 w-5" />
    case "photography":
      return <Camera className="h-5 w-5" />
    case "food":
      return <Utensils className="h-5 w-5" />
    case "timing":
      return <Clock className="h-5 w-5" />
    default:
      return <Lightbulb className="h-5 w-5" />
  }
}

const getTipColor = (category: string) => {
  switch (category) {
    case "money-saving":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    case "safety":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    case "cultural":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
    case "navigation":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    case "photography":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300"
    case "food":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
    case "timing":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
  }
}

export function TipInformationBlock({ tips }: TipInformationBlockProps) {
  if (!tips || tips.length === 0) {
    return null
  }

  return (
    <Card className="border-2 border-yellow-200 dark:border-yellow-800">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
          <Lightbulb className="h-6 w-6" />
          Travel Tips & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="flex gap-3 p-4 rounded-lg border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-shadow"
            >
              <div className={`flex-shrink-0 p-2 rounded-full ${getTipColor(tip.category)}`}>
                {getTipIcon(tip.category)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{tip.title}</h4>
                  <Badge variant="secondary" className={getTipColor(tip.category)}>
                    {tip.category.replace("-", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
