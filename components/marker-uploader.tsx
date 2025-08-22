"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDT6Dd49VhGjMn6VuYEg8uv7SVJ5_HpveY",
  authDomain: "visiarisestudio-3813e.firebaseapp.com",
  projectId: "visiarisestudio-3813e",
  storageBucket: "visiarisestudio-3813e.firebasestorage.app",
  messagingSenderId: "808663717080",
  appId: "1:808663717080:web:c3264e47c1afde7ced73ad",
  measurementId: "G-49P84LJS0G",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

interface MarkerUploaderProps {
  onMarkerUploaded: (url: string) => void
  onLoading: (loading: boolean) => void
}

export function MarkerUploader({ onMarkerUploaded, onLoading }: MarkerUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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

  const handleFileUpload = async (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    setIsUploading(true)
    onLoading(true)
    setUploadProgress(0)

    try {
      // Upload to Firebase
      const fileId = uuidv4()
      const fileExtension = file.name.split(".").pop()
      const storageRef = ref(storage, `markers/${fileId}.${fileExtension}`)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      // Generate pattern file (in a real app, this would be done server-side)
      // For demo purposes, we'll just use the image URL directly
      // In a production app, you would convert the image to a .patt file

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Wait a bit to show 100% progress
      setTimeout(() => {
        setIsUploading(false)
        onLoading(false)
        onMarkerUploaded(downloadURL)
      }, 500)
    } catch (error) {
      console.error("Error uploading marker:", error)
      setIsUploading(false)
      onLoading(false)
      alert("Failed to upload marker. Please try again.")
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <Label htmlFor="marker-upload" className="block mb-2 text-sm font-medium">
        Upload Marker Image
      </Label>

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
          id="marker-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        <div className="flex flex-col items-center">
          {isUploading ? (
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ImageIcon className="h-10 w-10 text-gray-400" />
          )}

          <p className="mt-2 text-sm text-gray-500">
            {isUploading ? `Uploading... ${uploadProgress}%` : "Click or drag and drop to upload a marker image"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Use a high-contrast image with distinct features for best results
          </p>
        </div>
      </div>
    </div>
  )
}
