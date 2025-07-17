"use client"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

interface LanguageSelectorProps {
  initialLanguage?: string
  onLanguageChange?: (lang: string) => void
}

export function LanguageSelector({ initialLanguage = "en", onLanguageChange }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage)

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
    if (onLanguageChange) {
      onLanguageChange(value)
    }
    // In a real app, you'd update i18n library here
    console.log("Language changed to:", value)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="vi">Tiếng Việt</SelectItem>
          {/* Add more languages as needed */}
        </SelectContent>
      </Select>
    </div>
  )
}
