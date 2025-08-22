interface AIResponse {
  text: string
  sceneData?: {
    objects: Array<{
      type: "primitive" | "model"
      shape?: "box" | "sphere" | "cylinder" | "plane"
      position: [number, number, number]
      rotation: [number, number, number]
      scale: [number, number, number]
      color?: string
      material?: string
      url?: string
      name: string
    }>
    lighting?: {
      ambient: number
      directional: {
        intensity: number
        position: [number, number, number]
      }
    }
    environment?: {
      background?: string
      fog?: boolean
    }
  }
}

export class AIService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NVIDIA_API_KEY || ""
    this.baseUrl = "https://integrate.api.nvidia.com/v1"
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-4-340b-instruct",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant specialized in creating 3D scenes and AR experiences. When users describe a scene, you should:

1. Provide a helpful text response
2. Generate scene data in JSON format for 3D objects

For scene generation, use this structure:
{
  "objects": [
    {
      "type": "primitive" | "model",
      "shape": "box" | "sphere" | "cylinder" | "plane" (for primitives),
      "position": [x, y, z],
      "rotation": [x, y, z],
      "scale": [x, y, z],
      "color": "#hexcolor",
      "material": "standard" | "basic" | "phong",
      "url": "model_url" (for models),
      "name": "object_name"
    }
  ],
  "lighting": {
    "ambient": 0.5,
    "directional": {
      "intensity": 1,
      "position": [10, 10, 5]
    }
  },
  "environment": {
    "background": "#hexcolor",
    "fog": true/false
  }
}

Examples:
- "Create a red cube" -> red box primitive at origin
- "Make a floating island scene" -> multiple objects arranged as an island
- "Space scene with planets" -> spheres with space-like positioning
- "Living room setup" -> furniture-like arrangements

Always respond with both helpful text AND scene data when appropriate.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      const aiText = data.choices[0]?.message?.content || "I couldn't process that request."

      // Try to extract scene data from the response
      let sceneData = null
      try {
        // Look for JSON in the response
        const jsonMatch = aiText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          sceneData = JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        // If no valid JSON found, generate basic scene based on keywords
        sceneData = this.generateBasicScene(prompt)
      }

      return {
        text: aiText.replace(/\{[\s\S]*\}/, "").trim(), // Remove JSON from text
        sceneData,
      }
    } catch (error) {
      console.error("AI Service Error:", error)

      // Fallback to local scene generation
      return {
        text: "I'll create a scene based on your description using my built-in capabilities.",
        sceneData: this.generateBasicScene(prompt),
      }
    }
  }

  private generateBasicScene(prompt: string): any {
    const lowerPrompt = prompt.toLowerCase()
    const objects = []

    // Basic keyword-based scene generation
    if (lowerPrompt.includes("cube") || lowerPrompt.includes("box")) {
      objects.push({
        type: "primitive",
        shape: "box",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: lowerPrompt.includes("red")
          ? "#ff0000"
          : lowerPrompt.includes("blue")
            ? "#0000ff"
            : lowerPrompt.includes("green")
              ? "#00ff00"
              : "#888888",
        material: "standard",
        name: "Generated Cube",
      })
    }

    if (lowerPrompt.includes("sphere") || lowerPrompt.includes("ball") || lowerPrompt.includes("planet")) {
      objects.push({
        type: "primitive",
        shape: "sphere",
        position: [2, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: lowerPrompt.includes("red")
          ? "#ff0000"
          : lowerPrompt.includes("blue")
            ? "#0000ff"
            : lowerPrompt.includes("green")
              ? "#00ff00"
              : "#ffaa00",
        material: "standard",
        name: "Generated Sphere",
      })
    }

    if (lowerPrompt.includes("cylinder") || lowerPrompt.includes("pillar")) {
      objects.push({
        type: "primitive",
        shape: "cylinder",
        position: [-2, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 2, 1],
        color: "#00aaff",
        material: "standard",
        name: "Generated Cylinder",
      })
    }

    if (lowerPrompt.includes("plane") || lowerPrompt.includes("ground") || lowerPrompt.includes("floor")) {
      objects.push({
        type: "primitive",
        shape: "plane",
        position: [0, -1, 0],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [5, 5, 1],
        color: "#228B22",
        material: "standard",
        name: "Ground Plane",
      })
    }

    // If no specific objects mentioned, create a default scene
    if (objects.length === 0) {
      objects.push({
        type: "primitive",
        shape: "box",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: "#ff6b6b",
        material: "standard",
        name: "Default Object",
      })
    }

    return {
      objects,
      lighting: {
        ambient: 0.5,
        directional: {
          intensity: 1,
          position: [10, 10, 5],
        },
      },
      environment: {
        background: lowerPrompt.includes("space") ? "#000011" : lowerPrompt.includes("sky") ? "#87CEEB" : "#f0f0f0",
        fog: false,
      },
    }
  }
}

export const aiService = new AIService()
