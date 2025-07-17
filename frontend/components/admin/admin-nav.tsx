"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./mode-toggle"

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center">
      <ul className="flex space-x-4">
        <li>
          <Link
            href="/admin"
            className={cn("text-lg font-medium hover:text-primary", {
              "text-primary": pathname === "/admin",
            })}
          >
            Admin Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/admin/db-test"
            className={cn("text-lg font-medium hover:text-primary", {
              "text-primary": pathname === "/admin/db-test",
            })}
          >
            DB Test
          </Link>
        </li>
      </ul>
      <ModeToggle />
    </nav>
  )
}
