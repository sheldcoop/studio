/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  async redirects() {
    return [
      {
        source: '/paths/:pathSlug/:topicSlug',
        destination: '/:pathSlug/:topicSlug', // New path structure
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
