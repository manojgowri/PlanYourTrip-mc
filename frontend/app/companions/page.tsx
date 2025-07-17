import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, UserPlus } from "lucide-react"

export default function CompanionsPage() {
  const companions = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      destination: "Paris, France",
      interests: ["Culture", "Food", "History"],
      bio: "Looking for someone to explore Parisian museums and cafes with!",
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=100&width=100",
      destination: "Kyoto, Japan",
      interests: ["Nature", "Photography", "Temples"],
      bio: "Planning a trip to Kyoto in spring, seeking a photography buddy.",
    },
    {
      id: "3",
      name: "Charlie Brown",
      avatar: "/placeholder.svg?height=100&width=100",
      destination: "Machu Picchu, Peru",
      interests: ["Hiking", "Adventure", "Archaeology"],
      bio: "Adventurous soul looking for a hiking partner for the Inca Trail.",
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Find Travel Companions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Search for Companions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" placeholder="e.g., Rome, Italy" />
            </div>
            <div>
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <Input id="interests" placeholder="e.g., hiking, food, art" />
            </div>
            <Button className="w-full">Search</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Companion Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="profile-name">Your Name</Label>
              <Input id="profile-name" placeholder="John Doe" />
            </div>
            <div>
              <Label htmlFor="profile-destination">Desired Destination</Label>
              <Input id="profile-destination" placeholder="e.g., Bali, Indonesia" />
            </div>
            <div>
              <Label htmlFor="profile-interests">Your Interests (comma-separated)</Label>
              <Input id="profile-interests" placeholder="e.g., beaches, surfing, yoga" />
            </div>
            <div>
              <Label htmlFor="profile-bio">About You</Label>
              <Textarea
                id="profile-bio"
                placeholder="Tell us about your travel style and what you're looking for..."
                rows={3}
              />
            </div>
            <Button className="w-full">Save Profile</Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Available Companions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companions.map((companion) => (
          <Card key={companion.id}>
            <CardContent className="flex flex-col items-center p-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={companion.avatar || "/placeholder.svg"} alt={companion.name} />
                <AvatarFallback>
                  {companion.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2">{companion.name}</h3>
              <p className="text-muted-foreground text-center mb-2">{companion.destination}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {companion.interests.map((interest, idx) => (
                  <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
              <p className="text-center text-sm mb-4">{companion.bio}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" /> Message
                </Button>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" /> Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
