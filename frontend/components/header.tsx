"use client"

import type React from "react"

import Link from "next/link"
import { ModeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Header() {
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-4">
        <Link className="flex items-center gap-2" href="/">
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
      </div>
      <nav className="flex items-center gap-4">
        <Link className="font-medium hover:underline" href="/companions">
          Companions
        </Link>
        <Link className="font-medium hover:underline" href="/admin">
          Admin
        </Link>
        <Link className="font-medium hover:underline" href="/contact">
          Contact
        </Link>
        <ModeToggle />
        <LanguageSelector />
      </nav>
    </header>
  )
}

function PlaneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.8 19.2 16 11.4l4.8-1.4c.4-1.1-.2-2.3-1.3-2.7l-10-.7L3.9 2.9c-1.1-.4-2.3.2-2.7 1.3L2 10.4l7.8 1.8L11.4 16l7.8 1.8c1.1.4 2.3-.2 2.7-1.3l.7-1.9c.4-1.1-.2-2.3-1.3-2.7L17.8 19.2Z" />
      <path d="m15 10-5 5" />
    </svg>
  )
}
