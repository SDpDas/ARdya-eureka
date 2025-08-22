"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModelViewer } from "@/components/model-viewer"
import { MarkerBasedAR } from "@/components/marker-based-ar"
import { ArrowLeft, Share2 } from "lucide-react"

export default function PublishedModelPage() {
  const params = useParams()
  const router = useRouter()
  const [model, setModel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [arType, setArType] = useState<"markerless" | "marker-based">("markerless")

  useEffect(() => {
    // In a real app, you would fetch the model data from your backend
    // For now, we'll simulate loading the model from localStorage
    try {
      const savedModel = localStorage.getItem(`published-model-${params.id}`)
      if (savedModel) {
        const parsedModel = JSON.parse(savedModel)
        setModel(parsedModel)

        // Check if AR type is specified
        if (parsedModel.arType) {
          setArType(parsedModel.arType)
        }
      } else {
        // Fallback to a sample model if nothing is found
        setModel({
          id: params.id,
          name: "Sample Model",
          url: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
          description: "This is a sample 3D model for demonstration purposes.",
          arType: "markerless",
        })
      }
    } catch (err) {
      console.error("Error loading model:", err)
      setError("Failed to load model data")
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: model?.name || "VisiARise 3D Model",
        text: model?.description || "Check out this 3D model created with VisiARise Studio!",
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleBack = () => {
    router.push("/creator")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Link href="/creator">
            <Button className="mt-4">Back to Studio</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Render marker-based AR if that's the selected type
  if (arType === "marker-based") {
    return (
      <MarkerBasedAR
        modelUrl={model.url}
        markerUrl={model.markerUrl || "https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png"}
        title={model.name || "AR Experience"}
        onBack={handleBack}
      />
    )
  }

  // Otherwise render markerless AR (using model-viewer)
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/creator">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">{model?.name || "Published Model"}</h1>
          </div>
          <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 relative">
        {model && <ModelViewer modelUrl={model.url} isDarkMode={false} showArButton={true} />}
      </div>

      <div className="container py-4 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">{model?.name}</h2>
          <p className="text-muted-foreground mb-4">{model?.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">3D Model</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">AR Ready</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Interactive</span>
          </div>
        </div>
      </div>
    </main>
  )
}
