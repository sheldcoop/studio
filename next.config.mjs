
import { allTopics } from './src/lib/curriculum/index.js';
import { learningPaths } from './src/lib/learning-paths.js';
import fs from 'fs';
import path from 'path';

/**
 * Creates a JSON file containing all topic and path slugs.
 * This is used by the create-redirects script to detect slug changes.
 */
function createKnownSlugs() {
  const slugs = {
    topics: allTopics.map(t => ({ id: t.id, href: t.href })),
    paths: learningPaths.map(p => ({ id: p.id, href: `/paths/${p.id}` })),
  };
  fs.writeFileSync(path.join(process.cwd(), '.known-slugs.json'), JSON.stringify(slugs, null, 2));
}

// Run the function to generate the slugs file.
createKnownSlugs();

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // reactStrictMode: true,
  async redirects() {
    const redirectsPath = path.join(process.cwd(), 'public', 'redirects.json');
    try {
      // Check if the file exists before trying to read it.
      // This prevents errors in development when the file hasn't been generated yet.
      if (fs.existsSync(redirectsPath)) {
        const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf-8'));
        return redirects;
      }
    } catch (error) {
      // If there's an error reading the file (e.g., it's malformed), log it and continue.
      console.error("Could not read 'public/redirects.json'. Skipping redirects generation.", error);
    }
    // If the file doesn't exist or there was an error, return an empty array.
    return [];
  },
};

export default nextConfig;
