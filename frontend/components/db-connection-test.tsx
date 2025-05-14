"use client"

import { useState } from "react"
import { testDatabaseConnection } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DbConnectionTest() {
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setLoading(true)
    setError(null)

    try {
      // Test database connection
      const dbTest = await testDatabaseConnection()
      setDbStatus(dbTest)
    } catch (err: any) {
      setError(err.message || "An error occurred during testing")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={runTests} disabled={loading} className="w-full">
            {loading ? "Testing..." : "Test Database Connection"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {dbStatus && (
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-bold mb-2">Database Status</h3>
              <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">{JSON.stringify(dbStatus, null, 2)}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
