/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add rule to handle .py files as text using Webpack 5's built-in asset modules
    config.module.rules.push({
      test: /\.py$/,
      type: 'asset/source',
    });

    return config;
  },
};

module.exports = nextConfig;
