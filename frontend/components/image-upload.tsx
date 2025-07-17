"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadImage } from "@/lib/image-utils"
import Image from "next/image"

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  initialImageUrl?: string
  disabled?: boolean
}

export function ImageUpload({ onImageUpload, initialImageUrl, disabled }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (e.g., JPG, PNG, GIF).",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      // Simulate image upload to a storage service
      const uploadedUrl = await uploadImage(file)
      setImageUrl(uploadedUrl)
      onImageUpload(uploadedUrl)
      toast({
        title: "Image Uploaded",
        description: "Your image has been successfully uploaded.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      })
      setImageUrl(null)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = "" // Clear the input
      }
    }
  }

  const handleRemoveImage = () => {
    setImageUrl(null)
    onImageUpload("") // Notify parent that image is removed
    toast({
      title: "Image Removed",
      description: "The image has been cleared.",
    })
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col items-center gap-4">
        {imageUrl ? (
          <div className="relative w-full h-48 rounded-md overflow-hidden group">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Uploaded preview"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
            {!disabled && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            )}
          </div>
        ) : (
          <div className="w-full h-48 border-2 border-dashed border-muted-foreground rounded-md flex items-center justify-center text-muted-foreground">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 mb-2" />
                <p>No image selected</p>
              </div>
            )}
          </div>
        )}

        <div className="w-full flex items-center gap-2">
          <Label htmlFor="image-upload" className="sr-only">
            Upload Image
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={disabled || isUploading}
            className="flex-1"
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={disabled || isUploading} className="shrink-0">
            <Upload className="h-4 w-4 mr-2" />
            {imageUrl ? "Change Image" : "Upload Image"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
