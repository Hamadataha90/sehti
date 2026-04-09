import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-29723604-2506-4a02-b075-a0db14a0f6bf.space.z.ai",
  ],
  
  // Image optimization for SEO
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression for better performance (factor in SEO)
  compress: true,

  // Base path configuration
  basePath: '',

  // Add trailing slashes for SEO consistency
  trailingSlash: false,

  // Generate ETag for better caching
  generateEtags: true,

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
    ],
  },

  async headers() {
    return [
      // Security headers that also help with SEO
      {
        source: '/(.*)',
        headers: [
          // Security
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          
          // SEO/Performance
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },

      // Image optimization headers
      {
        source: '/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },

      // Static assets caching
      {
        source: '/(.*)\\.(js|css|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      // HTML caching (shorter TTL for freshness)
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },

      // API routes caching
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300', // 5 minutes
          },
          {
            key: 'Content-Type',
            value: 'application/json; charset=utf-8',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Old URLs to new URLs (301 redirects for SEO)
      // Example:
      // {
      //   source: '/old-article',
      //   destination: '/article/new-slug',
      //   permanent: true,
      // },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        // Rewrites before Next.js processing
      ],
      afterFiles: [
        // Rewrites after Next.js processing
      ],
    };
  },
};

export default nextConfig;
