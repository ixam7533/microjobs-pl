module.exports = {
  images: { 
    domains: ['source.unsplash.com'],
    unoptimized: process.env.NODE_ENV === 'production' // Render optimalization
  },
  
  // Optymalizacje produkcyjne
  compress: true,
  poweredByHeader: false,
  
  // Dla Render.com - poprawiona składnia
  output: 'standalone',
  
  // CSS optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.default = {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
    return config
  }
}
