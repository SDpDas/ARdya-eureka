"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash, Eye, LogOut, Bot } from "lucide-react"
import { getUserProjects, deleteProject, type Project } from "@/lib/firebase"
import { ThemeToggle } from "@/components/theme-toggle"
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

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  useEffect(() => {
    const loadProjects = async () => {
      const userJson = localStorage.getItem("user")
      if (!userJson) {
        router.push("/login")
        return
      }

      const userData = JSON.parse(userJson)
      setUser(userData)

      try {
        const userProjects = await getUserProjects(userData.id)
        setProjects(userProjects)
      } catch (error) {
        console.error("Error loading projects:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteProject = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete)
        setProjects(projects.filter((project) => project.id !== projectToDelete))
      } catch (error) {
        console.error("Error deleting project:", error)
      }
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  const formatDate = (date: any) => {
    try {
      // Handle Firebase Timestamp objects
      if (date && typeof date.toDate === "function") {
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(date.toDate())
      }

      // Handle regular Date objects or timestamp numbers
      if (date) {
        const dateObj = new Date(date)
        if (!isNaN(dateObj.getTime())) {
          return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(dateObj)
        }
      }

      // Fallback for invalid dates
      return "Unknown"
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Unknown"
    }
  }

  const handleNewProject = () => {
    router.push("/llm")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background geometric-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background geometric-bg">
      <header className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-foreground glow-text">
              <span className="text-2xl">AR</span>
              <span className="text-lg font-light">dya</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-foreground">{user.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground glow-text">My Projects</h1>
            <p className="text-muted-foreground mt-1">Create and manage your AR experiences</p>
          </div>
          <Button
            onClick={handleNewProject}
            className="bg-foreground text-background font-semibold hover:bg-foreground/90 glow-border"
          >
            <Bot className="h-4 w-4 mr-2" />
            New Project with AI
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="glass-effect glow-border p-12 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
              <Bot className="h-8 w-8 text-accent-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">No projects yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start creating amazing AR experiences with our AI assistant. Just describe what you want to build!
            </p>
            <Button
              onClick={handleNewProject}
              className="bg-foreground text-background font-semibold hover:bg-foreground/90 glow-border"
            >
              <Bot className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="glass-effect glow-border hover:bg-accent/50 transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden bg-accent rounded-t-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent-foreground/50">
                      <span className="text-3xl">AR</span>
                      <span className="text-xl font-light">dya</span>
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-foreground">{project.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border-border">
                        <DropdownMenuItem
                          onClick={() => router.push(`/creator?project=${project.id}`)}
                          className="text-foreground hover:bg-accent"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/publish/${project.id}`)}
                          className="text-foreground hover:bg-accent"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive hover:bg-destructive/10 focus:text-destructive"
                          onClick={() => handleDeleteProject(project.id!)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between text-xs text-muted-foreground">
                  <span>Created: {formatDate(project.createdAt)}</span>
                  <span>Updated: {formatDate(project.updatedAt)}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the project and all associated assets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-accent">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProject}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
