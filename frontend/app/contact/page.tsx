import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Mail, Instagram, Youtube, Code } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Information</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manoj V</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Code className="h-5 w-5 mt-0.5 text-gray-600" />
            <div>
              <h3 className="font-medium">Profession</h3>
              <p className="text-gray-600">Software Developer, Site Developer, Videographer, Video Editor</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 mt-0.5 text-gray-600" />
            <div>
              <h3 className="font-medium">Email</h3>
              <Link href="mailto:mvvibez@gmail.com" className="text-blue-600 hover:underline">
                mvvibez@gmail.com
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Instagram className="h-5 w-5 mt-0.5 text-gray-600" />
            <div>
              <h3 className="font-medium">Personal Page</h3>
              <Link
                href="https://www.instagram.com/_iam_mv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                instagram.com/_iam_mv
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Instagram className="h-5 w-5 mt-0.5 text-gray-600" />
            <div>
              <h3 className="font-medium">Edit Page</h3>
              <Link
                href="https://www.instagram.com/shotsbymanojv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                instagram.com/shotsbymanojv
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Youtube className="h-5 w-5 mt-0.5 text-gray-600" />
            <div>
              <h3 className="font-medium">YouTube Channel</h3>
              <Link
                href="https://www.youtube.com/@MVVibez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                youtube.com/@MVVibez
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-12 text-gray-600">
        <p>Feel free to reach out for collaborations, questions, or just to say hello!</p>
      </div>
    </div>
  )
}
