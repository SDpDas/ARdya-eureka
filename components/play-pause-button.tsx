"use client"

import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlayPauseButtonProps {
  isPlaying: boolean
  onToggle: () => void
}

export function PlayPauseButton({ isPlaying, onToggle }: PlayPauseButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggle}
      className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
  )
}
