import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function CompanionsPage() {
  const companions = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "/placeholder-user.jpg",
      role: "Travel Buddy",
      bio: "Loves exploring new cultures and trying local cuisines. Always up for an adventure!",
      contact: {
        phone: "+1234567890",
        email: "alice@example.com",
      },
    },
    {
      id: 2,
      name: "Bob Smith",
      avatar: "/placeholder-user.jpg",
      role: "Logistics Expert",
      bio: "Master of planning routes and finding the best deals. Prefers organized trips.",
      contact: {
        phone: "+1987654321",
        email: "bob@example.com",
      },
    },
    {
      id: 3,
      name: "Charlie Brown",
      avatar: "/placeholder-user.jpg",
      role: "Adventure Seeker",
      bio: "Always looking for the next thrill, from hiking mountains to diving deep seas.",
      contact: {
        phone: "+1122334455",
        email: "charlie@example.com",
      },
    },
    {
      id: 4,
      name: "Diana Prince",
      avatar: "/placeholder-user.jpg",
      role: "Cultural Enthusiast",
      bio: "Passionate about history, art, and local traditions. Enjoys slow travel.",
      contact: {
        phone: "+1556677889",
        email: "diana@example.com",
      },
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Your Travel Companions</h1>
      <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        Connect with your fellow travelers, share experiences, and plan your next adventure together.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {companions.map((companion) => (
          <Card key={companion.id} className="flex flex-col items-center text-center p-6 shadow-lg">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={companion.avatar || "/placeholder.svg"} alt={companion.name} />
              <AvatarFallback>{companion.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-2xl font-semibold">{companion.name}</CardTitle>
              <p className="text-sm text-primary-foreground">{companion.role}</p>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
              <p className="text-muted-foreground text-sm mb-4">{companion.bio}</p>
              <div className="flex justify-center gap-3 mt-auto">
                <Link href={`mailto:${companion.contact.email}`} passHref>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email {companion.name}</span>
                  </Button>
                </Link>
                <Link href={`tel:${companion.contact.phone}`} passHref>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <Phone className="h-5 w-5" />
                    <span className="sr-only">Call {companion.name}</span>
                  </Button>
                </Link>
                <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Message {companion.name}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
