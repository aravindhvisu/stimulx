/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Production is a static export served by server.mjs (Cloud Run) or the Cloudflare Worker.
  // In `npm run dev`, /api calls are forwarded to `npm run api` (server.mjs on port 8080).
  ...(isDev
    ? {
        async rewrites() {
          return [{ source: '/api/:path*', destination: 'http://127.0.0.1:8080/api/:path*' }];
        },
      }
    : { output: 'export' }),
};

module.exports = nextConfig;
