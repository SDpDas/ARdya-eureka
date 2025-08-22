# ARdya - AI-Powered Augmented Reality Creator

ARdya is a Next.js application that enables users to create immersive augmented reality (AR) experiences using AI-driven 3D model generation. With a user-friendly interface, users can describe 3D scenes, upload assets, and publish AR experiences accessible via QR codes on any smartphone or tablet.

## Features

- **AI-Powered Creation**: Generate 3D models from text prompts using an AI assistant.
- **Asset Management**: Upload and manage 3D models, images, videos, and audio assets.
- **AR Modes**: Supports markerless and marker-based AR experiences.
- **Real-Time Editing**: Manipulate assets with position, rotation, and scale tools in a 3D canvas.
- **Easy Sharing**: Publish AR experiences and generate QR codes for instant sharing.
- **Responsive Design**: Works across desktop and mobile devices with a modern UI.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Netlify account for deployment

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/ardya.git
   cd ardya
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open `http://localhost:3000` in your browser to view the app.

## Usage

1. **Homepage**: Enter a text prompt (e.g., "Create a red cube and blue sphere") to generate an AR scene.
2. **AR Creator**: Navigate to `/creator` to:
   - Upload 3D models (`.glb`, `.obj`, `.fbx`), images (`.png`, `.jpg`), videos (`.mp4`, `.webm`), or audio (`.mp3`, `.wav`).
   - Use the AI assistant to generate 3D scenes.
   - Adjust asset properties (position, rotation, scale) in the 3D canvas.
   - Select AR mode (markerless or marker-based).
3. **Publish**: Save and publish your AR experience to generate a shareable QR code at `/publish/:id`.
4. **Preview**: Test your AR scene in a phone preview modal.

## License

&copy; 2025 VisiARise. All rights reserved.