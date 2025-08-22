"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Smartphone, Share2, Copy, Download, QrCode } from "lucide-react"
import { ModelViewer } from "@/components/model-viewer"
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

export default function PublishPage() {
  const params = useParams()
  const router = useRouter()
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

        // Load project from localStorage
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
          setError("Project not found")
        }
      } catch (err) {
        console.error("Error loading project:", err)
        setError("Failed to load project data")
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
        <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background geometric-bg flex items-center justify-center">
        <Card className="glass-effect glow-border p-6 text-center">
          <h2 className="text-xl font-bold mb-4 text-foreground">Error</h2>
          <p className="text-muted-foreground mb-4">{error || "Project not found"}</p>
          <Link href="/creator">
            <Button className="bg-foreground text-background">Back to Creator</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const modelUrl = project.assets?.find((asset) => asset.type === "model")?.url

  return (
    <div className="min-h-screen bg-background geometric-bg">
      <header className="bg-background/80 backdrop-blur-md border-b border-border p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/creator">
              <Button variant="ghost" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Studio
              </Button>
            </Link>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-lg font-bold text-foreground">
                <span className="text-xl">AR</span>
                <span className="text-base font-light">dya</span>
              </span>
              <h1 className="text-xl font-bold text-foreground ml-2">{project.name || "AR Experience"}</h1>
              <Badge className="ml-2 bg-green-500/20 text-green-500 border-green-500/30">Published</Badge>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Model Preview */}
          <Card className="glass-effect glow-border overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Smartphone className="h-5 w-5" />
                AR Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-square bg-accent/20 relative">
                {modelUrl && <ModelViewer modelUrl={modelUrl} isDarkMode={true} showArButton={true} />}
              </div>
            </CardContent>
          </Card>

          {/* Sharing Options */}
          <div className="space-y-6">
            {/* QR Code */}
            <Card className="glass-effect glow-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <QrCode className="h-5 w-5" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="inline-block p-4 bg-background rounded-lg shadow-inner mb-4 border border-border">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48 mx-auto" />
                </div>
                <p className="text-muted-foreground mb-4">Scan with any smartphone camera to view in AR</p>
                <Button
                  onClick={downloadQR}
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-accent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </CardContent>
            </Card>

            {/* Shareable Link */}
            <Card className="glass-effect glow-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Share2 className="h-5 w-5" />
                  Share Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 p-3 border border-border rounded-lg bg-background/50 text-foreground text-sm"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="border-border text-foreground hover:bg-accent"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copySuccess && <p className="text-green-500 text-sm mb-4">✓ Link copied to clipboard!</p>}
                <Button onClick={shareNative} className="w-full bg-foreground text-background hover:bg-foreground/90">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share AR Experience
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="glass-effect glow-border">
              <CardHeader>
                <CardTitle className="text-foreground">How to Share</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm border border-border">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">QR Code</h4>
                      <p className="text-muted-foreground text-sm">Print or display the QR code for easy scanning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm border border-border">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Direct Link</h4>
                      <p className="text-muted-foreground text-sm">
                        Share the link via social media, email, or messaging
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm border border-border">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Embed</h4>
                      <p className="text-muted-foreground text-sm">Add to websites or apps using the shareable link</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-500 px-6 py-3 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Your AR experience is now live and ready to share!
          </div>
        </div>
      </main>
    </div>
  )
}