"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Grid, PerspectiveCamera, useGLTF } from "@react-three/drei"
import type * as THREE from "three"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { AssetHierarchy } from "@/components/asset-hierarchy"
import { MediaUpload } from "@/components/media-upload"
import { Toolbar } from "@/components/toolbar"
import { PropertiesPanel } from "@/components/properties-panel"
import { AISceneGenerator } from "@/components/ai-scene-generator"
import { Button } from "@/components/ui/button"
import { ARTypeSelector } from "@/components/ar-type-selector"
import { PhonePreview } from "@/components/phone-preview"
import { Notification } from "@/components/notification"
import { ScreenshotButton } from "@/components/screenshot-button"
import { PlayPauseButton } from "@/components/play-pause-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Bot, ArrowLeft, ArrowRight, Share2, Edit, ChevronDown, ChevronUp, Upload } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Asset types
export type AssetType = "model" | "image" | "video" | "audio" | "primitive"

// Asset interface
export interface Asset {
  id: string
  name: string
  type: AssetType
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

// Tool types
export type ToolType = "select" | "position" | "rotate" | "scale" | "delete"

// Mobile navigation steps
type MobileStep = "welcome" | "assets" | "canvas" | "properties" | "ai" | "preview" | "publish"

// 3D Model Component
function Model({ url, position, rotation, scale, isSelected, onClick }: any) {
  const [sceneObject, setSceneObject] = useState<THREE.Object3D | null>(null)
  const [errorLoading, setErrorLoading] = useState(false)
  const gltf = useGLTF(url)

  useEffect(() => {
    let mounted = true

    try {
      if (mounted) {
        setSceneObject(gltf.scene.clone())
        setErrorLoading(false)
      }
    } catch (error) {
      console.error("Error loading model:", error)
      if (mounted) {
        setErrorLoading(true)
      }
    }

    return () => {
      mounted = false
    }
  }, [url, gltf])

  if (errorLoading) {
    return (
      <mesh position={position} rotation={rotation} scale={scale} onClick={onClick}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isSelected ? "hotpink" : "red"} />
      </mesh>
    )
  }

  if (!sceneObject) {
    return null
  }

  return <primitive object={sceneObject} position={position} rotation={rotation} scale={scale} onClick={onClick} />
}

