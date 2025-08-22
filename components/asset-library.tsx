"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Asset } from "@/components/ar-creator"
import { MediaUpload } from "@/components/media-upload"

const sampleAssets: Asset[] = [
  // Add sample assets here
]

interface AssetLibraryProps {
  onAddAsset: (asset: Asset) => void
}

export function AssetLibrary({ onAddAsset }: AssetLibraryProps) {
  const [uploadedAssets, setUploadedAssets] = useState<Asset[]>([])

  const handleUpload = (file: File) => {
    // Process the uploaded file and create a new asset
    // Then add it to uploadedAssets
  }

  return (
    <Tabs defaultValue="samples">
      <TabsList>
        <TabsTrigger value="samples">Samples</TabsTrigger>
        <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
      </TabsList>
      <TabsContent value="samples">
        {sampleAssets.map((asset) => (
          <Button key={asset.id} onClick={() => onAddAsset(asset)}>
            {asset.name}
          </Button>
        ))}
      </TabsContent>
      <TabsContent value="uploaded">
        <MediaUpload onUpload={handleUpload} />
        {uploadedAssets.map((asset) => (
          <Button key={asset.id} onClick={() => onAddAsset(asset)}>
            {asset.name}
          </Button>
        ))}
      </TabsContent>
    </Tabs>
  )
}
