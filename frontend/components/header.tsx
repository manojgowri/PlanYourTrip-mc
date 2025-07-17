"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { OfflineIndicator } from "@/components/offline-indicator"
import { PlaneIcon } from "./plane-icon" // Import PlaneIcon from the same file

export function Header() {
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <PlaneIcon className="h-6 w-6" />
          <motion.h1
            className={cn(
              "text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-transparent bg-clip-text",
              "dark:from-purple-400 dark:via-pink-300 dark:to-red-300",
            )}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            Travel Fam
          </motion.h1>
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
