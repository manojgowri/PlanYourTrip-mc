import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToastContainer } from "@/components/toast-container"
import { OfflineIndicator } from "@/components/offline-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plan Your Trip Amigos",
  description: "Your personal travel planner and itinerary manager",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastContainer />
          <OfflineIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
