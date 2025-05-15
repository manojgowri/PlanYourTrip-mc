"use client"

import { SafeImage } from "@/components/safe-image"

export default function ImagesTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Images Test</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-2">Budget Travel Planning Image</h2>
          <div className="border p-4 rounded-lg">
            <SafeImage
              src="/images/budget_travel_planning.jpg"
              alt="Budget travel planning"
              className="max-w-full h-auto rounded-lg"
              fallbackText="Budget travel image could not be loaded"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
