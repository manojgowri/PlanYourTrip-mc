"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare } from "lucide-react"

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
}

interface CommentSectionProps {
  itineraryId: string
}

export function CommentSection({ itineraryId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const { toast } = useToast()

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim() === "") {
      toast({
        title: "Error",
        description: "Comment cannot be empty.",
        variant: "destructive",
      })
      return
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Current User", // In a real app, this would come from auth
      avatar: "/placeholder-user.jpg", // Placeholder
      content: newComment.trim(),
      timestamp: new Date().toLocaleString(),
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")
    toast({
      title: "Comment Added",
      description: "Your comment has been posted.",
    })
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Comments</CardTitle>
        <MessageSquare className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                  <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{comment.author}</p>
                    <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button type="submit" className="w-full">
            Post Comment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
