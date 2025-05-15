export default function ImagesTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Images Test</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-2">Budget Travel Planning Image</h2>
          <div className="border p-4 rounded-lg">
            <img
              src="/images/budget_travel_planning.jpg"
              alt="Budget travel planning"
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                console.error("Image failed to load")
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=400&width=600"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
