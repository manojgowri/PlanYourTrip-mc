"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useMobile } from "@/hooks/use-mobile"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/itinerary", label: "Itineraries" },
    { href: "/companions", label: "Companions" },
    { href: "/admin", label: "Admin" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="font-bold text-xl">
              Plan Your Trip <span className="text-primary">Amigos</span>
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}

        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side items */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col p-4 bg-background border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="py-2" onClick={closeMenu}>
              <Button variant="outline" size="sm" className="w-full">
                Login
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
