/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly disable the Pages Router to resolve build errors.
  // Our application uses the App Router exclusively.
  pagesRouter: false,
  webpack: (config) => {
    // Add rule to handle .py files
    config.module.rules.push({
      test: /\.py$/,
      type: 'asset/source',
    });

    return config;
  },
};

module.exports = nextConfig;
