/** @type {import('next').NextConfig} */
const nextConfig = {
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
