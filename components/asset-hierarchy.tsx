"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, ChevronDown, CuboidIcon as Cube, ImageIcon, Video, Music, Edit, Trash2 } from "lucide-react"
import type { Asset, AssetType } from "@/components/ar-creator"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AssetHierarchyProps {
  assets: Asset[]
  selectedAsset: Asset | null
  onSelect: (asset: Asset) => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
}

export function AssetHierarchy({ assets, selectedAsset, onSelect, onDelete, onRename }: AssetHierarchyProps) {
  const [expanded, setExpanded] = useState<Record<AssetType, boolean>>({
    model: true,
    image: true,
    video: true,
    audio: true,
  })

  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assetToRename, setAssetToRename] = useState<Asset | null>(null)
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null)
  const [newName, setNewName] = useState("")

  const toggleExpand = (type: AssetType) => {
    setExpanded({ ...expanded, [type]: !expanded[type] })
  }

  const handleRenameClick = (asset: Asset) => {
    setAssetToRename(asset)
    setNewName(asset.name)
    setRenameDialogOpen(true)
  }

  const handleDeleteClick = (asset: Asset) => {
    setAssetToDelete(asset)
    setDeleteDialogOpen(true)
  }

  const confirmRename = () => {
    if (assetToRename && newName.trim()) {
      onRename(assetToRename.id, newName.trim())
      setRenameDialogOpen(false)
    }
  }

  const confirmDelete = () => {
    if (assetToDelete) {
      onDelete(assetToDelete.id)
      setDeleteDialogOpen(false)
    }
  }

  // Group assets by type
  const modelAssets = assets.filter((asset) => asset.type === "model")
  const imageAssets = assets.filter((asset) => asset.type === "image")
  const videoAssets = assets.filter((asset) => asset.type === "video")
  const audioAssets = assets.filter((asset) => asset.type === "audio")

  const renderAssetGroup = (title: string, type: AssetType, groupAssets: Asset[], icon: React.ReactNode) => (
    <div className="mb-2">
      <div
        className="flex items-center p-1 cursor-pointer hover:bg-accent rounded-md transition-colors"
        onClick={() => toggleExpand(type)}
      >
        {expanded[type] ? (
          <ChevronDown className="h-4 w-4 mr-1 text-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-1 text-foreground" />
        )}
        <div className="text-foreground">{icon}</div>
        <span className="ml-1 text-sm font-medium text-foreground">
          {title} ({groupAssets.length})
        </span>
      </div>

      {expanded[type] && (
        <div className="pl-6">
          {groupAssets.map((asset) => (
            <div
              key={asset.id}
              className={`group flex items-center p-1 text-xs cursor-pointer hover:bg-accent rounded-md transition-colors ${
                selectedAsset?.id === asset.id ? "bg-accent" : ""
              }`}
              onClick={() => onSelect(asset)}
            >
              <span className="truncate flex-1 text-foreground">{asset.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="icon-btn-hover h-6 w-6 ml-1 opacity-0 group-hover:opacity-100 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRenameClick(asset)
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="icon-btn-hover h-6 w-6 ml-1 opacity-0 group-hover:opacity-100 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteClick(asset)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="p-2 silver-aura">
      <h3 className="font-semibold mb-2 text-sm text-foreground glow-text">Asset Hierarchy</h3>

      {renderAssetGroup("3D Models", "model", modelAssets, <Cube className="h-4 w-4" />)}
      {renderAssetGroup("Images", "image", imageAssets, <ImageIcon className="h-4 w-4" />)}
      {renderAssetGroup("Videos", "video", videoAssets, <Video className="h-4 w-4" />)}
      {renderAssetGroup("Audio", "audio", audioAssets, <Music className="h-4 w-4" />)}

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="glass-effect">
          <DialogHeader>
            <DialogTitle className="text-foreground">Rename Asset</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
            className="my-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)} className="btn-outline-hover-fix">
              Cancel
            </Button>
            <Button onClick={confirmRename} className="btn-hover-fix">
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass-effect">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete {assetToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-outline-hover-fix">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="btn-hover-fix">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
