"use client"

import type React from "react"

import { useRef } from "react"
import { useSnapshot } from "valtio"
import { state } from "@/lib/store"
import type { Object3D } from "three"

// Remove the problematic XR imports and create a simplified version
const ARCanvas = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full h-full bg-black">{children}</div>
}

// Simplified placeholder components
const DefaultXRControllers = () => null
const Hands = () => null
const useAR = () => ({ isPresenting: false, hitTest: null })

interface ARSceneProps {
  assets?: any[]
  isDarkMode?: boolean
  isPlaying?: boolean
}

export const ARScene = ({ assets, isDarkMode, isPlaying = false }: ARSceneProps) => {
  // Use either passed assets or from the store
  const snap = useSnapshot(state)
  const sceneAssets = assets || snap.assets

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="p-6 bg-background/80 backdrop-blur-md rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4">AR Preview</h2>
          <p className="mb-4">AR mode is currently in preview.</p>
          <p className="text-sm text-muted-foreground">{sceneAssets.length} asset(s) ready for AR viewing</p>
        </div>
      </div>
    </div>
  )
}

function Placement({ shadowIntensity }: { shadowIntensity: number }) {
  return null
}

interface AssetProps {
  asset: any
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updatedAsset: any) => void
  isPlaying: boolean
}

function Asset({ asset, isSelected, onSelect, onUpdate, isPlaying }: AssetProps) {
  const model = useRef<Object3D>(null!)

  // Simplified asset rendering
  if (asset.type === "primitive") {
    return (
      <PrimitiveObject
        asset={asset}
        isSelected={isSelected}
        onSelect={onSelect}
        onUpdate={onUpdate}
        isPlaying={isPlaying}
      />
    )
  }

  return (
    <group position={asset.position} rotation={asset.rotation} scale={asset.scale}>
      <mesh onClick={onSelect}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isSelected ? "hotpink" : "orange"} />
      </mesh>
    </group>
  )
}

// Simplified primitive object component
function PrimitiveObject({ asset, isSelected, onSelect, isPlaying }: AssetProps) {
  return (
    <group position={asset.position} rotation={asset.rotation} scale={asset.scale}>
      <mesh onClick={onSelect}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={asset.primitiveData?.color || (isSelected ? "hotpink" : "blue")} />
      </mesh>
    </group>
  )
}

// Add Asset component to ARScene for external use
ARScene.Asset = Asset
