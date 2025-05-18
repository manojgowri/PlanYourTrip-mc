"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Compass, Mail, Instagram, Youtube, LogIn, LogOut } from "lucide-react"
import { getAuthToken } from "@/lib/data"
import { useRouter } from "next/navigation"

export function Footer() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_user")
      setIsAuthenticated(false)
      router.push("/")
    }
  }

  return (
    <footer className="border-t bg-slate-50 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Plan Your Trip <span className="text-amber-500">Amigos</span>
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground dark:text-gray-400">
              Your personal travel planner and itinerary manager. Keep track of your adventures and share them with
              friends and family.
            </p>
            <div className="mt-4">
              <a
                href="https://www.youtube.com/@MVVibez?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <Youtube className="h-4 w-4" />
                Subscribe to MV Vibez
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/companions"
                  className="text-muted-foreground hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  Travel Companions
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <a href="mailto:mvvibez@gmail.com" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  mvvibez@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                <Instagram className="h-4 w-4" />
                <a
                  href="https://www.instagram.com/_iam_mv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  @_iam_mv
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                <Instagram className="h-4 w-4" />
                <a
                  href="https://www.instagram.com/shotsbymanojv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  @shotsbymanojv
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                <Youtube className="h-4 w-4" />
                <a
                  href="https://www.youtube.com/@MVVibez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  @MVVibez
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-4 text-center text-sm text-muted-foreground dark:text-gray-500">
          <p>© {new Date().getFullYear()} Plan Your Trip Amigos. All rights reserved.</p>
          <p className="mt-1">Created by Manoj V - Software Developer, Videographer, Video Editor</p>
          <div className="mt-4 flex justify-center">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground flex items-center gap-1 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <LogOut className="h-3 w-3" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground flex items-center gap-1 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <LogIn className="h-3 w-3" />
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
