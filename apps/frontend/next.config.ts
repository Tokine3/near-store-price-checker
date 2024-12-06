/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.jancodelookup.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.jancodelookup.com',
      },
      {
        protocol: 'http',
        hostname: 'image.jancodelookup.com',
      },
    ],
  },
};

module.exports = nextConfig;