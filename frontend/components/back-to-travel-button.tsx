"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackToTravelButton() {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.push("/")}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Travel Adventures
    </Button>
  )
}
