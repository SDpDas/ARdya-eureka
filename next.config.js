const nextConfig = {
  transpilePackages: ["three"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // ... other configurations
}

module.exports = nextConfig
