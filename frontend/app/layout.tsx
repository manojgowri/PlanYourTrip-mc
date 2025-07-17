import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ToastContainer } from "@/components/toast-container"
import OfflineIndicator from "@/components/offline-indicator"
import LanguageSelector from "@/components/language-selector"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vietnam Travel Itinerary",
  description: "Explore Vietnam with our curated travel itineraries.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <OfflineIndicator />
          <LanguageSelector />
          {children}
          <ToastContainer />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
