import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function Pricing() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {/* Free Plan */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">Free Trial</CardTitle>
          <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-100">
            <span className="text-4xl font-extrabold tracking-tight">$0</span>
            <span className="ml-1 text-xl font-semibold">/month</span>
          </div>
          <CardDescription className="mt-2">Perfect for trying out the platform</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Create up to 3 AR projects</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Basic 3D model library</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Export in GLB format</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Community support</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Link href="/creator" className="w-full">
            <Button variant="outline" className="w-full">
              Start Free
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Premium Plan */}
      <Card className="flex flex-col border-blue-500 dark:border-blue-400 shadow-lg relative">
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          POPULAR
        </div>
        <CardHeader>
          <CardTitle className="text-xl">Premium</CardTitle>
          <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-100">
            <span className="text-4xl font-extrabold tracking-tight">$4</span>
            <span className="ml-1 text-xl font-semibold">/month</span>
          </div>
          <CardDescription className="mt-2">For professionals and small businesses</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Create unlimited AR projects</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Premium 3D model library</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Export in GLB, GLTF, and FBX formats</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Priority email support</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Custom textures and materials</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Advanced animation controls</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Link href="/payment" className="w-full">
            <Button className="w-full">Subscribe Now</Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Enterprise Plan */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">Enterprise</CardTitle>
          <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-100">
            <span className="text-4xl font-extrabold tracking-tight">$12</span>
            <span className="ml-1 text-xl font-semibold">/month</span>
          </div>
          <CardDescription className="mt-2">For teams and large organizations</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Everything in Premium</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Team collaboration features</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Advanced analytics</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Dedicated account manager</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>Custom branding options</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
              <span>API access</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Link href="/contact" className="w-full">
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
