"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: number
  name: string
  date: string
  content: string
  rating: number
}

// Sample comments
const initialComments: Comment[] = [
  {
    id: 1,
    name: "Alex Thompson",
    date: "June 12, 2023",
    content:
      "This itinerary was incredibly helpful for planning my own Vietnam trip! The restaurant recommendations were spot on.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jamie Lee",
    date: "May 30, 2023",
    content: "I followed this exact itinerary and had an amazing time. The accommodations were perfect for my budget.",
    rating: 5,
  },
  {
    id: 3,
    name: "Chris Morgan",
    date: "May 25, 2023",
    content: "Great itinerary overall, but I would suggest spending more time in Hoi An and less in Hanoi.",
    rating: 4,
  },
  {
    id: 4,
    name: "Taylor Wilson",
    date: "May 20, 2023",
    content: "The budget tips were so helpful! I managed to do this trip for much less than I expected.",
    rating: 5,
  },
  {
    id: 5,
    name: "Jordan Smith",
    date: "May 15, 2023",
    content: "This was my first time traveling to Southeast Asia and this itinerary made it so much easier to plan.",
    rating: 5,
  },
]

export function CommentSection() {
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [showAllComments, setShowAllComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState("")

  const handleSubmitComment = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to submit a comment.",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Comment required",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      })
      return
    }

    const comment: Comment = {
      id: comments.length + 1,
      name: name,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      content: newComment,
      rating: newRating,
    }

    setComments([comment, ...comments])
    setNewComment("")
    setName("")

    toast({
      title: "Comment submitted",
      description: "Thank you for your feedback!",
    })
  }

  const displayedComments = showAllComments ? comments : comments.slice(0, 3)

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-semibold">Reviews & Comments</h2>

      <Card className="mb-8">
        <CardHeader>
          <h3 className="text-lg font-medium">Leave a Comment</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Your Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setNewRating(rating)}
                  onMouseEnter={() => setHoverRating(rating)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      (hoverRating || newRating) >= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="mb-2 block text-sm font-medium">
              Your Comment
            </label>
            <Textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this itinerary..."
              rows={4}
            />
          </div>

          <Button onClick={handleSubmitComment}>Submit Comment</Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {displayedComments.map((comment) => (
          <div key={comment.id} className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-medium">{comment.name}</div>
              <div className="text-sm text-muted-foreground">{comment.date}</div>
            </div>
            <div className="mb-3 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    comment.rating >= star ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        ))}

        {comments.length > 3 && (
          <Button variant="outline" onClick={() => setShowAllComments(!showAllComments)} className="w-full">
            {showAllComments ? "Show Less" : `Show All Comments (${comments.length})`}
          </Button>
        )}
      </div>
    </section>
  )
}
