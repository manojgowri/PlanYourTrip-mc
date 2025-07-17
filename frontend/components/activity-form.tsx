"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import type { Activity } from "@/lib/models"
import { Loader2 } from "lucide-react"

interface ActivityFormProps {
  initialData?: Activity
  onSubmit: (activity: Omit<Activity, "_id">) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function ActivityForm({ initialData, onSubmit, onCancel, isSubmitting }: ActivityFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [time, setTime] = useState(initialData?.time || "")
  const [location, setLocation] = useState(initialData?.location || "")
  const [type, setType] = useState(initialData?.type || "sightseeing")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)
      setTime(initialData.time)
      setLocation(initialData.location)
      setType(initialData.type)
      setImageUrl(initialData.imageUrl || "")
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newActivity: Omit<Activity, "_id"> = {
      title,
      description,
      time,
      location,
      type,
      imageUrl,
    }
    await onSubmit(newActivity)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Visit Eiffel Tower"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the activity"
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Paris, France"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={setType} disabled={isSubmitting}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select activity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sightseeing">Sightseeing</SelectItem>
            <SelectItem value="food">Food & Drink</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="relaxation">Relaxation</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Activity Image</Label>
        <ImageUpload onImageUpload={setImageUrl} initialImageUrl={imageUrl} disabled={isSubmitting} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Save Changes" : "Add Activity"}
        </Button>
      </div>
    </form>
  )
}
