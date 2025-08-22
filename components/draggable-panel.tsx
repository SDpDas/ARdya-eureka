"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { GripVertical, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DraggablePanelProps {
  children: React.ReactNode
  title: string
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
  className?: string
}

export function DraggablePanel({
  children,
  title,
  defaultPosition = { x: 50, y: 50 },
  defaultSize = { width: 400, height: 300 },
  className = "",
}: DraggablePanelProps) {
  const [position, setPosition] = useState(defaultPosition)
  const [size, setSize] = useState(defaultSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <div
      ref={panelRef}
      className={`fixed z-50 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-xl ${className}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? "auto" : size.height,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-border cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-6 w-6 p-0">
          {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
        </Button>
      </div>

      {/* Content */}
      {!isMinimized && <div className="p-4 overflow-auto">{children}</div>}
    </div>
  )
}
