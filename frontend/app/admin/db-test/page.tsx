import { DbConnectionTest } from "@/components/db-connection-test"

export default function DbTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Database Connection Testing</h1>
      <DbConnectionTest />
    </div>
  )
}
