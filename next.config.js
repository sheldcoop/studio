/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests from Cloud Workstation
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGIN
    ? [process.env.ALLOWED_DEV_ORIGIN]
    : [],

  webpack: (config) => {
    config.module.rules.push({
      test: /\.py$/,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;
