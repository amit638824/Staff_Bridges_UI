/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },

  // FIX: Remove trailingSlash (it forces txt files)
  trailingSlash: false,

  // FIX: Stop Next.js from generating extra txt files
  outputFileTracing: false,
  outputFileTracingRoot: undefined,
  outputFileTracingIncludes: { '*': [] },
};

module.exports = nextConfig;
