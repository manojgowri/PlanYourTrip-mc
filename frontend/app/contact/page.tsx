import Link from "next/link"
import { ArrowLeft, Mail, Instagram, Youtube, Compass, Code, Video, Edit } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="mb-6 flex items-center gap-2 text-emerald-600 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Contact Me</h1>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-3">
              <Compass className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Manoj V</h2>
              <p className="text-muted-foreground">Travel Enthusiast & Creator</p>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-100 p-2">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <a href="mailto:mvvibez@gmail.com" className="text-blue-600 hover:underline">
                  mvvibez@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-purple-100 p-2">
                <Instagram className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Instagram</h3>
                <div className="space-y-1">
                  <a
                    href="https://www.instagram.com/_iam_mv/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-purple-600 hover:underline"
                  >
                    Personal: @_iam_mv
                  </a>
                  <a
                    href="https://www.instagram.com/shotsbymanojv/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-purple-600 hover:underline"
                  >
                    Photography: @shotsbymanojv
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-red-100 p-2">
                <Youtube className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium">YouTube</h3>
                <a
                  href="https://www.youtube.com/@MVVibez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  @MVVibez
                </a>
                <p className="mt-1 text-sm text-muted-foreground">
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
            <h3 className="text-lg font-semibold">Professional Skills</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-md border p-3">
                <Code className="h-5 w-5 text-emerald-600" />
                <span>Software Developer</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-3">
                <Compass className="h-5 w-5 text-emerald-600" />
                <span>Site Developer</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-3">
                <Video className="h-5 w-5 text-emerald-600" />
                <span>Videographer</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-3">
                <Edit className="h-5 w-5 text-emerald-600" />
                <span>Video Editor</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-50 p-6">
          <h2 className="mb-4 text-xl font-bold">About My Travel Channel</h2>
          <p className="mb-4">
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
