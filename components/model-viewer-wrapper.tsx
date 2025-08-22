"use client"

import { useEffect, useState } from "react"

interface ModelViewerWrapperProps {
  modelUrl: string
  isDarkMode: boolean
}

export function ModelViewerWrapper({ modelUrl, isDarkMode }: ModelViewerWrapperProps) {
  const [isModelViewerDefined, setIsModelViewerDefined] = useState(false)

  useEffect(() => {
    // Check if model-viewer is defined
    const checkModelViewer = () => {
      if (typeof window !== "undefined" && customElements.get("model-viewer")) {
        setIsModelViewerDefined(true)
        return true
      }
      return false
    }

    // If not immediately available, set up a script to load it
    if (!checkModelViewer()) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://unpkg.com/@google/model-viewer@v3.0.2/dist/model-viewer.min.js"
      script.onload = () => {
        console.log("Model viewer script loaded")
        checkModelViewer()
      }
      script.onerror = (e) => {
        console.error("Error loading model-viewer script:", e)
      }
      document.head.appendChild(script)

      // Also set up an interval to check periodically
      const interval = setInterval(() => {
        if (checkModelViewer()) {
          clearInterval(interval)
        }
      }, 500)

      return () => {
        clearInterval(interval)
        // Clean up script if component unmounts before load
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }
  }, [])

  if (!isModelViewerDefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Loading 3D Viewer</h2>
          <p>Please wait while the 3D viewer loads...</p>
          <div className="mt-4 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full h-full"
      dangerouslySetInnerHTML={{
        __html: `
          <model-viewer
            id="model-viewer"
            src="${modelUrl}"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            shadow-intensity="1"
            auto-rotate
            style="width: 100%; height: 100%; background-color: ${isDarkMode ? "#1a1a1a" : "#f5f5f5"};"
          >
            <div class="progress-bar hide" slot="progress-bar">
              <div class="update-bar"></div>
            </div>
            <button slot="ar-button" style="background-color: #4285f4; color: white; border-radius: 4px; border: none; position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); padding: 0 16px; height: 36px; font-weight: 500;">
              View in your space
            </button>
          </model-viewer>
        `,
      }}
    />
  )
}
