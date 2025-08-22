"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "user-123",
          email,
          name: email.split("@")[0],
        }),
      )

      router.push("/projects")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background geometric-bg flex items-center justify-center p-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-80 relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center mb-3">
            <span className="text-3xl font-bold text-foreground glow-text">
              <span className="text-4xl">AR</span>
              <span className="text-2xl font-light">dya</span>
            </span>
          </div>
          <p className="text-muted-foreground text-base">Welcome back</p>
        </div>

        <Card className="glass-effect glow-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-center text-foreground">Sign in</CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm">
              Enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:border-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground font-medium text-sm">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:border-foreground pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-foreground text-background font-semibold hover:bg-foreground/90 glow-border"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-t-transparent border-background rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-foreground hover:text-foreground/80 font-semibold hover:underline">
                Create account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
