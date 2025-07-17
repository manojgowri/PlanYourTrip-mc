"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function BackToTravelButton() {
  const router = useRouter()
  return (
    <Button variant="outline" onClick={() => router.push("/")}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Travel
    </Button>
  )
}
