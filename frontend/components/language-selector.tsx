"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { languages, getPreferredLanguage, setPreferredLanguage, type LanguageSelectorProps } from "@/lib/language-utils"

export function LanguageSelector({ onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState(getPreferredLanguage())

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = () => setIsOpen(false)
    document.addEventListener("click", handleClickOutside)

    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleLanguageChange = (langCode: string) => (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the document click handler from firing
    setSelectedLang(langCode)
    setPreferredLanguage(langCode)
    setIsOpen(false)

    if (onChange) {
      onChange(langCode)
    }

    // Reload the page to apply language changes
    // In a real app, you might use a context provider instead
    window.location.reload()
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the document click handler from firing
    setIsOpen(!isOpen)
  }

  const selectedLanguage = languages[selectedLang as keyof typeof languages]

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2" onClick={toggleDropdown}>
        <span className="mr-1">{selectedLanguage.flag}</span>
        <span className="hidden sm:inline">{selectedLanguage.name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 rounded-md bg-white dark:bg-gray-800 shadow-lg z-10 py-1">
          {Object.values(languages).map((lang) => (
            <button
              key={lang.code}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleLanguageChange(lang.code)}
            >
              <span className="mr-2">{lang.flag}</span>
              <span>{lang.name}</span>
              {selectedLang === lang.code && <Check size={16} className="ml-auto text-green-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
