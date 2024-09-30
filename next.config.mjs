/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.facebook.com'], // Add any external domains if needed
    formats: ['image/avif', 'image/webp'], // If you want to support specific image formats
  },
};

export default nextConfig;
