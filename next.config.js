/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
    remotePatterns: [],
  },

  // ─── Bundle Optimization ────────────────────────────────
  // Tree-shake heavy icon/component libraries so only used exports are bundled.
  experimental: {
    optimizePackageImports: [
      '@tabler/icons-react',
      'lucide-react',
      '@radix-ui/react-icons',
      '@phosphor-icons/react',
      'react-nfl-logos',
      'react-mlb-logos',
      'react-nhl-logos',
      'date-fns',
      'lodash',
      'framer-motion',
      '@number-flow/react',
      'country-flag-icons',
    ],
  },

  // ─── Compiler Optimizations ─────────────────────────────
  compiler: {
    // Strip console.log in production builds (keep errors/warnings)
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // Remove X-Powered-By header
  poweredByHeader: false,
}

module.exports = nextConfig
