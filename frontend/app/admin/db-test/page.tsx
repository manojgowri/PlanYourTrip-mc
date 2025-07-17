"use client"

import { DbConnectionTest } from "@/components/db-connection-test"
import { AdminNav } from "@/components/admin/admin-nav"

export default function DbTestPage() {
  return (
    <div className="container mx-auto p-4">
      <AdminNav />
      <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
      <DbConnectionTest />
    </div>
  )
}
