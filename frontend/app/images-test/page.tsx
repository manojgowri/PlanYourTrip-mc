import { SafeImage } from "@/components/safe-image"

export default function ImagesTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Image Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Placeholder Image (Default)</h2>
          <SafeImage src="/placeholder.svg" alt="Default Placeholder" className="w-full h-48 object-cover rounded-md" />
          <p className="text-sm text-muted-foreground mt-2">Uses `/placeholder.svg` with default dimensions.</p>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Placeholder Image (Custom Dimensions)</h2>
          <SafeImage
            src="/placeholder.svg?height=300&width=400"
            alt="Custom Placeholder"
            className="w-full h-48 object-cover rounded-md"
          />
          <p className="text-sm text-muted-foreground mt-2">Uses `/placeholder.svg?height=300&width=400`.</p>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Local Image (Public Folder)</h2>
          <SafeImage
            src="/images/budget_travel_planning.jpg"
            alt="Budget Travel Planning"
            className="w-full h-48 object-cover rounded-md"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Loads from `frontend/public/images/budget_travel_planning.jpg`.
          </p>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">External Image (Example)</h2>
          <SafeImage
            src="https://images.unsplash.com/photo-1501785888041-af3ba6f60648?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="External Example Image"
            className="w-full h-48 object-cover rounded-md"
          />
          <p className="text-sm text-muted-foreground mt-2">Loads an external image from Unsplash.</p>
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Missing Image (Fallback)</h2>
          <SafeImage
            src="/non-existent-image.jpg"
            alt="Missing Image"
            className="w-full h-48 object-cover rounded-md"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Shows placeholder if `src` is invalid or image fails to load.
          </p>
        </div>
      </div>
    </div>
  )
}
