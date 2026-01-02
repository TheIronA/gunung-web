/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ocun.com',
        pathname: '/assets/products/**',
      },
    ],
  },
};

module.exports = nextConfig;
