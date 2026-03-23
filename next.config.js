/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable linting during builds to prevent hangs
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid flaky filesystem cache errors in local Windows dev environments.
      config.cache = false
    }
    return config
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'nighrizkarscnojpjigs.supabase.co' },
      // Allow testing domains used in development (add any others you need)
      { protocol: 'https', hostname: 'lala.com' },
    ],
  },
}

module.exports = nextConfig
