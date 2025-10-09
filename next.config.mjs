/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  
  experimental: {
    allowedDevOrigins: [
      '6000-firebase-quantprep3-1759145568602.cluster-fnjdffmttjhy2qqdugh3yehhs2.cloudworkstations.dev',
      'https://6000-firebase-quantprep3-1759145568602.cluster-fnjdffmttjhy2qqdugh3yehhs2.cloudworkstations.dev'
    ]
  }
};

export default nextConfig;
