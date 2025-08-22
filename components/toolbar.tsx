"use client"

import { MousePointer, Move, RotateCw, Maximize, Trash2, Undo, Redo } from "lucide-react"
import type { ToolType } from "@/components/ar-creator"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface ToolbarProps {
  activeTool: ToolType
  setActiveTool: (tool: ToolType) => void
  onUndo: () => void
  onRedo: () => void
}

export function Toolbar({ activeTool, setActiveTool, onUndo, onRedo }: ToolbarProps) {
  const tools = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "position", icon: Move, label: "Position" },
    { id: "rotate", icon: RotateCw, label: "Rotate" },
    { id: "scale", icon: Maximize, label: "Scale" },
    { id: "delete", icon: Trash2, label: "Delete All" }, // Updated label to clarify it deletes all
  ]

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-1 flex-wrap">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === tool.id ? "default" : "outline"}
                size="icon"
                onClick={() => setActiveTool(tool.id as ToolType)}
                className="h-8 w-8 mb-1"
              >
                <tool.icon className="h-4 w-4" />
                <span className="sr-only">{tool.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <Separator orientation="vertical" className="h-8 mx-2 hidden sm:block" />
        <Separator orientation="horizontal" className="w-full h-px my-1 sm:hidden" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onUndo} className="h-8 w-8 mb-1">
              <Undo className="h-4 w-4" />
              <span className="sr-only">Undo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onRedo} className="h-8 w-8 mb-1">
              <Redo className="h-4 w-4" />
              <span className="sr-only">Redo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
