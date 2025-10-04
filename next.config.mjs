// @ts-check

/**
 * Run `npm run analyze` to see what's inside your bundle.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  transpilePackages: ['three'],
  experimental: {
    ppr: 'incremental',
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
