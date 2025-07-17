"use client"

import Link from "next/link"
import { Plane } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { CurrencySelector } from "@/components/currency-selector"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface HeaderProps {
  isAdminRoute: boolean
}

export function Header({ isAdminRoute }: HeaderProps) {
  const isMobile = useMobile()

  const navLinks = (
    <>
      <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
        Home
      </Link>
      <Link href="/companions" className="text-sm font-medium hover:text-primary transition-colors">
        Companions
      </Link>
      <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
        Contact
      </Link>
      {isAdminRoute && (
        <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
          Admin
        </Link>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 mr-6">
            <Plane className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Travel Planner</span>
          </Link>
          {!isMobile && <nav className="hidden md:flex items-center space-x-4">{navLinks}</nav>}
        </div>
        <div className="flex items-center space-x-2">
          <CurrencySelector />
          <LanguageSelector />
          <ThemeToggle />
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 pt-6">{navLinks}</nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
