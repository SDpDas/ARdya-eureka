"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wand2, Sparkles, Loader2 } from "lucide-react"
import type { Asset } from "@/components/ar-creator"
import { v4 as uuidv4 } from "uuid"

interface AISceneGeneratorProps {
  onSceneGenerated: (assets: Asset[]) => void
  onResponse: (message: string) => void
}

export function AISceneGenerator({ onSceneGenerated, onResponse }: AISceneGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const quickPrompts = [
    "Create a red cube floating in space",
    "Make a simple living room scene",
    "Generate a space scene with planets",
    "Create a colorful geometric garden",
    "Build a minimalist office setup",
    "Make a fantasy crystal cave",
  ]

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    onResponse("🎨 Generating your 3D scene...")

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate scene")
      }

      const data = await response.json()

      // Convert AI response to assets
      if (data.sceneData && data.sceneData.objects) {
        const newAssets: Asset[] = data.sceneData.objects.map((obj: any) => ({
          id: uuidv4(),
          name: obj.name || `Generated ${obj.shape || "Object"}`,
          type: obj.type === "model" ? "model" : ("primitive" as any),
          url: obj.url || "", // For primitives, we'll handle this in the scene
          position: obj.position || [0, 0, 0],
          rotation: obj.rotation || [0, 0, 0],
          scale: obj.scale || [1, 1, 1],
          primitiveData:
            obj.type === "primitive"
              ? {
                  shape: obj.shape,
                  color: obj.color,
                  material: obj.material,
                }
              : undefined,
        }))

        onSceneGenerated(newAssets)
        onResponse(data.text || "✨ Scene generated successfully! Your 3D objects are now in the scene.")
      } else {
        onResponse(
          data.text ||
            "I created a response but couldn't generate 3D objects. Try being more specific about shapes and objects.",
        )
      }
    } catch (error) {
      console.error("Scene generation error:", error)
      onResponse("❌ Sorry, I couldn't generate the scene. Please try again with a different description.")
    } finally {
      setIsGenerating(false)
      setPrompt("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <Card className="glass-effect golden-aura">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground glow-text">
          <Wand2 className="h-5 w-5" />
          AI Scene Generator
          <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
            <Sparkles className="h-3 w-3 mr-1" />
            NVIDIA Nemotron
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Describe the 3D scene you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="bg-foreground text-background hover:bg-foreground/90 glow-border"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Quick ideas:</p>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.map((quickPrompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs btn-outline-hover-fix"
                onClick={() => setPrompt(quickPrompt)}
                disabled={isGenerating}
              >
                {quickPrompt}
              </Button>
            ))}
          </div>
        </div>

        {isGenerating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <span className="ml-2">AI is creating your scene...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
