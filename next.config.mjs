import { createMDX } from 'fumadocs-mdx/next';
const withMDX = createMDX();

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
const NEXT_PUBLIC_BASE_URL = isProduction
  ? "https://embedded-cr.vercel.app"
  : isDevelopment
    ? "http://localhost:3000"
    : "https://embedded-cr.vercel.app";


/** @type {import('next').NextConfig} */
const config = {

  reactStrictMode: false,
  typescript: { tsconfigPath: "./tsconfig.json" },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  env: {
    NEXT_PUBLIC_BASE_URL: NEXT_PUBLIC_BASE_URL
  },
  experimental: {
    dynamicIO: true
  }
};

config.headers = isDevelopment ? (async () => {
  return [
    {
      source: "/public/",
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate', // Prevent caching
        },
      ]
    }
  ]
}) : undefined
console.log(isDevelopment, config.headers)
export default withMDX(config);
