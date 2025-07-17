"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadImage } from "@/lib/image-utils" // Assuming this utility exists

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  currentImageUrl?: string
  label?: string
}

export function ImageUpload({ onImageUpload, currentImageUrl, label = "Upload Image" }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    } else {
      setFile(null)
      setPreviewUrl(currentImageUrl || null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      // Replace with actual image upload logic (e.g., to Vercel Blob, S3, etc.)
      const imageUrl = await uploadImage(file) // This function needs to be implemented in lib/image-utils.ts
      onImageUpload(imageUrl)
      toast({
        title: "Upload Successful",
        description: "Image uploaded and URL updated.",
      })
    } catch (error) {
      console.error("Image upload failed:", error)
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setFile(null) // Clear file input after upload
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">{label}</Label>
      <div className="flex items-center gap-4">
        <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="flex-grow" />
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? "Uploading..." : <Upload className="h-4 w-4 mr-2" />}
          {isUploading ? "" : "Upload"}
        </Button>
      </div>
      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Image Preview"
            className="max-w-full h-auto rounded-md object-contain max-h-48"
          />
        </div>
      )}
    </div>
  )
}
