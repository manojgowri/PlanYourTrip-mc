import Link from "next/link"
import { MountainSnow, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100 py-8 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <MountainSnow className="h-6 w-6 text-emerald-600" />
              <span className="sr-only">Plan Your Trip Amigos</span>
              <span className="hidden md:inline">
                Plan Your Trip <span className="text-emerald-600">Amigos</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your ultimate companion for planning unforgettable budget-friendly travel adventures.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-gray-900 dark:hover:text-white">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-gray-900 dark:hover:text-white">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-gray-900 dark:hover:text-white">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/companions" className="text-sm text-muted-foreground hover:underline">
                  Companions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="text-sm text-muted-foreground">123 Travel Lane, Adventure City, World 12345</p>
            <p className="text-sm text-muted-foreground">Email: info@planyourtripamigos.com</p>
            <p className="text-sm text-muted-foreground">Phone: +1 (234) 567-890</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-300 pt-6 text-center text-sm text-muted-foreground dark:border-gray-700">
          &copy; {new Date().getFullYear()} Plan Your Trip Amigos. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
