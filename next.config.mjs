import withBundleAnalyzerPkg from '@next/bundle-analyzer';

const withBundleAnalyzer = withBundleAnalyzerPkg({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================
  // Core Next.js 16 Configuration
  // ============================================
  
  // Turbopack for ultra-fast builds
  turbo: {
    rules: {
      '*.mdx': ['mdx-loader'],
    },
  },
  
  // Page extensions for MDX support
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  
  // ============================================
  // Image Optimization Configuration
  // ============================================
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.nvidia.com',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nvidia.com',
        pathname: '/content/**',
      },
      {
        protocol: 'https',
        hostname: 'www.amd.com',
        pathname: '/system/files/**',
      },
      {
        protocol: 'https',
        hostname: 'www.intel.com',
        pathname: '/content/**',
      },
      {
        protocol: 'https',
        hostname: 'dlcdnwebimgs.asus.com',
      },
      {
        protocol: 'https',
        hostname: 'storage-asset.msi.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gigabyte.com',
      },
      {
        protocol: 'https',
        hostname: 'www.supermicro.com',
      },
      {
        protocol: 'https',
        hostname: 'cwsmkt.corsair.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gskill.com',
      },
      {
        protocol: 'https',
        hostname: 'www.kingston.com',
      },
      {
        protocol: 'https',
        hostname: 'www.crucial.com',
      },
      {
        protocol: 'https',
        hostname: 'images.samsung.com',
      },
      {
        protocol: 'https',
        hostname: 'noctua.at',
      },
      {
        protocol: 'https',
        hostname: 'www.arctic.de',
      },
      {
        protocol: 'https',
        hostname: 'www.teamgroupinc.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // ============================================
  // Compression & Performance
  // ============================================
  
  compress: true,
  productionBrowserSourceMaps: false,
  
  optimizePackageImports: [
    'lucide-react',
    '@radix-ui/react-icons',
    'recharts',
    'framer-motion',
  ],
  
  experimental: {
    mdxRs: true,
    optimizeCss: true,
    turbo: {
      treeShaking: true,
    },
    ppr: 'incremental',
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // ============================================
  // Caching & Headers
  // ============================================
  
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  
  // ============================================
  // Redirects
  // ============================================
  
  async redirects() {
    return [
      {
        source: '/blog/post/:slug',
        destination: '/blog/:slug/',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.theaiforge.ai',
          },
        ],
        destination: 'https://theaiforge.ai/:path*',
        permanent: true,
      },
    ];
  },
  
  // ============================================
  // Custom Headers
  // ============================================
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
  
  // ============================================
  // Webpack Configuration
  // ============================================
  
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.test\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    });
    
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    
    return config;
  },
  
  // ============================================
  // Logging & Build Settings
  // ============================================
  
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// Bundle analyzer configuration
const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

export default withBundleAnalyzerConfig(nextConfig);
