"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onImageSelect: (base64Image: string) => void
  currentImage?: string
  className?: string
}

export function ImageUpload({ onImageSelect, currentImage, className = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    setError(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setPreview(base64String)
      onImageSelect(base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageSelect("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor="image-upload" className="text-sm font-medium">
          Image
        </label>
        {preview && (
          <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage} className="h-8 px-2 text-xs">
            <X className="mr-1 h-3 w-3" />
            Remove
          </Button>
        )}
      </div>

      {preview ? (
        <div className="relative overflow-hidden rounded-md border">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="h-48 w-full object-cover" />
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
        >
          <Upload className="mb-2 h-6 w-6 text-gray-400" />
          <p className="text-sm text-gray-500">Click to upload an image</p>
          <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
