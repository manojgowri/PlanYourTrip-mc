"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageUploadProps {
  initialImage?: string
  onImageChange: (imageData: string) => void
  className?: string
}

export function ImageUpload({ initialImage, onImageChange, className = "" }: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [imageUrl, setImageUrl] = useState<string>(initialImage || "")
  const [previewUrl, setPreviewUrl] = useState<string>(initialImage || "")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)

    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      onImageChange(result)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }

  const handleUrlSubmit = () => {
    setError(null)
    if (!imageUrl) {
      setError("Please enter an image URL")
      return
    }

    // Basic URL validation
    try {
      new URL(imageUrl)
      setPreviewUrl(imageUrl)
      onImageChange(imageUrl)
    } catch (e) {
      setError("Please enter a valid URL")
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="flex flex-col items-center">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button type="button" onClick={triggerFileInput} className="w-full">
              Choose Image
            </Button>
            <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, GIF, WebP</p>
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={handleUrlChange}
              />
              <Button type="button" onClick={handleUrlSubmit}>
                Set URL
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="object-contain w-full h-full"
              onError={() => {
                setError("Failed to load image. Please try a different one.")
                setPreviewUrl("")
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
