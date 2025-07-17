"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/image-upload"
import { SafeImage } from "@/components/safe-image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ImagesTestPage() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("")
  const [customImageUrl, setCustomImageUrl] = useState<string>("")
  const [displayImageUrl, setDisplayImageUrl] = useState<string>("")

  const handleImageUpload = (url: string) => {
    setUploadedImageUrl(url)
    setDisplayImageUrl(url)
  }

  const handleDisplayCustomImage = () => {
    setDisplayImageUrl(customImageUrl)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-center">Image Handling Test Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>Image Upload Component Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload onImageUpload={handleImageUpload} initialImageUrl={uploadedImageUrl} />
          {uploadedImageUrl && (
            <p className="text-sm text-muted-foreground">
              Uploaded URL: <span className="font-mono break-all">{uploadedImageUrl}</span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SafeImage Component Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="custom-image-url">Enter Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="custom-image-url"
                placeholder="e.g., https://example.com/image.jpg or /placeholder.svg"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
              />
              <Button onClick={handleDisplayCustomImage}>Display</Button>
            </div>
          </div>

          {displayImageUrl ? (
            <div className="w-full h-64 relative border rounded-md overflow-hidden">
              <SafeImage
                src={displayImageUrl}
                alt="Displayed Image"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          ) : (
            <div className="w-full h-64 flex items-center justify-center border rounded-md text-muted-foreground">
              No image to display. Enter a URL or upload one.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Placeholder Image Examples</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="w-full h-40 relative border rounded-md overflow-hidden">
            <SafeImage
              src="/placeholder.svg?height=160&width=240"
              alt="Placeholder 1"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="w-full h-40 relative border rounded-md overflow-hidden">
            <SafeImage
              src="/placeholder.svg?text=Custom+Text&height=160&width=240"
              alt="Placeholder 2"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="w-full h-40 relative border rounded-md overflow-hidden">
            <SafeImage
              src="/placeholder.svg?height=160&width=240&color=red"
              alt="Placeholder 3"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
