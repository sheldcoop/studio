import { allTopics } from './src/lib/curriculum/index.js';

/**
 * @returns {import('next').NextConfig}
 */
function nextConfig() {
  const config = {
    // Enforce a single canonical URL format by removing trailing slashes.
    // This is crucial for preventing duplicate content issues with search engines.
    trailingSlash: false,

    // Programmatically generate permanent (301) redirects for any slugs that
    // have been changed. This preserves SEO value and prevents broken links.
    async redirects() {
      const redirects = [];

      for (const topic of allTopics) {
        if (topic.previousSlugs && topic.previousSlugs.length > 0) {
          for (const oldSlug of topic.previousSlugs) {
            // Determine the correct source path based on the old prefix.
            // This logic is based on the migration analysis.
            let sourcePath;
            if (oldSlug.includes('deep-dive') || oldSlug.includes('itos-lemma')) {
              sourcePath = `/topics/${oldSlug}`;
            } else {
              // Fallback for any other potential previous slugs
              sourcePath = `/${topic.pathPrefix || 'topics'}/${oldSlug}`;
            }
            
            redirects.push({
              source: sourcePath,
              destination: topic.href,
              permanent: true,
            });
          }
        }
      }

      return redirects;
    },
  };

  return config;
}

export default nextConfig;
