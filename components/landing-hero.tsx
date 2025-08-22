"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import * as THREE from "three"

export default function LandingHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create floating spheres
    const spheres: THREE.Mesh[] = []
    const colors = [
      0x4285f4, // Google Blue
      0xea4335, // Google Red
      0xfbbc05, // Google Yellow
      0x34a853, // Google Green
      0x9c27b0, // Purple
      0x00bcd4, // Cyan
      0xff9800, // Orange
    ]

    for (let i = 0; i < 15; i++) {
      const geometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.1, 32, 32)
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.7,
      })

      const sphere = new THREE.Mesh(geometry, material)

      // Random position
      sphere.position.x = (Math.random() - 0.5) * 10
      sphere.position.y = (Math.random() - 0.5) * 10
      sphere.position.z = (Math.random() - 0.5) * 10

      // Store velocity for animation
      const velocity = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
      }

      // @ts-ignore - Adding custom property
      sphere.userData.velocity = velocity

      scene.add(sphere)
      spheres.push(sphere)
    }

    // Position camera
    camera.position.z = 5

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Animate spheres
      spheres.forEach((sphere) => {
        const velocity = sphere.userData.velocity

        sphere.position.x += velocity.x
        sphere.position.y += velocity.y
        sphere.position.z += velocity.z

        // Bounce off invisible boundaries
        if (Math.abs(sphere.position.x) > 5) {
          sphere.userData.velocity.x *= -1
        }

        if (Math.abs(sphere.position.y) > 5) {
          sphere.userData.velocity.y *= -1
        }

        if (Math.abs(sphere.position.z) > 5) {
          sphere.userData.velocity.z *= -1
        }

        // Rotate sphere
        sphere.rotation.x += 0.005
        sphere.rotation.y += 0.005
      })

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      spheres.forEach((sphere) => {
        sphere.geometry.dispose()
        ;(sphere.material as THREE.Material).dispose()
      })
    }
  }, [])

  return (
    <section className="relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

      <div className="container relative z-10 py-24 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          VisiARise Web Studio
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl">
          Create, customize, and publish interactive 3D and AR experiences directly in your browser. No coding required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/creator">
            <Button size="lg" className="text-lg px-8">
              Try Demo
            </Button>
          </Link>
          <Link href="#pricing">
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
