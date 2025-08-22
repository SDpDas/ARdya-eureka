"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Share2, Eye, Smartphone, Download, QrCode } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface Project {
  id: string
  name: string
  assets: Array<{
    id: string
    name: string
    type: string
    url: string
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
  }>
  arType: "markerless" | "marker-based"
  markerUrl?: string
}

export default function ARViewPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [shareableLink, setShareableLink] = useState<string>("")
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectId = params.id as string
        if (!projectId) {
          setError("Invalid project ID")
          setIsLoading(false)
          return
        }

        // Load from localStorage
        const projectData = localStorage.getItem(`project-${projectId}`)
        if (projectData) {
          const parsedProject = JSON.parse(projectData)
          setProject(parsedProject)

          // Generate shareable link
          const baseUrl = window.location.origin
          const link = `${baseUrl}/ar/${projectId}`
          setShareableLink(link)

          // Generate QR code
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`
          setQrCodeUrl(qrUrl)
        } else {
          setError("AR experience not found")
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        setError("Failed to load AR experience. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `${project?.name || "AR-Experience"}-QR.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.name || "AR Experience",
          text: "Check out this amazing AR experience created with ARdya!",
          url: shareableLink,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      copyToClipboard()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background geometric-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-foreground border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              <span className="text-xl">AR</span>
              <span className="text-base font-light">dya</span>
            </h3>
            <p className="text-sm text-muted-foreground">Loading AR experience...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background geometric-bg flex items-center justify-center">
        <Card className="glass-effect glow-border p-6 text-center max-w-md">
          <h2 className="text-xl font-bold mb-4 text-foreground">AR Experience Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "This AR experience doesn't exist or has been removed."}
          </p>
          <Link href="/">
            <Button className="bg-foreground text-background">Go Home</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const modelUrl = project.assets?.find((asset) => asset.type === "model")?.url

  return (
    <div className="min-h-screen bg-background geometric-bg">
      {/* Load model-viewer script */}
      <script type="module" src="https://unpkg.com/@google/model-viewer@v3.0.2/dist/model-viewer.min.js"></script>

      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-lg font-bold text-foreground">
                <span className="text-xl">AR</span>
                <span className="text-base font-light">dya</span>
              </span>
              <h1 className="text-xl font-bold text-foreground ml-2">{project.name || "AR Experience"}</h1>
              <Badge className="ml-2 bg-green-500/20 text-green-500 border-green-500/30">Live</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={shareNative}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* AR Viewer */}
          <Card className="glass-effect glow-border overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square bg-accent/20 relative">
                {modelUrl && (
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: `
                        <model-viewer
                          id="ar-model-viewer"
                          src="${modelUrl}"
                          ar
                          ar-modes="webxr scene-viewer quick-look"
                          camera-controls
                          shadow-intensity="1"
                          auto-rotate
                          style="width: 100%; height: 100%; background-color: transparent;"
                          loading="eager"
                        >
                          <button slot="ar-button" style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 12px;
                            padding: 16px 32px;
                            font-size: 18px;
                            font-weight: 600;
                            position: absolute;
                            bottom: 24px;
                            left: 50%;
                            transform: translateX(-50%);
                            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                          ">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                              <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                              <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                            View in AR
                          </button>
                          <button slot="hotspot-hand" class="hotspot" data-position="0 1.8 0.5" data-normal="0 0 1">
                            <div class="annotation">👋 Tap to interact!</div>
                          </button>
                        </model-viewer>
                      `,
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sharing Options */}
          <div className="space-y-6">
            {/* QR Code */}
            <Card className="glass-effect glow-border">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code
                </h2>
                <div className="inline-block p-4 bg-background rounded-lg shadow-inner mb-4 border border-border">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48 mx-auto" />
                </div>
                <p className="text-muted-foreground mb-4">Scan with any smartphone camera to view in AR</p>
                <Button onClick={downloadQR} variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </CardContent>
            </Card>

            {/* Share Link */}
            <Card className="glass-effect glow-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share Link
                </h2>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 p-3 border border-border rounded-lg bg-background/50 text-foreground text-sm"
                  />
                  <Button onClick={copyToClipboard} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copySuccess && <p className="text-green-500 text-sm mb-4">✓ Link copied to clipboard!</p>}
                <Button onClick={shareNative} className="w-full bg-foreground text-background">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share AR Experience
                </Button>
              </CardContent>
            </Card>

            {/* VR Option */}
            <Card className="glass-effect glow-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  VR Experience
                </h2>
                <p className="text-muted-foreground mb-4">
                  Experience this in Virtual Reality using a VR headset or WebXR compatible device.
                </p>
                <Button
                  onClick={() => {
                    const modelViewer = document.querySelector("model-viewer") as any
                    if (modelViewer && modelViewer.activateXR) {
                      modelViewer.activateXR("immersive-vr")
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  🥽 Enter VR Mode
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="glass-effect glow-border">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">How to View in AR</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">1. Open on Mobile</h3>
                  <p className="text-muted-foreground text-sm">Scan the QR code or open this link on your smartphone</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">👆</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">2. Tap "View in AR"</h3>
                  <p className="text-muted-foreground text-sm">Tap the AR button to start the experience</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">📱</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">3. Place & Interact</h3>
                  <p className="text-muted-foreground text-sm">Point at a surface and tap to place the 3D model</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-500 px-6 py-3 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            AR experience is live and ready to share!
          </div>
        </div>
      </main>

      <style jsx global>{`
        model-viewer {
          width: 100%;
          height: 100%;
        }

        .hotspot {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
          color: #333;
          cursor: pointer;
          height: 20px;
          padding: 0;
          position: relative;
          transition: opacity 0.3s;
          width: 20px;
        }

        .annotation {
          background: rgba(0, 0, 0, 0.8);
          border-radius: 4px;
          color: white;
          font-size: 12px;
          padding: 4px 8px;
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}