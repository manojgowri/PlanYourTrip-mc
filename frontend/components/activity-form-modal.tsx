"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { Plus, Edit } from "lucide-react"
import type { Activity } from "@/lib/models"

interface ActivityFormModalProps {
  activity?: Activity
  onSave: (activity: Partial<Activity>) => void
  buttonVariant?: "default" | "outline" | "ghost" | "link"
  buttonText?: string
  isEdit?: boolean
}

export function ActivityFormModal({
  activity,
  onSave,
  buttonVariant = "default",
  buttonText,
  isEdit = false,
}: ActivityFormModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(activity?.title || "")
  const [description, setDescription] = useState(activity?.description || "")
  const [time, setTime] = useState(activity?.time || "")
  const [type, setType] = useState(activity?.type || "activity")
  const [image, setImage] = useState(activity?.image || "")
  const [amount, setAmount] = useState(activity?.expense?.amount?.toString() || "")
  const [currency, setCurrency] = useState(activity?.expense?.currency || "INR")
  const [category, setCategory] = useState(activity?.expense?.category || "general")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newActivity: Partial<Activity> = {
      title,
      description,
      time,
      type: type as Activity["type"],
      image,
      expense: amount
        ? {
            amount: Number.parseFloat(amount),
            currency,
            category,
          }
        : undefined,
    }

    onSave(newActivity)
    setOpen(false)
  }

  const resetForm = () => {
    if (!activity) {
      setTitle("")
      setDescription("")
      setTime("")
      setType("activity")
      setImage("")
      setAmount("")
      setCurrency("INR")
      setCategory("general")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          {isEdit ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {buttonText || (isEdit ? "Edit Activity" : "Add Activity")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Activity" : "Add New Activity"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 09:00 AM, Morning, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="must-visit">Must Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Expense Details</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="text-xs">
                  Amount (₹)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-xs">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="food">Food & Drinks</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="activities">Activities</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Image (Optional)</Label>
            <ImageUpload initialImage={image} onImageChange={setImage} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Update Activity" : "Add Activity"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
