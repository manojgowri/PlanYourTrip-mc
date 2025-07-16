"use client"

import { Lightbulb, DollarSign, Shield, Globe, Clock, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TipItem } from "@/lib/models"

interface TipInformationBlockProps {
  tips: TipItem[]
}

export function TipInformationBlock({ tips }: TipInformationBlockProps) {
  const getCategoryIcon = (category: TipItem["category"]) => {
    switch (category) {
      case "money-saving":
        return <DollarSign className="h-5 w-5" />
      case "safety":
        return <Shield className="h-5 w-5" />
      case "cultural":
        return <Globe className="h-5 w-5" />
      case "transportation":
        return <Clock className="h-5 w-5" />
      case "accommodation":
        return <Info className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: TipItem["category"]) => {
    switch (category) {
      case "money-saving":
        return "text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400"
      case "safety":
        return "text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400"
      case "cultural":
        return "text-purple-600 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-400"
      case "transportation":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400"
      case "accommodation":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-400"
      default:
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-400"
    }
  }

  const getCategoryGradient = (category: TipItem["category"]) => {
    switch (category) {
      case "money-saving":
        return "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
      case "safety":
        return "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20"
      case "cultural":
        return "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20"
      case "transportation":
        return "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
      case "accommodation":
        return "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20"
      default:
        return "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20"
    }
  }

  if (!tips || tips.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-yellow-600" />
          Travel Tips & Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Expert recommendations to make your trip memorable and hassle-free
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className={`p-4 rounded-lg border bg-gradient-to-br ${getCategoryGradient(tip.category)} hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 p-2 rounded-full ${getCategoryColor(tip.category)}`}>
                  {getCategoryIcon(tip.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{tip.title}</h4>
                    <Badge variant="outline" className={getCategoryColor(tip.category)}>
                      {tip.category.replace("-", " ")}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
