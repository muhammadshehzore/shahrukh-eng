/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*', // API routes
      },
      {
        source: '/media/:path*',
        destination: 'http://127.0.0.1:8000/media/:path*', // Media files
      },
      // DO NOT rewrite /ws/* paths — HMR and Channels WS stay separate
    ];
  },
};

export default nextConfig;
