/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-1f84968d1d214b14ac81214cab1c64ee.r2.dev',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
