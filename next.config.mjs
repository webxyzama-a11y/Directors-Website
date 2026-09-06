/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents double Three.js WebGL canvas context initializations
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
