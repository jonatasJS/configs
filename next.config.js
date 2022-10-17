/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'pa1.narvii.com', 'cover.ilovemusic.team'],
  },
}

module.exports = nextConfig
