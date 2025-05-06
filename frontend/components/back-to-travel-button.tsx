import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackToTravelButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export function BackToTravelButton({ className, variant = "ghost" }: BackToTravelButtonProps) {
  return (
    <Button variant={variant} asChild className={className}>
      <Link href="/" className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Travel Adventures
      </Link>
    </Button>
  )
}
