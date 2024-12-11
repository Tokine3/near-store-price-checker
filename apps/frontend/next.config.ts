/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.jancodelookup.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.jancodelookup.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },
};

module.exports = nextConfig;