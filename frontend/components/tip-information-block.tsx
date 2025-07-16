"use client"

import { DollarSign, Shield, Globe, Car, Home, Info, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TipItem } from "@/lib/models"

interface TipInformationBlockProps {
  tips: TipItem[]
}

export function TipInformationBlock({ tips }: TipInformationBlockProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "money-saving":
        return <DollarSign className="h-5 w-5 text-green-600" />
      case "safety":
        return <Shield className="h-5 w-5 text-red-600" />
      case "cultural":
        return <Globe className="h-5 w-5 text-blue-600" />
      case "transportation":
        return <Car className="h-5 w-5 text-purple-600" />
      case "accommodation":
        return <Home className="h-5 w-5 text-orange-600" />
      case "general":
        return <Info className="h-5 w-5 text-gray-600" />
      default:
        return <Lightbulb className="h-5 w-5 text-yellow-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "money-saving":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
      case "safety":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
      case "cultural":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
      case "transportation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
      case "accommodation":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200"
      case "general":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
    }
  }

  if (!tips || tips.length === 0) {
    return null
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-yellow-600" />
          Travel Tips & Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="p-4 rounded-lg border bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">{getCategoryIcon(tip.category)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm">{tip.title}</h4>
                    <Badge variant="outline" className={`text-xs ${getCategoryColor(tip.category)}`}>
                      {tip.category.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
