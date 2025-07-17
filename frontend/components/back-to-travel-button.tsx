"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export function BackToTravelButton() {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.back()} className="mb-6 flex items-center gap-2">
      <ChevronLeft className="h-4 w-4" />
      Back to Travel Adventures
    </Button>
  )
}
