import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AdminNav() {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button asChild variant="outline">
        <Link href="/admin">Dashboard</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/admin/db-test">Test Database</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/">Back to Site</Link>
      </Button>
    </div>
  )
}
