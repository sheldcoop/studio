
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    instrumentationHook: false,
    allowedDevOrigins: ["https://6000-firebase-quantpreptheory-2-1760335537174.cluster-fnjdffmttjhy2qqdugh3yehhs2.cloudworkstations.dev"],
  },
};

export default nextConfig;
