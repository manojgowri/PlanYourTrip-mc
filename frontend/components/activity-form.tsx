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

interface ActivityFormProps {
  initialData?: Activity | null
  onSubmit: (activity: Partial<Activity>) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ActivityForm({ initialData, onSubmit, onCancel, isSubmitting }: ActivityFormProps) {
  const [activity, setActivity] = useState<Partial<Activity>>(
    initialData || {
      name: "",
      time: "",
      location: "",
      description: "",
      image: "",
      cost: 0,
      type: "Other", // Default type
    },
  )

  useEffect(() => {
    setActivity(
      initialData || {
        name: "",
        time: "",
        location: "",
        description: "",
        image: "",
        cost: 0,
        type: "Other",
      },
    )
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setActivity((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setActivity((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleSelectChange = (value: string) => {
    setActivity((prev) => ({ ...prev, type: value as Activity["type"] }))
  }

  const handleImageUpload = (url: string) => {
    setActivity((prev) => ({ ...prev, image: url }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(activity)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          value={activity.name || ""}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="time" className="text-right">
          Time
        </Label>
        <Input
          id="time"
          name="time"
          value={activity.time || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="e.g., 9:00 AM"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location" className="text-right">
          Location
        </Label>
        <Input
          id="location"
          name="location"
          value={activity.location || ""}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={activity.description || ""}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cost" className="text-right">
          Cost (₹)
        </Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          step="0.01"
          value={activity.cost || 0}
          onChange={handleNumberChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          Type
        </Label>
        <Select value={activity.type || "Other"} onValueChange={handleSelectChange}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select activity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Must visit place">Must visit place</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="image-upload-component" className="text-right pt-2">
          Image
        </Label>
        <div className="col-span-3">
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImageUrl={activity.image}
            label="Upload Activity Image"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Activity"}
        </Button>
      </div>
    </form>
  )
}
