"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bot, Zap, Smartphone, Share2, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)

    const user = localStorage.getItem("user")
    if (!user) {
      localStorage.setItem("pendingPrompt", prompt)
      router.push("/login")
      return
    }

    localStorage.setItem("currentPrompt", prompt)
    router.push("/llm")
  }

  const examplePrompts = [
    "Create a really fast F1 car having twin turbo engines",
    "I want a tiger for kids to learn",
    "Show me a dining table for furniture",
    "Make a volcano that has magma flowing out of it",
    "Create James Bond, the action thriller hero",
  ]

  const features = [
    {
      icon: <Bot className="h-8 w-8 text-foreground" />,
      title: "AI-Powered Creation",
      description: "Just describe what you want, and our AI will find the perfect 3D model for your AR experience.",
    },
    {
      icon: <Zap className="h-8 w-8 text-foreground" />,
      title: "Instant Automation",
      description: "No manual modeling required. From prompt to AR in minutes with automated optimization.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-foreground" />,
      title: "Universal AR",
      description: "Works on any smartphone or tablet. No app downloads, just scan and experience.",
    },
    {
      icon: <Share2 className="h-8 w-8 text-foreground" />,
      title: "Easy Sharing",
      description: "Get instant QR codes and shareable links to distribute your AR experiences anywhere.",
    },
  ]

  return (
    <main className="min-h-screen bg-background geometric-bg">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-foreground glow-text">
              <span className="text-3xl">AR</span>
              <span className="text-xl font-light">dya</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#examples"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Examples
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" className="border-border text-foreground hover:bg-accent">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-foreground text-background font-semibold hover:bg-foreground/90 glow-border">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Geometric background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-foreground/5 rounded-full blur-3xl float-animation"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-foreground/5 rounded-full blur-3xl float-animation"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-border rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-border rounded-full"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Badge className="mb-6 bg-accent text-accent-foreground border-border">
            <Sparkles className="h-3 w-3 mr-1" />
            AI + AUTOMATION IN AR
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground glow-text leading-tight">
            Transform Ideas into
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {" "}
              AR Experiences
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Simply describe what you want, and ARdya's AI will instantly create immersive AR experiences. No 3D modeling
            skills required.
          </p>

          {/* Prompt Input */}
          <Card className="max-w-2xl mx-auto mb-8 glass-effect glow-border">
            <CardContent className="p-6">
              <form onSubmit={handlePromptSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="What do you want to know?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="h-14 text-lg bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:border-foreground rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-lg bg-foreground text-background font-semibold hover:bg-foreground/90 glow-border"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating AR Experience...
                    </div>
                  ) : (
                    <>
                      Create AR Experience
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Example Prompts */}
          <div className="mb-16">
            <p className="text-sm text-muted-foreground mb-4">Try these examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs border-border text-muted-foreground hover:bg-accent hover:border-foreground hover:text-foreground transition-colors"
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                <span className="text-accent-foreground font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Describe</h3>
              <p className="text-sm text-muted-foreground">Tell us what AR experience you want to create</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                <span className="text-accent-foreground font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">AI Magic</h3>
              <p className="text-sm text-muted-foreground">Our AI finds and optimizes the perfect 3D models</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                <span className="text-accent-foreground font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Customize</h3>
              <p className="text-sm text-muted-foreground">Fine-tune your AR experience in our studio</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                <span className="text-accent-foreground font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Share</h3>
              <p className="text-sm text-muted-foreground">Get QR codes and links to share instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground glow-text">
              Powered by AI & Automation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of AR creation with intelligent automation that makes complex 3D experiences
              accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect glow-border hover:bg-accent/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-foreground/5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 glow-text">
            Ready to Create Your First AR Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using ARdya to bring their ideas to life in augmented reality.
          </p>
          <Button
            size="lg"
            className="bg-foreground text-background text-lg px-8 py-3 font-semibold hover:bg-foreground/90 glow-border"
            onClick={() => document.querySelector("input")?.focus()}
          >
            Start Creating Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-xl font-bold text-foreground glow-text">
                  <span className="text-2xl">AR</span>
                  <span className="text-lg font-light">dya</span>
                </span>
              </div>
              <p className="text-muted-foreground">
                AI + Automation in AR. Transform ideas into immersive experiences.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-foreground">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#examples" className="hover:text-foreground transition-colors">
                    Examples
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-foreground">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-foreground">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 ARdya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
