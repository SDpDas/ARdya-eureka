"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, ArrowRight, CuboidIcon as Cube, ArrowLeft } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  recommendations?: ModelRecommendation[]
}

interface ModelRecommendation {
  id: string
  name: string
  description: string
  url: string
  thumbnail: string
  category: string
  keywords: string[]
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample model database (in real app, this would come from Firebase)
  const modelDatabase: ModelRecommendation[] = [
    {
      id: "astronaut-1",
      name: "Floating Astronaut",
      description: "A detailed astronaut model perfect for space-themed AR experiences",
      url: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      thumbnail: "/placeholder.svg?height=100&width=100&text=Astronaut",
      category: "Space",
      keywords: ["astronaut", "space", "floating", "nasa", "spaceman", "cosmic"],
    },
    {
      id: "car-vintage",
      name: "Vintage Car",
      description: "Classic vintage automobile for retro-themed experiences",
      url: "https://storage.googleapis.com/ardya-models/vintage-car.glb",
      thumbnail: "/placeholder.svg?height=100&width=100&text=Car",
      category: "Vehicles",
      keywords: ["car", "vintage", "automobile", "classic", "vehicle", "retro"],
    },
    {
      id: "dinosaur-trex",
      name: "T-Rex Dinosaur",
      description: "Interactive T-Rex perfect for educational AR experiences",
      url: "https://storage.googleapis.com/ardya-models/trex.glb",
      thumbnail: "/placeholder.svg?height=100&width=100&text=T-Rex",
      category: "Animals",
      keywords: ["dinosaur", "trex", "t-rex", "prehistoric", "kids", "education", "jurassic"],
    },
    {
      id: "chair-modern",
      name: "Modern Chair",
      description: "Sleek modern chair for furniture visualization",
      url: "https://storage.googleapis.com/ardya-models/modern-chair.glb",
      thumbnail: "/placeholder.svg?height=100&width=100&text=Chair",
      category: "Furniture",
      keywords: ["chair", "furniture", "modern", "seating", "home", "interior"],
    },
    {
      id: "robot-dancing",
      name: "Dancing Robot",
      description: "Animated robot with dancing capabilities",
      url: "https://storage.googleapis.com/ardya-models/dancing-robot.glb",
      thumbnail: "/placeholder.svg?height=100&width=100&text=Robot",
      category: "Entertainment",
      keywords: ["robot", "dancing", "animation", "entertainment", "fun", "interactive"],
    },
  ]

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    // Check for pending prompt from landing page
    const pendingPrompt = localStorage.getItem("pendingPrompt")
    const currentPrompt = localStorage.getItem("currentPrompt")

    if (pendingPrompt || currentPrompt) {
      const prompt = pendingPrompt || currentPrompt
      localStorage.removeItem("pendingPrompt")
      localStorage.removeItem("currentPrompt")

      // Add initial message
      const initialMessage: Message = {
        id: "initial",
        type: "user",
        content: prompt!,
        timestamp: new Date(),
      }

      setMessages([initialMessage])
      handleAIResponse(prompt!)
    } else {
      // Welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        type: "assistant",
        content:
          "Hi! I'm ARDYA's AI assistant. Describe the AR experience you'd like to create, and I'll help you find the perfect 3D models and set everything up!",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const findModelRecommendations = (prompt: string): ModelRecommendation[] => {
    const keywords = prompt.toLowerCase().split(/\s+/)
    const recommendations: { model: ModelRecommendation; score: number }[] = []

    modelDatabase.forEach((model) => {
      let score = 0
      keywords.forEach((keyword) => {
        model.keywords.forEach((modelKeyword) => {
          if (modelKeyword.includes(keyword) || keyword.includes(modelKeyword)) {
            score += 1
          }
        })
        if (model.name.toLowerCase().includes(keyword)) {
          score += 2
        }
        if (model.description.toLowerCase().includes(keyword)) {
          score += 1
        }
      })

      if (score > 0) {
        recommendations.push({ model, score })
      }
    })

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.model)
  }

  const handleAIResponse = async (userPrompt: string) => {
    setIsLoading(true)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const recommendations = findModelRecommendations(userPrompt)

    let responseContent = ""
    if (recommendations.length > 0) {
      responseContent = `Great idea! Based on your description "${userPrompt}", I found some perfect 3D models for your AR experience. Here are my top recommendations:`
    } else {
      responseContent = `I understand you want to create "${userPrompt}". Let me search for some suitable 3D models that could work for your AR experience.`
    }

    const aiMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: responseContent,
      timestamp: new Date(),
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    }

    setMessages((prev) => [...prev, aiMessage])
    setIsLoading(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")

    await handleAIResponse(currentInput)
  }

  const handleModelSelect = (model: ModelRecommendation) => {
    // Store selected model and redirect to studio
    localStorage.setItem("selectedModel", JSON.stringify(model))
    router.push("/creator")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/projects")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ARDYA
              </span>
              <Badge variant="secondary" className="ml-2">
                AI Assistant
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.type === "user" ? "justify-end" : ""}`}>
                {message.type === "assistant" && (
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0">
                    <AvatarFallback className="bg-transparent">
                      <Bot className="h-5 w-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                  <Card
                    className={`${message.type === "user" ? "bg-blue-600 border-blue-600" : "bg-gray-50 border-gray-200"}`}
                  >
                    <CardContent className="p-4">
                      <p
                        className={`text-sm leading-relaxed ${message.type === "user" ? "text-white" : "text-gray-900 font-medium"}`}
                      >
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Model Recommendations */}
                  {message.recommendations && (
                    <div className="mt-4 space-y-3">
                      {message.recommendations.map((model) => (
                        <Card
                          key={model.id}
                          className="border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Cube className="h-8 w-8 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg text-gray-900 mb-1">{model.name}</h3>
                                <p className="text-gray-700 text-sm mb-2 line-clamp-2">{model.description}</p>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                                  {model.category}
                                </Badge>
                              </div>
                              <Button
                                onClick={() => handleModelSelect(model)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
                              >
                                Select Model
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === "user" && (
                  <Avatar className="w-10 h-10 bg-gray-200 flex-shrink-0">
                    <AvatarFallback className="bg-gray-200">
                      <User className="h-5 w-5 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0">
                  <AvatarFallback className="bg-transparent">
                    <Bot className="h-5 w-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <span className="text-sm text-gray-800 ml-2 font-medium">AI is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <Input
                type="text"
                placeholder="Describe your AR experience or ask for modifications..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
