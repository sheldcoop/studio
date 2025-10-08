
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly disable the Pages Router to resolve build errors.
  // Our application uses the App Router exclusively.
  pagesRouter: false,
  experimental: {
    // This allows the Next.js dev server to accept requests from the
    // Firebase Studio environment.
    allowedDevOrigins: [
        "*.cloudworkstations.dev",
        "*.firebase.app"
    ],
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle .py files
    config.module.rules.push({
      test: /\.py$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
