"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "./image-upload"
import type { Activity } from "@/lib/models"

interface ActivityFormProps {
  activity?: Activity
  onSubmit: (activity: Partial<Activity>) => void
  onCancel: () => void
}

export function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const [title, setTitle] = useState(activity?.title || "")
  const [description, setDescription] = useState(activity?.description || "")
  const [location, setLocation] = useState(activity?.location || "")
  const [type, setType] = useState(activity?.type || "sightseeing")
  const [image, setImage] = useState(activity?.image || "")
  const [cost, setCost] = useState(activity?.cost?.toString() || "")
  const [currency, setCurrency] = useState(activity?.currency || "USD")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      location,
      type,
      image,
      cost: cost ? Number.parseFloat(cost) : undefined,
      currency,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sightseeing">Sightseeing</SelectItem>
            <SelectItem value="food">Food & Dining</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="relaxation">Relaxation</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="must-visit">Must Visit Place</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost">Cost</Label>
        <div className="flex gap-2">
          <Input
            id="cost"
            type="number"
            min="0"
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
          />
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="JPY">JPY</SelectItem>
              <SelectItem value="VND">VND</SelectItem>
              <SelectItem value="INR">INR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image</Label>
        <ImageUpload initialImage={image} onImageChange={setImage} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{activity ? "Update Activity" : "Add Activity"}</Button>
      </div>
    </form>
  )
}
