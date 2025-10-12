/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is required to allow the Next.js dev server to accept requests from the
    // Firebase Studio environment.
    allowedDevOrigins: ["https://*.cloudworkstations.dev"],
  },
};

export default nextConfig;
