import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false, // 🔧 Отключаем Strict Mode для production-like behavior
  turbopack: {},
  
  // Увеличиваем лимит для загрузки изображений (по умолчанию 1MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Увеличиваем до 10MB для загрузки изображений
    },
  },
  
  // 🔀 Redirects for legacy routes
  async redirects() {
    return [
      // Customer routes (legacy /customer/* → actual paths)
      {
        source: '/customer/profile',
        destination: '/profile',
        permanent: true,
      },
      {
        source: '/customer/profile/settings',
        destination: '/profile/settings',
        permanent: true,
      },
      {
        source: '/customer/marketplace',
        destination: '/marketplace',
        permanent: true,
      },
      {
        source: '/customer/orders',
        destination: '/orders',
        permanent: true,
      },
      // No redirects needed - using original paths
      // /admin/catalog/* stays as is
      // /fridge stays as is
      // /recipes stays as is
      // /assistant stays as is
      // /losses stays as is
      // Only /admin/ingredients is new
    ];
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
})(nextConfig);
