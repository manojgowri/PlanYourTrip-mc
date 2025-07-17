"use client"

import Link from "next/link"
import { MountainSnow, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { OfflineIndicator } from "@/components/offline-indicator"
import { motion } from "framer-motion"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <MountainSnow className="h-6 w-6 text-emerald-600" />
          <span className="sr-only">Plan Your Trip Amigos</span>
          <span className="hidden md:inline">
            Plan Your Trip <span className="text-emerald-600">Amigos</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/companions" className="text-sm font-medium hover:underline">
            Companions
          </Link>
          <Link href="/admin" className="text-sm font-medium hover:underline">
            Admin Panel
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline">
            Contact
          </Link>
          <ThemeToggle />
          <LanguageSelector />
          <OfflineIndicator />
          <motion.div
            className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 text-sm font-medium text-white shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              Come say hi to our travel fam!
            </motion.span>
          </motion.div>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden bg-transparent">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 py-6">
              <Link href="/companions" className="text-lg font-medium hover:underline">
                Companions
              </Link>
              <Link href="/admin" className="text-lg font-medium hover:underline">
                Admin Panel
              </Link>
              <Link href="/contact" className="text-lg font-medium hover:underline">
                Contact
              </Link>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <LanguageSelector />
              </div>
              <OfflineIndicator />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
