"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import type { AssetType } from "@/components/ar-creator"

interface MediaUploadProps {
  onUpload: (file: File, type: AssetType) => void
}

export function MediaUpload({ onUpload }: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    setIsUploading(true)
    try {
      // Determine asset type based on file extension
      const extension = file.name.split(".").pop()?.toLowerCase()
      let type: AssetType = "model"
      if (["png", "jpg", "jpeg"].includes(extension || "")) {
        type = "image"
      } else if (["mp4", "webm"].includes(extension || "")) {
        type = "video"
      } else if (["mp3", "wav"].includes(extension || "")) {
        type = "audio"
      }
      onUpload(file, type)
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".glb,.obj,.fbx,.png,.jpg,.jpeg,.mp4,.webm,.mp3,.wav"
        />

        {isUploading ? (
          <div className="text-blue-500">Uploading...</div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Click or drag file to upload</p>
          </>
        )}
      </div>
    </div>
  )
}