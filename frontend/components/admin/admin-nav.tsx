import Link from "next/link"
import ModeToggle from "./mode-toggle"
import SaveChangesButton from "./save-changes-button"
import CompleteStatusButton from "./complete-status-button"

const AdminNav = () => {
  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center">
      <div>
        <Link href="/admin" className="text-blue-500 hover:text-blue-700">
          Admin Home
        </Link>
        <Link href="/admin/db-test" className="ml-4 text-blue-500 hover:text-blue-700">
          DB Test
        </Link>
      </div>
      <div className="flex items-center">
        <ModeToggle />
        <SaveChangesButton />
        <CompleteStatusButton />
      </div>
    </nav>
  )
}

export default AdminNav
