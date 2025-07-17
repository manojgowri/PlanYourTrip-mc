"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState("en") // Default to English

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang)
    // In a real application, you would change the locale here
    // e.g., using Next.js i18n routing or a context provider
    console.log(`Language changed to: ${lang}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("es")}>Español</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>Français</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("de")}>Deutsch</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("hi")}>हिंदी</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
