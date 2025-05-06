// Add this at the top of the file, after the imports
import { BackToTravelButton } from "@/components/back-to-travel-button"

// Replace the existing back link with this component
// Find this section in the existing code:
// <div className="mb-6 flex items-center justify-between">
//   <div className="flex items-center gap-2">
//     <Link href="/" className="flex items-center gap-2 text-emerald-600 hover:underline">
//       <ArrowLeft className="h-4 w-4" />
//       Back to Home
//     </Link>
//   </div>

// And replace with:
export default function Page() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <BackToTravelButton />
      </div>
    </div>
  )
}
