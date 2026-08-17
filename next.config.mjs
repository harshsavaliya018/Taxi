/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  webpack: (config) => {
    // Silence critical dependency warnings from some WalletConnect sub-packages
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
      encoding: false,
    };
    return config;
  },
};

export default nextConfig;
