"use client"

import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScreenshotButtonProps {
  onScreenshot: () => void
}

export function ScreenshotButton({ onScreenshot }: ScreenshotButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onScreenshot}
      className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <Camera className="h-4 w-4" />
    </Button>
  )
}
