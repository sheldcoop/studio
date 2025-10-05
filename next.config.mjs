
/** @type {import('next').NextConfig} */
import { allTopics } from './src/lib/curriculum/index.js';

const nextConfig = {
  async redirects() {
    try {
      const { createRedirects } = await import('./scripts/create-redirects.mjs');
      const redirects = await createRedirects();
      return redirects;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error("Could not find 'public/redirects.json'. Skipping redirects generation in dev mode. This is normal.");
        return [];
      }
      console.error("Error loading redirects:", error);
      return [];
    }
  },
};

export default nextConfig;
