/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "picsum.photos",
        hostname: "cdn.hashnode.com",
      },
    ],
  },
};

module.exports = nextConfig;
