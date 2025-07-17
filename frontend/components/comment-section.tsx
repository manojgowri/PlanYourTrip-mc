"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { addComment, deleteComment } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import type { Comment } from "@/lib/models"
import { Send, Trash2 } from "lucide-react"

interface CommentSectionProps {
  itineraryId: string
  initialComments: Comment[]
  isAdmin: boolean
}

export function CommentSection({ itineraryId, initialComments, isAdmin }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newCommentText, setNewCommentText] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setComments(initialComments)
  }, [initialComments])

  const handleAddComment = async () => {
    if (isAdmin) {
      toast({
        title: "Admin Mode",
        description: "Comments can only be added by users in view mode.",
        variant: "default",
      })
      return
    }

    if (!newCommentText.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please write something before adding a comment.",
        variant: "destructive",
      })
      return
    }

    const newComment: Comment = {
      _id: `temp-${Date.now()}`, // Temporary ID for optimistic update
      author: "Current User", // Replace with actual user name/ID
      text: newCommentText.trim(),
      timestamp: new Date().toISOString(),
    }

    setComments((prev) => [...prev, newComment])
    setNewCommentText("")

    try {
      const updatedItinerary = await addComment(itineraryId, newComment.author, newComment.text)
      if (updatedItinerary) {
        // Replace temporary ID with actual ID from server
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === newComment._id
              ? updatedItinerary.comments.find((c) => c.text === newComment.text && c.author === newComment.author) ||
                comment
              : comment,
          ),
        )
        toast({
          title: "Comment Added",
          description: "Your comment has been added.",
        })
      } else {
        throw new Error("Failed to add comment on server.")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
      // Revert optimistic update on error
      setComments((prev) => prev.filter((comment) => comment._id !== newComment._id))
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (isAdmin) {
      toast({
        title: "Admin Mode",
        description: "Comments can only be deleted by users in view mode.",
        variant: "default",
      })
      return
    }

    const originalComments = comments
    setComments((prev) => prev.filter((comment) => comment._id !== commentId))

    try {
      const updatedItinerary = await deleteComment(itineraryId, commentId)
      if (!updatedItinerary) {
        throw new Error("Failed to delete comment on server.")
      }
      toast({
        title: "Comment Deleted",
        description: "Comment removed successfully.",
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      })
      // Revert optimistic update on error
      setComments(originalComments)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=100&width=100" alt={comment.author} />
                  <AvatarFallback>
                    {comment.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-sm">{comment.author}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                      {!isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteComment(comment._id)}
                          className="h-6 w-6"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete comment</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {!isAdmin && (
          <div className="flex gap-2 mt-4">
            <Textarea
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button onClick={handleAddComment} size="icon" className="self-end">
              <Send className="h-5 w-5" />
              <span className="sr-only">Send comment</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
