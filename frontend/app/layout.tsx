import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastContainer } from "@/components/toast-container"
import { SplashLoader } from "@/components/splash-loader"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vietnam Travel Page",
  description: "Plan your next adventure to Vietnam!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SplashLoader />
          <ClientLayout>{children}</ClientLayout>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}
