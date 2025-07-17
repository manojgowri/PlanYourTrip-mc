"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { uploadImage } from "@/lib/image-utils" // Assuming this utility exists

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  initialImageUrl?: string
}

export function ImageUpload({ onImageUpload, initialImageUrl }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Simulate image upload to a service like Vercel Blob, AWS S3, etc.
      // Replace this with your actual image upload logic
      const uploadedUrl = await uploadImage(file) // This function needs to be implemented in lib/image-utils.ts
      setImageUrl(uploadedUrl)
      onImageUpload(uploadedUrl)
      toast({
        title: "Upload Successful",
        description: "Image uploaded successfully!",
        variant: "default",
      })
    } catch (err) {
      console.error("Image upload failed:", err)
      setError("Failed to upload image. Please try again.")
      toast({
        title: "Upload Failed",
        description: "Could not upload image. " + (err as Error).message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setFile(null) // Clear the selected file after upload attempt
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload">Upload Image</Label>
        <div className="flex items-center gap-2">
          <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <XCircle className="h-4 w-4" /> {error}
          </p>
        )}
      </div>
      {imageUrl && (
        <div className="mt-4">
          <Label>Current Image Preview:</Label>
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Uploaded preview"
            className="mt-2 max-w-full h-auto rounded-md shadow-sm"
          />
        </div>
      )}
    </div>
  )
}
