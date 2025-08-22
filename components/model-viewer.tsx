"use client"

import { useEffect, useState } from "react"

interface ModelViewerProps {
  modelUrl: string
  isDarkMode: boolean
  showArButton?: boolean
}

export function ModelViewer({ modelUrl, isDarkMode, showArButton = true }: ModelViewerProps) {
  const [isModelViewerDefined, setIsModelViewerDefined] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load model-viewer script if not already loaded
    const loadModelViewer = async () => {
      if (typeof window !== "undefined") {
        if (customElements.get("model-viewer")) {
          setIsModelViewerDefined(true)
          return
        }

        try {
          // Create and append script
          const script = document.createElement("script")
          script.type = "module"
          script.src = "https://unpkg.com/@google/model-viewer@v3.0.2/dist/model-viewer.min.js"

          // Create a promise that resolves when the script loads
          const scriptLoaded = new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
          })

          document.head.appendChild(script)

          // Wait for script to load
          await scriptLoaded

          // Check if model-viewer is now defined
          if (customElements.get("model-viewer")) {
            console.log("model-viewer custom element is defined")
            setIsModelViewerDefined(true)
          } else {
            console.error("model-viewer failed to initialize")
            setError("Failed to load 3D viewer component")
          }
        } catch (err) {
          console.error("Error loading model-viewer:", err)
          setError("Failed to load 3D viewer component")
        }
      }
    }

    loadModelViewer()
  }, [])

  useEffect(() => {
    if (isModelViewerDefined) {
      // Add event listeners once model-viewer is available
      const handleModelLoad = () => {
        console.log("Model loaded successfully")
        setIsLoading(false)
      }

      const handleModelError = (e: any) => {
        console.error("Model loading error:", e)
        setError("Failed to load 3D model. Please check the model format and URL.")
        setIsLoading(false)
      }

      const modelViewer = document.getElementById("model-viewer") as any
      if (modelViewer) {
        modelViewer.addEventListener("load", handleModelLoad)
        modelViewer.addEventListener("error", handleModelError)

        return () => {
          modelViewer.removeEventListener("load", handleModelLoad)
          modelViewer.removeEventListener("error", handleModelError)
        }
      }
    }
  }, [isModelViewerDefined])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

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
    <div className="w-full h-full">
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{
          __html: `
            <model-viewer
              id="model-viewer"
              src="${modelUrl}"
              ${showArButton ? 'ar ar-modes="webxr scene-viewer quick-look"' : ""}
              camera-controls
              shadow-intensity="1"
              auto-rotate
              style="width: 100%; height: 100%; background-color: ${isDarkMode ? "#1a1a1a" : "#f5f5f5"};"
            >
              <div class="progress-bar hide" slot="progress-bar">
                <div class="update-bar"></div>
              </div>
              ${
                showArButton
                  ? `
                <button slot="ar-button" style="background-color: #4285f4; color: white; border-radius: 4px; border: none; position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); padding: 0 16px; height: 36px; font-weight: 500;">
                  View in your space
                </button>
              `
                  : ""
              }
            </model-viewer>
          `,
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <style jsx global>{`
        model-viewer {
          width: 100%;
          height: 100%;
        }
        
        .progress-bar {
          display: block;
          width: 33%;
          height: 10%;
          max-height: 2px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          border-radius: 25px;
          box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.5), 0px 0px 5px 1px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.9);
          background-color: rgba(0, 0, 0, 0.5);
        }

        .progress-bar.hide {
          visibility: hidden;
          transition: visibility 0.3s;
        }

        .update-bar {
          background-color: rgba(255, 255, 255, 0.9);
          width: 0%;
          height: 100%;
          border-radius: 25px;
          float: left;
          transition: width 0.3s;
        }
      `}</style>
    </div>
  )
}
