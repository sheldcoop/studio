import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to read the generated redirects
function readRedirects() {
  const redirectsPath = path.join(__dirname, 'public', 'redirects.json');
  if (fs.existsSync(redirectsPath)) {
    const redirectsData = fs.readFileSync(redirectsPath, 'utf-8');
    return JSON.parse(redirectsData);
  }
  return [];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce lowercase URLs and remove trailing slashes for canonical SEO.
  async redirects() {
    const manualRedirects = readRedirects();
    return [
      ...manualRedirects,
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
};

export default nextConfig;
