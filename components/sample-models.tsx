"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Lock } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { Asset } from "@/components/ar-creator"

interface SampleModelsProps {
  onSelectModel: (asset: Asset) => void
  isPremium: boolean
}

export function SampleModels({ onSelectModel, isPremium }: SampleModelsProps) {
  const [showPremiumWarning, setShowPremiumWarning] = useState(false)

  const freeModels = [
    {
      name: "Astronaut",
      url: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    },
    {
      name: "Cube",
      url: "https://storage.googleapis.com/visiarise-models/cube.glb",
    },
    {
      name: "Sphere",
      url: "https://storage.googleapis.com/visiarise-models/sphere.glb",
    },
  ]

  const premiumModels = [
    {
      name: "Vintage Chair",
      url: "https://storage.googleapis.com/visiarise-models/vintage_chair.glb",
    },
    {
      name: "Modern Lamp",
      url: "https://storage.googleapis.com/visiarise-models/modern_lamp.glb",
    },
    {
      name: "Office Desk",
      url: "https://storage.googleapis.com/visiarise-models/office_desk.glb",
    },
    {
      name: "Potted Plant",
      url: "https://storage.googleapis.com/visiarise-models/potted_plant.glb",
    },
    {
      name: "Bookshelf",
      url: "https://storage.googleapis.com/visiarise-models/bookshelf.glb",
    },
    {
      name: "Coffee Table",
      url: "https://storage.googleapis.com/visiarise-models/coffee_table.glb",
    },
  ]

  const handleSelectModel = (name: string, url: string, isPremiumModel: boolean) => {
    if (isPremiumModel && !isPremium) {
      setShowPremiumWarning(true)
      return
    }

    const newAsset: Asset = {
      id: uuidv4(),
      name,
      type: "model",
      url,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    }

    onSelectModel(newAsset)
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full flex justify-between items-center">
            <span>Sample Models</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Free Models</DropdownMenuLabel>
          {freeModels.map((model) => (
            <DropdownMenuItem key={model.name} onClick={() => handleSelectModel(model.name, model.url, false)}>
              {model.name}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="flex items-center">
            Premium Models
            {!isPremium && <Lock className="h-3 w-3 ml-2" />}
          </DropdownMenuLabel>
          {premiumModels.map((model) => (
            <DropdownMenuItem
              key={model.name}
              onClick={() => handleSelectModel(model.name, model.url, true)}
              className={!isPremium ? "text-gray-400" : ""}
            >
              {model.name} {!isPremium && <Lock className="h-3 w-3 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {showPremiumWarning && (
        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-md">
          Premium models are only available with a Premium subscription. Upgrade to access these models.
          <Button
            variant="link"
            className="text-xs p-0 h-auto text-blue-600 dark:text-blue-400"
            onClick={() => setShowPremiumWarning(false)}
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  )
}