// Primitive Component
function PrimitiveObject({ asset, isSelected, onClick }: any) {
  const { primitiveData } = asset

  const getGeometry = () => {
    switch (primitiveData?.shape) {
      case "sphere":
        return <sphereGeometry args={[0.5, 32, 32]} />
      case "cylinder":
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      case "plane":
        return <planeGeometry args={[1, 1]} />
      case "box":
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <mesh position={asset.position} rotation={asset.rotation} scale={asset.scale} onClick={onClick}>
      {getGeometry()}
      <meshStandardMaterial
        color={isSelected ? "hotpink" : primitiveData?.color || "#ff6b6b"}
        transparent={primitiveData?.shape === "plane"}
        opacity={primitiveData?.shape === "plane" ? 0.8 : 1}
      />
    </mesh>
  )
}

function ARCreator() {
  const router = useRouter()

  // State for assets
  const [assets, setAssets] = useState<Asset[]>([])

  // State for selected asset
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  // State for active tool
  const [activeTool, setActiveTool] = useState<ToolType>("select")

  // State for AR mode
  const [arMode, setArMode] = useState(false)

  // State for mobile tab view
  const [activeTab, setActiveTab] = useState<"assets" | "canvas" | "properties" | "ai">("canvas")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // State for mobile navigation
  const [currentStep, setCurrentStep] = useState<MobileStep>("welcome")
  const [isMobile, setIsMobile] = useState(false)

  // State for save/publish
  const [isSaved, setIsSaved] = useState(false)
  const [projectId, setProjectId] = useState<string>("")

  const [showPhonePreview, setShowPhonePreview] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)

  const sceneRef = useRef<THREE.Scene>(null)
  const modelCache = useRef<Map<string, THREE.Object3D>>(new Map())

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)

  const [arType, setARType] = useState<"markerless" | "marker-based">("markerless")
  const [isLoading, setIsLoading] = useState(false)

  const [history, setHistory] = useState<Asset[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // AI Chat state
  const [aiMessages, setAiMessages] = useState<Array<{ id: string; text: string; isUser: boolean }>>([])
  const [showAIPanel, setShowAIPanel] = useState(false)

  // Marker state
  const [markerUrl, setMarkerUrl] = useState<string>("")
  const [showMarkerUploader, setShowMarkerUploader] = useState(false)

  // Collapsible panels state
  const [panelsCollapsed, setPanelsCollapsed] = useState({
    assets: false,
    properties: false,
    ai: false,
  })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const updateAssetsWithHistory = useCallback(
    (newAssets: Asset[]) => {
      setAssets(newAssets)
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newAssets])
      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setAssets(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setAssets(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool)
  }

  const handleSceneGenerated = (newAssets: Asset[]) => {
    updateAssetsWithHistory([...assets, ...newAssets])
    showNotification("Scene generated successfully! 🎉", "success")
  }

  const handleAIResponse = (message: string) => {
    setAiMessages((prev) => [...prev, { id: Date.now().toString(), text: message, isUser: false }])
  }

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  const handleScreenshot = () => {
    showNotification("Screenshot captured! 📸", "success")
  }

  const handleQuickPublish = () => {
    // Save assets to localStorage and redirect to publish page
    const project = {
      id: selectedAsset?.id || Date.now().toString(),
      name: selectedAsset?.name || "AR Experience",
      assets: assets,
      arType,
      markerUrl: arType === "marker-based" ? markerUrl : undefined,
    }
    localStorage.setItem(`project-${project.id}`, JSON.stringify(project))
    setShowActionDialog(false)
    router.push(`/publish/${project.id}`)
  }

  const handleEditFirst = () => {
    setShowActionDialog(false)
  }

  // Handle rename for AssetHierarchy
  const handleRename = (id: string, name: string) => {
    const newAssets = assets.map((asset) =>
      asset.id === id ? { ...asset, name } : asset
    )
    updateAssetsWithHistory(newAssets)
    if (selectedAsset?.id === id) {
      setSelectedAsset({ ...selectedAsset, name })
    }
    showNotification(`Renamed asset to ${name}`, "success")
  }

  // Load selected model
  useEffect(() => {
    // Initialize AI welcome message
    setAiMessages([
      {
        id: Date.now().toString(),
        text: "🤖 Hi! I'm your AI assistant powered by NVIDIA Nemotron 70B. I can create 3D scenes in real-time just from your descriptions! Try saying something like 'Create a red cube and blue sphere' or 'Make a space scene with planets'.",
        isUser: false,
      },
    ])

    // Check for selected model from LLM
    const selectedModelData = localStorage.getItem("selectedModel")
    if (selectedModelData) {
      try {
        const selectedModel = JSON.parse(selectedModelData)
        const newAsset: Asset = {
          id: selectedModel.id,
          name: selectedModel.name,
          type: "model",
          url: selectedModel.url,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        }
        setAssets([newAsset])
        setSelectedAsset(newAsset)
        localStorage.removeItem("selectedModel")

        // Show action dialog after a short delay
        setTimeout(() => {
          setShowActionDialog(true)
        }, 1000)

        showNotification(`Added ${selectedModel.name} to your AR scene! 🎉`, "success")
      } catch (error) {
        console.error("Error loading selected model:", error)
      }
    }
  }, [])

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    const newAssets = assets.map((asset) =>
      asset.id === id ? { ...asset, ...updates } : asset
    )
    updateAssetsWithHistory(newAssets)
  }

  return (
    <div className="min-h-screen bg-background geometric-bg relative">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/projects">
              <Button variant="ghost" className="hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <span className="text-lg font-bold text-foreground">
              <span className="text-xl">AR</span>
              <span className="text-base font-light">dya</span>
            </span>
            <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
              Studio
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleQuickPublish}
              className="bg-foreground text-background hover:bg-foreground/90 glow-border"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Publish
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-4 h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <div className="md:w-80 flex flex-col gap-4">
          {/* Assets Panel */}
          <div className="flex-1 bg-background/50 border border-border rounded-lg shadow-lg">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center px-4 py-3 border-b border-border"
              onClick={() => setPanelsCollapsed((prev) => ({ ...prev, assets: !prev.assets }))}
            >
              <span className="font-medium">Assets</span>
              {panelsCollapsed.assets ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            {!panelsCollapsed.assets && (
              <div className="flex-1 overflow-auto p-4">
                <AssetHierarchy
                  assets={assets}
                  selectedAsset={selectedAsset}
                  onSelect={setSelectedAsset}
                  onDelete={(id) => {
                    updateAssetsWithHistory(assets.filter((asset) => asset.id !== id))
                    if (selectedAsset?.id === id) setSelectedAsset(null)
                  }}
                  onRename={handleRename}
                />
                <MediaUpload
                  onUpload={(file, type) => {
                    const newAsset: Asset = {
                      id: Date.now().toString(),
                      name: file.name,
                      type: type as AssetType,
                      url: URL.createObjectURL(file),
                      position: [0, 0, 0],
                      rotation: [0, 0, 0],
                      scale: [1, 1, 1],
                    }
                    updateAssetsWithHistory([...assets, newAsset])
                  }}
                />
                <ARTypeSelector
                  value={arType}
                  onValueChange={(type) => {
                    setARType(type)
                    if (type === "marker-based") setShowMarkerUploader(true)
                  }}
                />
              </div>
            )}
          </div>

          {/* AI Panel */}
          <div className="flex-1 bg-background/50 border border-border rounded-lg shadow-lg">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center px-4 py-3 border-b border-border"
              onClick={() => setPanelsCollapsed((prev) => ({ ...prev, ai: !prev.ai }))}
            >
              <span className="font-medium">AI Assistant</span>
              {panelsCollapsed.ai ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            {!panelsCollapsed.ai && (
              <div className="p-4 space-y-4">
                <AISceneGenerator onSceneGenerated={handleSceneGenerated} onResponse={handleAIResponse} />
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {aiMessages.slice(-5).map((message) => (
                    <div
                      key={message.id}
                      className={`p-2 rounded-lg text-sm ${
                        message.isUser ? "bg-foreground text-background ml-4" : "bg-accent text-accent-foreground mr-4"
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Properties Panel */}
          <div className="flex-1 bg-background/50 border border-border rounded-lg shadow-lg">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center px-4 py-3 border-b border-border"
              onClick={() => setPanelsCollapsed((prev) => ({ ...prev, properties: !prev.properties }))}
            >
              <span className="font-medium">Properties</span>
              {panelsCollapsed.properties ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            {!panelsCollapsed.properties && (
              <div className="flex-1 overflow-auto p-4">
                <PropertiesPanel
                  selectedAsset={selectedAsset}
                  onUpdate={(updates) => selectedAsset && updateAsset(selectedAsset.id, updates)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative bg-background/20 overflow-hidden">
          <Canvas>
            <PerspectiveCamera makeDefault position={[5, 5, 5]} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Grid infiniteGrid />
            {assets.map((asset) =>
              asset.type === "model" ? (
                <Model
                  key={asset.id}
                  url={asset.url}
                  position={asset.position}
                  rotation={asset.rotation}
                  scale={asset.scale}
                  isSelected={selectedAsset?.id === asset.id}
                  onClick={() => setSelectedAsset(asset)}
                />
              ) : asset.type === "primitive" ? (
                <PrimitiveObject
                  key={asset.id}
                  asset={asset}
                  isSelected={selectedAsset?.id === asset.id}
                  onClick={() => setSelectedAsset(asset)}
                />
              ) : (
                <mesh
                  key={asset.id}
                  position={asset.position}
                  rotation={asset.rotation}
                  scale={asset.scale}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color={selectedAsset?.id === asset.id ? "hotpink" : "orange"} />
                </mesh>
              ),
            )}
          </Canvas>
          <div className="absolute top-4 left-4">
            <Toolbar activeTool={activeTool} setActiveTool={handleToolChange} onUndo={undo} onRedo={redo} />
          </div>
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <ScreenshotButton onScreenshot={handleScreenshot} />
            <Button
              variant="outline"
              onClick={() => setShowPhonePreview(true)}
              className="bg-background/50 border-border text-foreground hover:bg-accent btn-outline-hover-fix"
            >
              📱 Preview
            </Button>
          </div>
          <div className="absolute top-4 right-4">
            <PlayPauseButton isPlaying={isPlaying} onToggle={togglePlay} />
          </div>
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-md glass-effect glow-border golden-aura !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 !z-[9999] !m-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground glow-text">
              <span className="text-lg font-bold golden-shimmer">
                <span className="text-xl">AR</span>
                <span className="text-base font-light">dya</span>
              </span>
              Your AR Model is Ready!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="border-border bg-accent/20 silver-aura">
              <CardContent className="p-4">
                <p className="text-sm text-foreground">
                  🎉 Great! Your AR model has been added to the studio. What would you like to do next?
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-3">
              <Button onClick={handleQuickPublish} className="btn-primary glow-border h-12 golden-aura">
                <Share2 className="h-4 w-4 mr-2" />
                Publish Now & Get QR Code
              </Button>

              <Button onClick={handleEditFirst} variant="outline" className="h-12 btn-outline-hover-fix silver-aura">
                <Edit className="h-4 w-4 mr-2" />
                Customize First, Then Publish
              </Button>
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                You can always publish later from the top menu
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Phone Preview Modal */}
      <PhonePreview
        open={showPhonePreview}
        onOpenChange={setShowPhonePreview}
        assets={assets}
        isDarkMode={true}
        isPlaying={isPlaying}
      />

      {/* Notification */}
      {notification && <Notification message={notification.message} type={notification.type} />}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-foreground border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                <span className="text-xl">AR</span>
                <span className="text-base font-light">dya</span>
              </h3>
              <p className="text-sm text-muted-foreground">Creating your AR experience...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ARCreator