import { proxy } from "valtio"

export interface Asset {
  id: string
  name: string
  type: "model" | "image" | "video" | "audio" | "primitive"
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  autoplay?: boolean
  primitiveData?: {
    shape: "box" | "sphere" | "cylinder" | "plane"
    color: string
    material: string
  }
}

export interface AppState {
  assets: Asset[]
  selectedAssetId: string | null
  isDarkMode: boolean
}

// Create the store with initial state
export const state = proxy<AppState>({
  assets: [],
  selectedAssetId: null,
  isDarkMode: true,
})
