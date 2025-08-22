"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, ArrowRight, CuboidIcon as Cube, Wand2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

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

export default function LLMPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Local model database (stored in public/models)
  const modelDatabase: ModelRecommendation[] = [
    {
      id: "f1-racing-car",
      name: "Formula 1 Racing Car",
      description: "High-performance F1 racing car for motorsport AR experiences",
      url: "/models/f1car.glb",
      thumbnail: "/images/f1-car.png",
      category: "Vehicles",
      keywords: ["f1", "formula1", "racing", "car", "motorsport", "speed", "racing car", "ferrari", "formula", "track"],
    },
    {
      id: "dining-table-wood",
      name: "Wooden Dining Table",
      description: "Elegant wooden dining table for home furniture visualization",
      url: "/models/dining_table_glass.glb",
      thumbnail: "/images/dining.png",
      category: "Furniture",
      keywords: ["dining table", "table", "furniture", "wood", "dining", "home", "kitchen", "family", "meal", "interior"],
    },
    {
      id: "tiger-bengal",
      name: "Bengal Tiger",
      description: "Majestic Bengal tiger for wildlife and educational AR experiences",
      url: "/models/tiger.glb",
      thumbnail: "/images/tiger.png",
      category: "Animals",
      keywords: ["tiger", "bengal", "wildlife", "predator", "jungle", "big cat", "stripes", "animal", "nature", "safari"],
    },
    {
      id: "volcano-active",
      name: "Active Volcano",
      description: "Dramatic volcano model with lava effects for geological AR experiences",
      url: "/models/volcano.glb",
      thumbnail: "/images/volcano.png",
      category: "Nature",
      keywords: ["volcano", "lava", "eruption", "mountain", "geology", "fire", "magma", "nature", "earth", "disaster"],
    },
    {
      id: "james-bond",
      name: "Movie Star",
      description: "A sophisticated and peerless spy who has a good knack of solving important cases",
      url: "/models/james_bond.glb",
      thumbnail: "/images/bond.png",
      category: "character",
      keywords: ["james", "bond", "name", "spy", "crime", "thiller", "brosnan", "craig", "movie", "english"],
    },
  ];

  useEffect(() => {
    // Check if user is logged in (optional, can be removed if not needed)
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    // Welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content:
        "Hi! I'm ARdya's AI assistant. 🤖 Tell me what kind of AR experience you'd like to create, and I'll help you find the perfect 3D models and set everything up! Try describing something like 'I want a floating astronaut for my room' or 'Create a dinosaur for kids to learn about'.",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [router])

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
          score += 3
        }
        if (model.description.toLowerCase().includes(keyword)) {
          score += 2
        }
        if (model.category.toLowerCase().includes(keyword)) {
          score += 2
        }
      })

      if (score > 0) {
        recommendations.push({ model, score })
      }
    })

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((r) => r.model)
  }

  const handleAIResponse = async (userPrompt: string) => {
    setIsLoading(true)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const recommendations = findModelRecommendations(userPrompt)

    let responseContent = ""
    if (recommendations.length > 0) {
      responseContent = `Perfect! 🎯 Based on your description "${userPrompt}", I found some amazing 3D models that would work great for your AR experience. Here are my top recommendations:`
    } else {
      responseContent = `I understand you want to create "${userPrompt}". Let me search our model library for something that could work for your AR experience. You might want to try being more specific about the object you'd like to include.`
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
    // Store selected model and redirect to creator
    localStorage.setItem("selectedModel", JSON.stringify(model))
    router.push("/creator")
  }

  const quickPrompts = [
    "Create a really fast F1 car having twin turbo engines",
    "I want a tiger for kids to learn",
    "Show me a dining table for furniture",
    "Make a volcano that has magma flowing out of it",
    "Create James Bond, the action thriller hero",
    "I will like to see a backpack to know its size",
  ]

  return (
    <div className="min-h-screen bg-background geometric-bg">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground glow-text">
              <span className="text-2xl">AR</span>
              <span className="text-lg font-light">dya</span>
            </span>
            <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
              AI Assistant
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" onClick={() => router.push("/projects")} className="hover:bg-accent">
              Back to Projects
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden glass-effect">
          {/* Chat Header */}
          <div className="bg-foreground p-6 text-background">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-background/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI AR Creator</h2>
                <p className="text-background/80">Describe your AR vision and I'll make it reality</p>
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="p-4 bg-accent/20 border-b border-border">
            <p className="text-sm text-muted-foreground mb-3">💡 Quick ideas to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs hover:bg-accent hover:border-foreground hover:text-foreground transition-colors"
                  onClick={() => setInputValue(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.type === "user" ? "justify-end" : ""}`}>
                {message.type === "assistant" && (
                  <Avatar className="w-10 h-10 bg-foreground shadow-lg">
                    <AvatarFallback>
                      <Bot className="h-5 w-5 text-background" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                  <Card
                    className={`${
                      message.type === "user"
                        ? "bg-foreground text-background border-0 shadow-lg"
                        : "bg-accent border-border"
                    }`}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                    </CardContent>
                  </Card>

                  {/* Model Recommendations */}
                  {message.recommendations && (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm font-medium text-foreground mb-3">🎯 Perfect matches found:</p>
                      {message.recommendations.map((model) => (
                        <Card
                          key={model.id}
                          className="border-2 border-border hover:border-foreground hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center shadow-inner">
                                <Cube className="h-8 w-8 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-foreground">{model.name}</h3>
                                <p className="text-muted-foreground text-sm mb-2">{model.description}</p>
                                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                                  {model.category}
                                </Badge>
                              </div>
                              <Button
                                onClick={() => handleModelSelect(model)}
                                className="relative overflow-hidden bg-foreground text-background font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                              >
                                <span className="relative z-10 flex items-center gap-2">
                                  Select & Create
                                  <ArrowRight className="h-4 w-4" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === "user" && (
                  <Avatar className="w-10 h-10 bg-accent shadow-lg">
                    <AvatarFallback>
                      <User className="h-5 w-5 text-accent-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 bg-foreground shadow-lg">
                  <AvatarFallback>
                    <Bot className="h-5 w-5 text-background" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-accent">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <span className="text-sm text-foreground ml-2 font-medium">AI is searching models...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-border p-6 bg-accent/20">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Describe your AR experience... (e.g., 'I want a floating astronaut for my room')"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="h-12 text-lg pr-12 border-2 border-border focus:border-foreground rounded-xl"
                  disabled={isLoading}
                />
                <Wand2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button
                type="submit"
                size="lg"
                className="relative overflow-hidden bg-foreground text-background font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                disabled={isLoading || !inputValue.trim()}
              >
                <span className="relative z-10">
                  <Send className="h-5 w-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}