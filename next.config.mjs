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
  reactStrictMode: true,
  typescript: {tsconfigPath: "./tsconfig.json"},

  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  env: {
    NEXT_PUBLIC_BASE_URL: NEXT_PUBLIC_BASE_URL
  },
  experimental: {
    dynamicIO: true
  }
};

export default withMDX(config);
