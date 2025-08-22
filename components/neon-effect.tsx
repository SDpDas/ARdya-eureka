"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function NeonEffect({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useThree()

  useEffect(() => {
    if (groupRef.current) {
      const outlineMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0x00ffff) },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
            gl_FragColor = vec4(color, 1.0) * intensity;
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      })

      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const outlineMesh = new THREE.Mesh(child.geometry, outlineMaterial)
          outlineMesh.scale.multiplyScalar(1.05)
          scene.add(outlineMesh)
        }
      })
    }
  }, [scene])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return <group ref={groupRef}>{children}</group>
}
