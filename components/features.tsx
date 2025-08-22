import {
  CuboidIcon as Cube,
  Layers,
  Share2,
  Smartphone,
  Wand2,
  Upload,
  Download,
  Palette,
  Lightbulb,
} from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Cube className="h-10 w-10 text-primary" />,
      title: "3D Model Import",
      description: "Import GLB, GLTF, and FBX models directly into your scene.",
    },
    {
      icon: <Wand2 className="h-10 w-10 text-primary" />,
      title: "No-Code Editing",
      description: "Position, rotate, and scale objects with an intuitive interface.",
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "AR Ready",
      description: "Preview and publish AR experiences that work on any device.",
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: "Asset Management",
      description: "Organize your 3D models, images, videos, and audio in one place.",
    },
    {
      icon: <Upload className="h-10 w-10 text-primary" />,
      title: "Custom Textures",
      description: "Upload and apply custom textures to your 3D models.",
    },
    {
      icon: <Download className="h-10 w-10 text-primary" />,
      title: "Multiple Export Formats",
      description: "Export your creations in GLB, GLTF, or FBX formats.",
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: "Theme Customization",
      description: "Switch between light and dark mode for comfortable editing.",
    },
    {
      icon: <Share2 className="h-10 w-10 text-primary" />,
      title: "Easy Sharing",
      description: "Share your AR experiences with a simple link.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "Responsive Design",
      description: "Create and view on any device with a responsive interface.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
