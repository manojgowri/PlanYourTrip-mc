"use client"

import { useState, useEffect } from "react"
import DbConnectionTest from "@/components/db-connection-test"

const AdminDBTestPage = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div>
      <h1>Admin - DB Connection Test</h1>
      {mounted && <DbConnectionTest />}
    </div>
  )
}

export default AdminDBTestPage
