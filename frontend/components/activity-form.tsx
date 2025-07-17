"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Activity } from "@/lib/models"

interface ActivityFormProps {
  initialData?: Activity | null
  onSubmit: (activity: Activity) => void
  onCancel: () => void
}

export function ActivityForm({ initialData, onSubmit, onCancel }: ActivityFormProps) {
  const [activity, setActivity] = useState<Activity>(
    initialData || {
      _id: "", // Will be generated on save if new
      name: "",
      time: "",
      location: "",
      description: "",
      cost: 0,
      category: "Sightseeing",
      status: "planned",
    },
  )

  useEffect(() => {
    if (initialData) {
      setActivity(initialData)
    } else {
      setActivity({
        _id: "",
        name: "",
        time: "",
        location: "",
        description: "",
        cost: 0,
        category: "Sightseeing",
        status: "planned",
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setActivity((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setActivity((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setActivity((prev) => ({ ...prev, [name]: value }))
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
        <Input id="name" name="name" value={activity.name} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="time" className="text-right">
          Time
        </Label>
        <Input
          id="time"
          name="time"
          type="time"
          value={activity.time}
          onChange={handleChange}
          className="col-span-3"
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
          value={activity.location}
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
          value={activity.cost || 0}
          onChange={handleNumberChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Select value={activity.category} onValueChange={(value) => handleSelectChange("category", value)}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sightseeing">Sightseeing</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Shopping">Shopping</SelectItem>
            <SelectItem value="Adventure">Adventure</SelectItem>
            <SelectItem value="Relaxation">Relaxation</SelectItem>
            <SelectItem value="Transportation">Transportation</SelectItem>
            <SelectItem value="Accommodation">Accommodation</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Select value={activity.status} onValueChange={(value) => handleSelectChange("status", value)}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Save Changes" : "Add Activity"}</Button>
      </div>
    </form>
  )
}
