import Link from "next/link"
import { Compass } from "lucide-react"

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
                <Link href="/admin" className="text-muted-foreground hover:text-emerald-600">
                  Admin Access
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Email: hello@planyourtrip.com</li>
              <li className="text-muted-foreground">Instagram: @planyourtrip</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PlanYourTrip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
