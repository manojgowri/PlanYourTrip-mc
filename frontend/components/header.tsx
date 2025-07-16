"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">
            Plan Your Trip <span className="text-emerald-600">Amigos</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-emerald-600">
            Home
          </Link>
          <Link href="/companions" className="text-sm font-medium transition-colors hover:text-emerald-600">
            Travel Companions
          </Link>
          <div className="relative">
            <div className="animate-pulse text-xs text-emerald-600 font-medium absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              Curious about who is traveling with us?
            </div>
          </div>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-emerald-600">
            Contact
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={toggleMenu} className="h-9 w-9 p-0">
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/companions"
              className="text-sm font-medium transition-colors hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Travel Companions
            </Link>
            <div className="text-xs text-emerald-600 font-medium animate-pulse">
              Curious about who is traveling with us?
            </div>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
