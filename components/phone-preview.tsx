"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Asset } from "@/components/ar-creator"
import { ModelViewer } from "@/components/model-viewer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PhonePreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assets: Asset[]
  isDarkMode: boolean
  isPlaying: boolean
}

export function PhonePreview({ open, onOpenChange, assets, isDarkMode, isPlaying }: PhonePreviewProps) {
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 2000) // Simulated loading time
    }
  }, [open])

  const currentAsset = assets.length > 0 ? assets[currentAssetIndex] : null

  const handleNext = () => {
    setCurrentAssetIndex((prevIndex) => (prevIndex + 1) % assets.length)
  }

  const handlePrevious = () => {
    setCurrentAssetIndex((prevIndex) => (prevIndex - 1 + assets.length) % assets.length)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-6 glass-effect golden-aura">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-foreground glow-text">Phone Preview</DialogTitle>
        </DialogHeader>

        {/* Phone Frame */}
        <div className="phone-frame mx-auto">
          <div className="phone-screen w-[320px] h-[640px] relative">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-black flex items-center justify-between px-4 z-20">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <span className="text-white text-xs ml-2">ARdya</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 border border-white rounded-sm">
                  <div className="w-2 h-1 bg-white rounded-sm m-0.5"></div>
                </div>
                <span className="text-white text-xs">100%</span>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="absolute top-8 left-0 right-0 bottom-12 bg-white dark:bg-gray-900 overflow-hidden">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-lg font-semibold text-gray-600 dark:text-gray-300">Loading AR...</div>
                  </div>
                </div>
              ) : currentAsset ? (
                <div className="w-full h-full relative">
                  {currentAsset.type === "model" && (
                    <ModelViewer
                      modelUrl={currentAsset.url}
                      isDarkMode={isDarkMode}
                      isPlaying={isPlaying}
                      className="w-full h-full"
                    />
                  )}
                  {currentAsset.type === "image" && (
                    <img
                      src={currentAsset.url || "/placeholder.svg"}
                      alt={currentAsset.name}
                      className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800"
                    />
                  )}
                  {currentAsset.type === "video" && (
                    <video
                      src={currentAsset.url}
                      className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800"
                      autoPlay={isPlaying}
                      loop
                      muted
                      playsInline
                    />
                  )}

                  {/* AR UI Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-white text-sm font-medium">AR Mode</span>
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Bottom AR Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center z-10">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-2">
                      <span className="text-white text-sm">Tap to place object</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <div className="text-lg font-semibold text-gray-600 dark:text-gray-300">No AR content</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Add some assets to preview</div>
                  </div>
                </div>
              )}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>

            {/* Navigation Controls */}
            {assets.length > 1 && !isLoading && (
              <div className="absolute bottom-16 left-4 right-4 flex justify-between z-20">
                <Button
                  onClick={handlePrevious}
                  variant="secondary"
                  size="icon"
                  className="bg-black/50 backdrop-blur-sm border-0 text-white hover:bg-black/70 w-10 h-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  {assets.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentAssetIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  onClick={handleNext}
                  variant="secondary"
                  size="icon"
                  className="bg-black/50 backdrop-blur-sm border-0 text-white hover:bg-black/70 w-10 h-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Asset Info */}
        {currentAsset && (
          <div className="mt-4 text-center">
            <div className="text-sm font-medium text-foreground">{currentAsset.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{currentAsset.type} Asset</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
