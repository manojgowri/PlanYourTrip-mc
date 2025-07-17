import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plan Your Trip Amigos",
  description: "Your ultimate travel planning companion.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

import ClientLayout from "./client-layout"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
