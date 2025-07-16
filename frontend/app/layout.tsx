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
  title: "Plan Your Trip Amigos - Vietnam Travel Adventures",
  description:
    "Discover amazing travel itineraries and plan your perfect Vietnam adventure with detailed guides, tips, and local insights.",
  keywords: "Vietnam travel, travel planning, itinerary, adventure, tourism, travel guide",
  authors: [{ name: "Plan Your Trip Amigos" }],
  creator: "Plan Your Trip Amigos",
  publisher: "Plan Your Trip Amigos",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://planyourtripamigos.vercel.app",
    title: "Plan Your Trip Amigos - Vietnam Travel Adventures",
    description:
      "Discover amazing travel itineraries and plan your perfect Vietnam adventure with detailed guides, tips, and local insights.",
    siteName: "Plan Your Trip Amigos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan Your Trip Amigos - Vietnam Travel Adventures",
    description:
      "Discover amazing travel itineraries and plan your perfect Vietnam adventure with detailed guides, tips, and local insights.",
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
            <div className="relative flex min-h-screen flex-col">
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
