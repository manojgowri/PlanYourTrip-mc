import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 px-4 md:px-6 border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">About Us</h3>
          <p className="text-sm text-muted-foreground">
            We help you plan your perfect travel adventures, making every trip memorable and hassle-free.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <nav className="space-y-2">
            <Link className="block text-sm text-muted-foreground hover:text-primary" href="/" prefetch={false}>
              Home
            </Link>
            <Link
              className="block text-sm text-muted-foreground hover:text-primary"
              href="/companions"
              prefetch={false}
            >
              Companions
            </Link>
            <Link className="block text-sm text-muted-foreground hover:text-primary" href="/admin" prefetch={false}>
              Admin Dashboard
            </Link>
            <Link className="block text-sm text-muted-foreground hover:text-primary" href="/contact" prefetch={false}>
              Contact Us
            </Link>
          </nav>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>info@travelamigos.com</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </p>
            <p>123 Adventure Lane, Wanderlust City, TRV 98765</p>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Travel Amigos. All rights reserved.
      </div>
    </footer>
  )
}
