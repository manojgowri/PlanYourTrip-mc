"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Comment } from "@/lib/models"

interface CommentSectionProps {
  itineraryId: string
}

export function CommentSection({ itineraryId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newCommentText, setNewCommentText] = useState("")
  const [newCommentAuthor, setNewCommentAuthor] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchComments()
  }, [itineraryId])

  const fetchComments = async () => {
    try {
      // In a real app, this would fetch comments from your backend
      // For now, simulate fetching
      const dummyComments: Comment[] = [
        { _id: "1", author: "Alice", text: "Great itinerary!", createdAt: "2023-01-15T10:00:00Z" },
        { _id: "2", author: "Bob", text: "Looks amazing, can't wait to try it.", createdAt: "2023-01-16T14:30:00Z" },
      ]
      setComments(dummyComments)
    } catch (error) {
      console.error("Failed to fetch comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments.",
        variant: "destructive",
      })
    }
  }

  const handleAddComment = async () => {
    if (!newCommentText.trim() || !newCommentAuthor.trim()) {
      toast({
        title: "Error",
        description: "Author and comment cannot be empty.",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, this would send the new comment to your backend
      // For now, simulate adding
      const newComment: Comment = {
        _id: String(comments.length + 1),
        author: newCommentAuthor,
        text: newCommentText,
        createdAt: new Date().toISOString(),
      }
      setComments([...comments, newComment])
      setNewCommentText("")
      setNewCommentAuthor("")
      toast({
        title: "Success",
        description: "Comment added!",
      })
    } catch (error) {
      console.error("Failed to add comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="border-b pb-3 last:border-b-0">
                <p className="font-semibold text-sm">{comment.author}</p>
                <p className="text-muted-foreground text-xs">{new Date(comment.createdAt).toLocaleString()}</p>
                <p className="mt-1 text-sm">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add a Comment</h3>
          <div>
            <Label htmlFor="comment-author" className="sr-only">
              Your Name
            </Label>
            <Input
              id="comment-author"
              placeholder="Your Name"
              value={newCommentAuthor}
              onChange={(e) => setNewCommentAuthor(e.target.value)}
              className="mb-2"
            />
          </div>
          <div>
            <Label htmlFor="new-comment" className="sr-only">
              Your Comment
            </Label>
            <Textarea
              id="new-comment"
              placeholder="Write your comment here..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              rows={4}
            />
          </div>
          <Button onClick={handleAddComment}>Submit Comment</Button>
        </div>
      </CardContent>
    </Card>
  )
}
