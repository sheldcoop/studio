import { createRedirects } from './scripts/create-redirects.mjs';
import { VercelAnalytics } from '@vercel/analytics/react';
import fs from 'fs';
import path from 'path';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // Function to asynchronously generate redirects
  redirects: async () => {
    // We must manually run the script here to ensure redirects.json exists
    // before Next.js tries to read it.
    await createRedirects();

    const redirectsPath = path.join(process.cwd(), 'public', 'redirects.json');
    
    // Check if the file exists. If not (e.g., in some dev environments before first build),
    // return an empty array to prevent errors.
    if (fs.existsSync(redirectsPath)) {
      try {
        const redirectsJson = fs.readFileSync(redirectsPath, 'utf-8');
        const redirects = JSON.parse(redirectsJson);
        return redirects;
      } catch (error) {
        console.error('Error reading or parsing redirects.json:', error);
        return [];
      }
    } else {
      console.warn("Could not find 'public/redirects.json'. Skipping redirects generation for this build.");
      return [];
    }
  },
  // Add other Next.js configurations here
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },
};

export default nextConfig;
