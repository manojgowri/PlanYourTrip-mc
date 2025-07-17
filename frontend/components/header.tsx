"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Plan Your Trip <span className="text-accent-foreground">Amigos</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/itinerary" className="text-sm font-medium hover:underline">
            Itineraries
          </Link>
          <div className="relative">
            <Link href="/companions" className="text-sm font-medium hover:underline">
              Travel Companions
            </Link>
            <motion.div
              className={cn(
                "absolute -bottom-6 left-1/2 -translate-x-1/2",
                "bg-gradient-to-r from-purple-500 to-pink-500",
                "text-white text-xs font-semibold px-2 py-1 rounded-full",
                "shadow-lg whitespace-nowrap",
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 1,
              }}
            >
              Come say hi to our travel fam!
            </motion.div>
          </div>
          <Link href="/contact" className="text-sm font-medium hover:underline">
            Contact
          </Link>
          <Link href="/admin" className="text-sm font-medium hover:underline">
            Admin
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
