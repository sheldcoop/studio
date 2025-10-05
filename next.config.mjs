
import { existsSync, readFileSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config here...
  async redirects() {
    const redirectsPath = './public/redirects.json';
    if (existsSync(redirectsPath)) {
      try {
        const redirectsJson = readFileSync(redirectsPath, 'utf-8');
        const redirects = JSON.parse(redirectsJson);
        return redirects;
      } catch (err) {
        console.error("Error reading or parsing redirects.json:", err);
        return [];
      }
    } else {
      console.warn("Could not find 'public/redirects.json'. Skipping redirects generation in dev mode. This is normal.");
      return [];
    }
  },
};

export default nextConfig;
