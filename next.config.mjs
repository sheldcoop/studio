
import { readFile } from 'fs/promises';
import { join } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    const redirectsFile = join(process.cwd(), 'public', 'redirects.json');
    try {
      const redirectsJson = await readFile(redirectsFile, 'utf-8');
      const baseRedirects = JSON.parse(redirectsJson);
      
      return [
        ...baseRedirects,
        // Add other static redirects here if needed in the future
      ];

    } catch (error) {
      // If the file doesn't exist, return an empty array.
      // This is important for the first run or in environments where the build script hasn't run.
      if (error.code === 'ENOENT') {
        console.warn("Could not find 'public/redirects.json'. Skipping redirects generation.");
        return [];
      }
      // For other errors, re-throw to fail the build, as it's an unexpected issue.
      throw error;
    }
  },
};

export default nextConfig;
