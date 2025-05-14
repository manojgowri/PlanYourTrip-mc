import Link from "next/link"
import { Compass, Mail, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-bold">PlanYourTrip</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
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
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-emerald-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/companions" className="text-muted-foreground hover:text-emerald-600">
                  Travel Companions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-emerald-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:mvvibez@gmail.com" className="hover:text-emerald-600">
                  mvvibez@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Instagram className="h-4 w-4" />
                <a
                  href="https://www.instagram.com/_iam_mv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600"
                >
                  @_iam_mv
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Instagram className="h-4 w-4" />
                <a
                  href="https://www.instagram.com/shotsbymanojv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600"
                >
                  @shotsbymanojv
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Youtube className="h-4 w-4" />
                <a
                  href="https://www.youtube.com/@MVVibez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600"
                >
                  @MVVibez
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PlanYourTrip. All rights reserved.</p>
          <p className="mt-1">Created by Manoj V - Software Developer, Videographer, Video Editor</p>
        </div>
      </div>
    </footer>
  )
}
