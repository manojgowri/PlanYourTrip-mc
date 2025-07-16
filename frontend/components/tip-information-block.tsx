"use client"

import { Lightbulb, DollarSign, Shield, Heart, MapPin, Camera, Utensils, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TravelTip } from "@/lib/models"

interface TipInformationBlockProps {
  tips: TravelTip[]
}

const getTipIcon = (category: string) => {
  switch (category.toLowerCase()) {
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
  switch (category.toLowerCase()) {
    case "money-saving":
      return {
        bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
        border: "border-green-200 dark:border-green-800",
        icon: "text-green-600 dark:text-green-400",
        badge: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      }
    case "safety":
      return {
        bg: "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
        border: "border-red-200 dark:border-red-800",
        icon: "text-red-600 dark:text-red-400",
        badge: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      }
    case "cultural":
      return {
        bg: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
        border: "border-purple-200 dark:border-purple-800",
        icon: "text-purple-600 dark:text-purple-400",
        badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      }
    case "navigation":
      return {
        bg: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
        border: "border-blue-200 dark:border-blue-800",
        icon: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      }
    case "photography":
      return {
        bg: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
        border: "border-pink-200 dark:border-pink-800",
        icon: "text-pink-600 dark:text-pink-400",
        badge: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
      }
    case "food":
      return {
        bg: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
        border: "border-orange-200 dark:border-orange-800",
        icon: "text-orange-600 dark:text-orange-400",
        badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      }
    case "timing":
      return {
        bg: "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20",
        border: "border-indigo-200 dark:border-indigo-800",
        icon: "text-indigo-600 dark:text-indigo-400",
        badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
      }
    default:
      return {
        bg: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20",
        border: "border-gray-200 dark:border-gray-800",
        icon: "text-gray-600 dark:text-gray-400",
        badge: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
      }
  }
}

export function TipInformationBlock({ tips }: TipInformationBlockProps) {
  if (!tips || tips.length === 0) {
    return null
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <Lightbulb className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-emerald-800 dark:text-emerald-200">Travel Tips & Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip) => {
            const colors = getTipColor(tip.category)
            return (
              <div
                key={tip.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-white/50 dark:bg-black/20 ${colors.icon}`}>
                    {getTipIcon(tip.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{tip.title}</h4>
                      <Badge className={colors.badge} variant="secondary">
                        {tip.category.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip.content}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
