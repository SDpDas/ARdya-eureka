"use client"

import type { Asset } from "@/components/ar-creator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PropertiesPanelProps {
  selectedAsset: Asset | null
  onUpdate: (updates: Partial<Asset>) => void
}

export function PropertiesPanel({ selectedAsset, onUpdate }: PropertiesPanelProps) {
  if (!selectedAsset) {
    return <div className="p-4 text-center text-gray-500 text-sm">Select an object to edit its properties</div>
  }

  const handlePositionChange = (axis: "x" | "y" | "z", value: string) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return

    const newPosition = [...selectedAsset.position] as [number, number, number]
    if (axis === "x") newPosition[0] = numValue
    if (axis === "y") newPosition[1] = numValue
    if (axis === "z") newPosition[2] = numValue

    onUpdate({ position: newPosition })
  }

  const handleRotationChange = (axis: "x" | "y" | "z", value: string) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return

    const newRotation = [...selectedAsset.rotation] as [number, number, number]
    if (axis === "x") newRotation[0] = numValue
    if (axis === "y") newRotation[1] = numValue
    if (axis === "z") newRotation[2] = numValue

    onUpdate({ rotation: newRotation })
  }

  const handleScaleChange = (axis: "x" | "y" | "z", value: string) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) return

    const newScale = [...selectedAsset.scale] as [number, number, number]
    if (axis === "x") newScale[0] = numValue
    if (axis === "y") newScale[1] = numValue
    if (axis === "z") newScale[2] = numValue

    onUpdate({ scale: newScale })
  }

  const handleUniformScaleChange = (value: number[]) => {
    const scaleValue = value[0]
    onUpdate({ scale: [scaleValue, scaleValue, scaleValue] })
  }

  const handleAutoplayChange = (checked: boolean) => {
    onUpdate({ autoplay: checked })
  }

  // Mobile-friendly tabs for properties
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-2 text-sm">Properties</h3>
        <p className="text-xs text-gray-500 mb-4 truncate">{selectedAsset.name}</p>
      </div>

      <Tabs defaultValue="position" className="md:hidden">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="position">Position</TabsTrigger>
          <TabsTrigger value="rotation">Rotation</TabsTrigger>
          <TabsTrigger value="scale">Scale</TabsTrigger>
        </TabsList>

        <TabsContent value="position" className="space-y-2 pt-2">
          <div className="grid grid-cols-3 gap-1">
            <div>
              <Label className="text-[10px] text-gray-500">X</Label>
              <Input
                type="number"
                value={selectedAsset.position[0]}
                onChange={(e) => handlePositionChange("x", e.target.value)}
                className="h-10 text-sm"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Y</Label>
              <Input
                type="number"
                value={selectedAsset.position[1]}
                onChange={(e) => handlePositionChange("y", e.target.value)}
                className="h-10 text-sm"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Z</Label>
              <Input
                type="number"
                value={selectedAsset.position[2]}
                onChange={(e) => handlePositionChange("z", e.target.value)}
                className="h-10 text-sm"
                step="0.1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rotation" className="space-y-2 pt-2">
          <div className="grid grid-cols-3 gap-1">
            <div>
              <Label className="text-[10px] text-gray-500">X</Label>
              <Input
                type="number"
                value={selectedAsset.rotation[0]}
                onChange={(e) => handleRotationChange("x", e.target.value)}
                className="h-10 text-sm"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Y</Label>
              <Input
                type="number"
                value={selectedAsset.rotation[1]}
                onChange={(e) => handleRotationChange("y", e.target.value)}
                className="h-10 text-sm"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Z</Label>
              <Input
                type="number"
                value={selectedAsset.rotation[2]}
                onChange={(e) => handleRotationChange("z", e.target.value)}
                className="h-10 text-sm"
                step="0.1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scale" className="space-y-2 pt-2">
          <div className="mb-4">
            <Label className="text-[10px] text-gray-500">Uniform</Label>
            <Slider
              defaultValue={[selectedAsset.scale[0]]}
              min={0.1}
              max={5}
              step={0.1}
              onValueChange={handleUniformScaleChange}
            />
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div>
              <Label className="text-[10px] text-gray-500">X</Label>
              <Input
                type="number"
                value={selectedAsset.scale[0]}
                onChange={(e) => handleScaleChange("x", e.target.value)}
                className="h-10 text-sm"
                step="0.1"
                min="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Y</Label>
              <Input
                type="number"
                value={selectedAsset.scale[1]}
                onChange={(e) => handleScaleChange("y", e.target.value)}
                className="h-10 text-sm"
                step="0.1"
                min="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Z</Label>
              <Input
                type="number"
                value={selectedAsset.scale[2]}
                onChange={(e) => handleScaleChange("z", e.target.value)}
                className="h-10 text-sm"
                step="0.1"
                min="0.1"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Desktop view */}
      <div className="hidden md:block space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Position</Label>
          <div className="grid grid-cols-3 gap-1">
            <div>
              <Label className="text-[10px] text-gray-500">X</Label>
              <Input
                type="number"
                value={selectedAsset.position[0]}
                onChange={(e) => handlePositionChange("x", e.target.value)}
                className="h-7 text-xs"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Y</Label>
              <Input
                type="number"
                value={selectedAsset.position[1]}
                onChange={(e) => handlePositionChange("y", e.target.value)}
                className="h-7 text-xs"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Z</Label>
              <Input
                type="number"
                value={selectedAsset.position[2]}
                onChange={(e) => handlePositionChange("z", e.target.value)}
                className="h-7 text-xs"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Rotation</Label>
          <div className="grid grid-cols-3 gap-1">
            <div>
              <Label className="text-[10px] text-gray-500">X</Label>
              <Input
                type="number"
                value={selectedAsset.rotation[0]}
                onChange={(e) => handleRotationChange("x", e.target.value)}
                className="h-7 text-xs"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Y</Label>
              <Input
                type="number"
                value={selectedAsset.rotation[1]}
                onChange={(e) => handleRotationChange("y", e.target.value)}
                className="h-7 text-xs"
                step="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Z</Label>
              <Input
                type="number"
                value={selectedAsset.rotation[2]}
                onChange={(e) => handleRotationChange("z", e.target.value)}
                className="h-7 text-xs"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Scale</Label>
          <div className="mb-2">
            <Label className="text-[10px] text-gray-500">Uniform</Label>
            <Slider
              defaultValue={[selectedAsset.scale[0]]}
              min={0.1}
              max={5}
              step={0.1}
              onValueChange={handleUniformScaleChange}
            />
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div>
              <Label className="text-[10px] text-gray-500">X</Label>
              <Input
                type="number"
                value={selectedAsset.scale[0]}
                onChange={(e) => handleScaleChange("x", e.target.value)}
                className="h-7 text-xs"
                step="0.1"
                min="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Y</Label>
              <Input
                type="number"
                value={selectedAsset.scale[1]}
                onChange={(e) => handleScaleChange("y", e.target.value)}
                className="h-7 text-xs"
                step="0.1"
                min="0.1"
              />
            </div>
            <div>
              <Label className="text-[10px] text-gray-500">Z</Label>
              <Input
                type="number"
                value={selectedAsset.scale[2]}
                onChange={(e) => handleScaleChange("z", e.target.value)}
                className="h-7 text-xs"
                step="0.1"
                min="0.1"
              />
            </div>
          </div>
        </div>
      </div>

      {(selectedAsset.type === "video" || selectedAsset.type === "audio") && (
        <>
          <Separator />
          <div className="flex items-center space-x-2">
            <Switch id="autoplay" checked={selectedAsset.autoplay} onCheckedChange={handleAutoplayChange} />
            <Label htmlFor="autoplay" className="text-xs">
              Autoplay in AR
            </Label>
          </div>
        </>
      )}
    </div>
  )
}
