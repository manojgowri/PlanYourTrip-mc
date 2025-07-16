"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold">
            Plan Your Trip <span className="text-emerald-600">Amigos</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-emerald-600">
            Home
          </Link>
          <div className="relative">
            <Link href="/companions" className="text-sm font-medium transition-colors hover:text-emerald-600">
              Travel Companions
            </Link>
            <div className="absolute -bottom-6 left-0 right-0">
              <p className="text-xs text-emerald-600 animate-pulse font-medium whitespace-nowrap">
                Curious about who is traveling with us?
              </p>
            </div>
          </div>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-emerald-600">
            Contact
          </Link>
          <Link href="/admin" className="text-sm font-medium transition-colors hover:text-emerald-600">
            Admin
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-4">
            <Link
              href="/"
              className="block text-sm font-medium transition-colors hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <div>
              <Link
                href="/companions"
                className="block text-sm font-medium transition-colors hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Travel Companions
              </Link>
              <p className="text-xs text-emerald-600 animate-pulse font-medium mt-1">
                Curious about who is traveling with us?
              </p>
            </div>
            <Link
              href="/contact"
              className="block text-sm font-medium transition-colors hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/admin"
              className="block text-sm font-medium transition-colors hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
