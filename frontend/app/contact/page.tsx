import Link from "next/link"
import { ArrowLeft, Mail, Instagram, Youtube, Compass, Code, Video, Edit } from "lucide-react"
import { SafeImage } from "@/components/safe-image"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="mb-6 flex items-center gap-2 text-emerald-600 hover:underline dark:text-emerald-400">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Contact Me</h1>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-100 dark:border-emerald-900">
              <SafeImage src="/images/developer-photo.jpg" alt="Manoj V" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manoj V</h2>
              <p className="text-muted-foreground">Travel Enthusiast & Creator</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                  <Compass className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Passionate about exploring the world and sharing budget-friendly travel experiences.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                <a href="mailto:mvvibez@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">
                  mvvibez@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <Instagram className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Instagram</h3>
                <div className="space-y-1">
                  <a
                    href="https://www.instagram.com/_iam_mv/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Personal: @_iam_mv
                  </a>
                  <a
                    href="https://www.instagram.com/shotsbymanojv/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Photography: @shotsbymanojv
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-red-100 p-2 dark:bg-red-900">
                <Youtube className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">YouTube</h3>
                <a
                  href="https://www.youtube.com/@MVVibez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline dark:text-red-400"
                >
                  @MVVibez
                </a>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Subscribe to my channel for travel vlogs and adventures around the world!
                </p>
                <a
                  href="https://www.youtube.com/@MVVibez?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  <Youtube className="h-4 w-4" />
                  Subscribe Now
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Skills</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-md border p-3 dark:border-gray-700">
                <Code className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-900 dark:text-white">Software Developer</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-3 dark:border-gray-700">
                <Compass className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-900 dark:text-white">Site Developer</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-3 dark:border-gray-700">
                <Video className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-900 dark:text-white">Videographer</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-3 dark:border-gray-700">
                <Edit className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-900 dark:text-white">Video Editor</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-50 p-6 dark:bg-emerald-900/20">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">About My Travel Channel</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            I'm passionate about exploring the world and sharing budget-friendly travel experiences. Through my YouTube
            channel, I document my adventures and provide tips for fellow travelers.
          </p>
          <div className="aspect-video overflow-hidden rounded-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/videoseries?list=UU-_your_channel_id"
              title="MV Vibez YouTube Channel"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
