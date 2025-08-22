"use client"

import { Button } from "@/components/ui/button"
import { CuboidIcon, ScanLine } from "lucide-react"

interface ARTypeSelectorProps {
  value: "markerless" | "marker-based"
  onValueChange: (value: "markerless" | "marker-based") => void
}

export function ARTypeSelector({ value, onValueChange }: ARTypeSelectorProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant={value === "markerless" ? "default" : "outline"}
        onClick={() => onValueChange("markerless")}
        className="flex items-center"
      >
        <CuboidIcon className="mr-2 h-4 w-4" />
        Markerless
      </Button>
      <Button
        variant={value === "marker-based" ? "default" : "outline"}
        onClick={() => onValueChange("marker-based")}
        className="flex items-center"
      >
        <ScanLine className="mr-2 h-4 w-4" />
        Marker-based
      </Button>
    </div>
  )
}
