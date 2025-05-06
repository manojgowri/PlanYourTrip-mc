"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAvailableCurrencies } from "@/lib/currency-utils"
import { Camera, Upload } from "lucide-react"

interface ActivityFormProps {
  onSubmit: (data: any) => void
  initialData?: any
  isLoading?: boolean
}

export function ActivityForm({ onSubmit, initialData, isLoading = false }: ActivityFormProps) {
  const [formData, setFormData] = useState({
    time: initialData?.time || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "activity",
    expense: {
      amount: initialData?.expense?.amount || 0,
      currency: initialData?.expense?.currency || "INR",
      category: initialData?.expense?.category || "general",
    },
    image: initialData?.image || "",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)
  const [isUploading, setIsUploading] = useState(false)

  const currencies = getAvailableCurrencies()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      expense: {
        ...prev.expense,
        [name]: name === "amount" ? Number.parseFloat(value) || 0 : value,
      },
    }))
  }

  const handleCurrencyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      expense: {
        ...prev.expense,
        currency: value,
      },
    }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload to a server or cloud storage
    // For now, we'll just create a data URL for preview
    setIsUploading(true)

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            name="time"
            placeholder="e.g. 09:00 AM"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Activity Type</Label>
          <Select value={formData.type} onValueChange={handleTypeChange}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="activity">Activity</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="accommodation">Accommodation</SelectItem>
              <SelectItem value="must-visit">Must Visit Place</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label>Expense</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-2">
            <Input
              type="number"
              name="amount"
              value={formData.expense.amount}
              onChange={handleExpenseChange}
              placeholder="Amount"
              min="0"
              step="0.01"
            />

            <Select value={formData.expense.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select
            value={formData.expense.category}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                expense: { ...prev.expense, category: value },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="accommodation">Accommodation</SelectItem>
              <SelectItem value="activities">Activities</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image (Optional)</Label>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
              disabled={isUploading}
              className="flex gap-2"
            >
              {isUploading ? "Uploading..." : "Upload Image"}
              {isUploading ? <Upload className="h-4 w-4 animate-pulse" /> : <Camera className="h-4 w-4" />}
            </Button>
            <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {imagePreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setImagePreview(null)
                  setFormData((prev) => ({ ...prev, image: "" }))
                }}
              >
                Remove Image
              </Button>
            )}
          </div>

          {imagePreview && (
            <div className="relative h-40 w-full overflow-hidden rounded-md border">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading || isUploading} className="w-full">
        {isLoading ? "Saving..." : "Save Activity"}
      </Button>
    </form>
  )
}
