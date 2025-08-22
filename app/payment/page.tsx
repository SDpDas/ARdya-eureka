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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CreditCard, Check } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Credit card form state
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // In a real app, you would call your payment processing API
      // For demo purposes, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user subscription status in localStorage
      const userJson = localStorage.getItem("user")
      if (userJson) {
        const user = JSON.parse(userJson)
        user.subscription = {
          plan: "premium",
          startDate: new Date().toISOString(),
          status: "active",
        }
        localStorage.setItem("user", JSON.stringify(user))
      }

      setSuccess(true)

      // Redirect to projects page after 3 seconds
      setTimeout(() => {
        router.push("/projects")
      }, 3000)
    } catch (err) {
      setError("Payment processing failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>Thank you for subscribing to VisiARise Premium.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Your subscription is now active. You can now enjoy all premium features.</p>
            <p className="text-sm text-muted-foreground">Redirecting you to your projects...</p>
          </CardContent>
          <CardFooter>
            <Link href="/projects" className="w-full">
              <Button className="w-full">Go to Projects</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="text-xl font-bold">VisiARise Studio</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Subscribe to VisiARise Premium for $4/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Tabs defaultValue="card">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="card">Credit Card</TabsTrigger>
                        <TabsTrigger value="paypal">PayPal</TabsTrigger>
                      </TabsList>
                      <TabsContent value="card" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <div className="relative">
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              maxLength={19}
                              required
                            />
                            <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                              maxLength={5}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="paypal" className="py-4">
                        <div className="text-center p-6">
                          <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                          <Button
                            type="button"
                            className="w-full"
                            onClick={() => alert("PayPal integration not available in demo")}
                          >
                            Continue with PayPal
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="pt-4">
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          "Pay $4.00"
                        )}
                      </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      By subscribing, you agree to our Terms of Service and Privacy Policy. You can cancel your
                      subscription at any time.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Premium Plan</span>
                    <span>$4.00</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>$4.00</span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <h3 className="font-medium">What's included:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                        <span>Unlimited AR projects</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                        <span>Premium 3D model library</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                        <span>Multiple export formats</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                        <span>Priority support</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
