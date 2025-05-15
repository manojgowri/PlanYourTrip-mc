"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Menu, X, Settings } from "lucide-react"
import { getAuthToken } from "@/lib/data"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    setIsAuthenticated(!!token)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-compass h-8 w-8 text-emerald-600"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            <span className="text-xl font-bold">
              Plan Your Trip <span className="text-blue-600">Amigos</span>
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:underline">
            Home
          </Link>
          <Link href="/companions" className="text-sm font-medium hover:underline">
            Travel Companions
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline">
            Contact
          </Link>
          {isAuthenticated && (
            <Link href="/admin" className="text-sm font-medium hover:underline flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg md:hidden">
            <div className="container py-4 flex flex-col gap-4">
              <Link href="/" className="text-sm font-medium hover:underline" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link
                href="/companions"
                className="text-sm font-medium hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Travel Companions
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {isAuthenticated && (
                <Link
                  href="/admin"
                  className="text-sm font-medium hover:underline flex items-center gap-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
