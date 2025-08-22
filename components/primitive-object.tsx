"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

interface PrimitiveObjectProps {
  asset: any
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updatedAsset: any) => void
  isPlaying: boolean
}

export function PrimitiveObject({ asset, isSelected, onSelect, onUpdate, isPlaying }: PrimitiveObjectProps) {
  const mesh = useRef<Mesh>(null!)
  const { primitiveData } = asset

  useFrame(() => {
    if (mesh.current && isSelected) {
      mesh.current.rotation.y += 0.01
    }
    if (mesh.current && isPlaying) {
      mesh.current.rotation.y += 0.005
    }
  })

  const getMaterial = () => {
    const color = primitiveData?.color || "#ffffff"

    switch (primitiveData?.material) {
      case "standard":
        return <meshStandardMaterial color={color} />
      case "basic":
        return <meshBasicMaterial color={color} />
      case "phong":
        return <meshPhongMaterial color={color} shininess={100} />
      case "physical":
        return <meshPhysicalMaterial color={color} metalness={0.5} roughness={0.5} />
      case "toon":
        return <meshToonMaterial color={color} />
      default:
        return <meshStandardMaterial color={color} />
    }
  }

  const getGeometry = () => {
    switch (primitiveData?.shape) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />
      case "sphere":
        return <sphereGeometry args={[0.5, 32, 32]} />
      case "cylinder":
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      case "plane":
        return <planeGeometry args={[1, 1]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <mesh
      ref={mesh}
      position={asset.position}
      rotation={asset.rotation}
      scale={asset.scale}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      {getMaterial()}
    </mesh>
  )
}
