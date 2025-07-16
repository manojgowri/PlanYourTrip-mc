import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LoadingProvider } from "@/contexts/loading-context"
import { GlobalLoader } from "@/components/global-loader"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToastContainer } from "@/components/toast-container"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plan Your Trip Amigos - Travel Itinerary Planner",
  description: "Plan your perfect trip with detailed itineraries, travel companions, and expert tips.",
  keywords: "travel, itinerary, planning, vacation, trip, travel companions",
  authors: [{ name: "Plan Your Trip Amigos" }],
  creator: "Plan Your Trip Amigos",
  publisher: "Plan Your Trip Amigos",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LoadingProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <GlobalLoader />
            <ToastContainer />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
