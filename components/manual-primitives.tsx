"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Box, Circle, Cylinder, Square } from "lucide-react"
import type { Asset } from "@/components/ar-creator"
import { v4 as uuidv4 } from "uuid"

interface ManualPrimitivesProps {
  onAddPrimitive: (asset: Asset) => void
}

export function ManualPrimitives({ onAddPrimitive }: ManualPrimitivesProps) {
  const primitives = [
    {
      name: "Cube",
      shape: "box" as const,
      icon: Box,
      color: "#ff6b6b",
      description: "Basic cube shape",
    },
    {
      name: "Sphere",
      shape: "sphere" as const,
      icon: Circle,
      color: "#4ecdc4",
      description: "Perfect sphere",
    },
    {
      name: "Cylinder",
      shape: "cylinder" as const,
      icon: Cylinder,
      color: "#45b7d1",
      description: "Cylindrical shape",
    },
    {
      name: "Plane",
      shape: "plane" as const,
      icon: Square,
      color: "#96ceb4",
      description: "Flat surface",
    },
  ]

  const handleAddPrimitive = (primitive: (typeof primitives)[0]) => {
    const newAsset: Asset = {
      id: uuidv4(),
      name: primitive.name,
      type: "primitive",
      url: "", // Not needed for primitives
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      primitiveData: {
        shape: primitive.shape,
        color: primitive.color,
        material: "standard",
      },
    }
    onAddPrimitive(newAsset)
  }

  return (
    <Card className="glass-effect silver-aura">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground glow-text">
          <Box className="h-5 w-5" />
          Manual Primitives
          <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
            Quick Add
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {primitives.map((primitive) => {
            const IconComponent = primitive.icon
            return (
              <Button
                key={primitive.shape}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-1 btn-outline-hover-fix"
                onClick={() => handleAddPrimitive(primitive)}
              >
                <IconComponent className="h-6 w-6" style={{ color: primitive.color }} />
                <span className="text-xs font-medium">{primitive.name}</span>
              </Button>
            )
          })}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Click any shape to add it to your scene instantly
        </div>
      </CardContent>
    </Card>
  )
}
