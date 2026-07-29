import type { NextConfig } from "next";

// Static export (output: 'export') is required for GitHub Pages, which cannot
// run the /api/search serverless route. Vercel builds the full app (with the
// semantic-search API) unless STATIC_EXPORT is explicitly set. The GitHub
// Actions workflow sets STATIC_EXPORT=1 before building for Pages.
const isStaticExport = process.env.STATIC_EXPORT === '1';

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
