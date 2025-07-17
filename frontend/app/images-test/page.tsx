"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/image-upload"
import { SafeImage } from "@/components/safe-image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function ImagesTestPage() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(undefined)
  const [manualImageUrl, setManualImageUrl] = useState<string>("")
  const [displayImageUrl, setDisplayImageUrl] = useState<string | undefined>(undefined)
  const { toast } = useToast()

  const handleImageUpload = (url: string) => {
    setUploadedImageUrl(url)
    setDisplayImageUrl(url)
    toast({
      title: "Image Uploaded",
      description: "The image has been successfully uploaded and displayed.",
    })
  }

  const handleDisplayManualImage = () => {
    if (manualImageUrl.trim()) {
      setDisplayImageUrl(manualImageUrl)
      toast({
        title: "Image Displayed",
        description: "Manual image URL is now displayed.",
      })
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Image Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload onImageUpload={handleImageUpload} initialImageUrl={uploadedImageUrl} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Image from URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="manual-image-url">Enter Image URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="manual-image-url"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={manualImageUrl}
                  onChange={(e) => setManualImageUrl(e.target.value)}
                />
                <Button onClick={handleDisplayManualImage}>Display</Button>
              </div>
            </div>
            {displayImageUrl && (
              <div className="mt-4">
                <Label>Displayed Image:</Label>
                <div className="relative w-full h-64 mt-2 rounded-md overflow-hidden shadow-sm">
                  <SafeImage src={displayImageUrl} alt="Displayed Image" className="object-contain w-full h-full" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 break-all">URL: {displayImageUrl}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Placeholder Image Examples</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <SafeImage
              src="/placeholder.svg?height=100&width=100"
              alt="Placeholder 100x100"
              className="w-24 h-24 object-cover mx-auto rounded-md"
            />
            <p className="text-sm text-muted-foreground mt-1">100x100</p>
          </div>
          <div className="text-center">
            <SafeImage
              src="/placeholder.svg?height=200&width=300"
              alt="Placeholder 200x300"
              className="w-auto h-24 object-cover mx-auto rounded-md"
            />
            <p className="text-sm text-muted-foreground mt-1">200x300</p>
          </div>
          <div className="text-center">
            <SafeImage
              src="/placeholder.svg?height=300&width=200"
              alt="Placeholder 300x200"
              className="w-auto h-32 object-cover mx-auto rounded-md"
            />
            <p className="text-sm text-muted-foreground mt-1">300x200</p>
          </div>
          <div className="text-center">
            <SafeImage
              src="/placeholder.svg?height=150&width=400"
              alt="Placeholder 150x400"
              className="w-auto h-20 object-cover mx-auto rounded-md"
            />
            <p className="text-sm text-muted-foreground mt-1">150x400</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
