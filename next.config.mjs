
import { allTopics } from './src/lib/curriculum/index.ts';

/**
 * @param {string[]} slugs - An array of previous slugs.
 * @param {string} destination - The new canonical path.
 * @returns {import('next').Redirect[]} An array of redirect objects.
 */
function createRedirects(slugs, destination) {
  return slugs.map(slug => ({
    source: `/topics/${slug}`,
    destination: destination,
    permanent: true,
  }));
}

// Generate all redirects from the curriculum data
const allRedirects = allTopics.flatMap(topic => {
    if (topic.previousSlugs && topic.previousSlugs.length > 0) {
        return createRedirects(topic.previousSlugs, topic.href);
    }
    return [];
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce lowercase URLs and handle trailing slashes.
  async redirects() {
    return [
      // Add the programmatically generated redirects for old slugs
      ...allRedirects,
      // Rule to remove trailing slashes
      {
        source: '/:path*/',
        permanent: true,
        destination: '/:path*',
      },
    ];
  },
  // Adding experimental flag to suppress warning about unsupported `edge-runtime-webpack`
  experimental: {
    serverComponentsExternalPackages: ['@vercel/analytics'],
  },
};

export default nextConfig;
