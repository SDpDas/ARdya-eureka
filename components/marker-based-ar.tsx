"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, Download } from "lucide-react"

interface MarkerBasedARProps {
  modelUrl: string
  markerUrl: string
  title: string
  onBack: () => void
}

export function MarkerBasedAR({ modelUrl, markerUrl, title, onBack }: MarkerBasedARProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isARSupported, setIsARSupported] = useState(true)

  useEffect(() => {
    // Load A-Frame and AR.js scripts
    const loadScripts = async () => {
      try {
        // Check if scripts are already loaded
        if (document.querySelector('script[src*="aframe"]')) {
          initializeAR()
          return
        }

        // Load A-Frame
        const aframeScript = document.createElement("script")
        aframeScript.src = "https://aframe.io/releases/1.4.0/aframe.min.js"
        aframeScript.async = true
        document.head.appendChild(aframeScript)

        // Load AR.js after A-Frame is loaded
        aframeScript.onload = () => {
          const arjsScript = document.createElement("script")
          arjsScript.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
          arjsScript.async = true
          document.head.appendChild(arjsScript)

          arjsScript.onload = () => {
            initializeAR()
          }

          arjsScript.onerror = () => {
            setError("Failed to load AR.js. Please check your internet connection.")
            setIsLoading(false)
          }
        }

        aframeScript.onerror = () => {
          setError("Failed to load A-Frame. Please check your internet connection.")
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error loading scripts:", err)
        setError("Failed to initialize AR. Please try again.")
        setIsLoading(false)
      }
    }

    const initializeAR = () => {
      // Check if browser supports WebRTC (needed for camera access)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsARSupported(false)
        setError("Your browser doesn't support AR features. Please try a different browser.")
        setIsLoading(false)
        return
      }

      // In a real app, we would convert the marker image to a pattern file (.patt)
      // For demo purposes, we'll use a default pattern

      setIsLoading(false)
    }

    loadScripts()

    return () => {
      // Clean up A-Frame scene when component unmounts
      const scene = document.querySelector("a-scene")
      if (scene) {
        scene.parentNode?.removeChild(scene)
      }
    }
  }, [])

  const downloadMarker = () => {
    const link = document.createElement("a")
    link.href = markerUrl
    link.download = "ar-marker.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading AR Experience...</p>
        </div>
      </div>
    )
  }

  if (error || !isARSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">AR Not Available</h2>
          <p className="mb-4">{error || "Your device doesn't support AR features."}</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* A-Frame Scene */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <a-scene
              embedded
              arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
              vr-mode-ui="enabled: false"
            >
              <a-marker preset="hiro">
                <a-entity
                  position="0 0 0"
                  scale="0.05 0.05 0.05"
                  rotation="-90 0 0"
                  gltf-model="${modelUrl}"
                ></a-entity>
              </a-marker>
              <a-entity camera></a-entity>
            </a-scene>
          `,
        }}
      />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="icon" className="bg-white" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">{title}</div>
          <Button variant="outline" size="icon" className="bg-white" onClick={downloadMarker}>
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-md mx-auto">
          <div className="flex items-center mb-2">
            <Camera className="h-5 w-5 mr-2" />
            <h3 className="font-bold">How to View</h3>
          </div>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Download and print the marker image</li>
            <li>Place the marker on a flat surface</li>
            <li>Point your camera at the marker</li>
            <li>The 3D model will appear on top of the marker</li>
          </ol>
          <Button className="mt-3 w-full" onClick={downloadMarker}>
            Download Marker Image
          </Button>
        </div>
      </div>
    </div>
  )
}
