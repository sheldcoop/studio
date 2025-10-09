/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-quantprep3-1759145568602.cluster-fnjdffmttjhy2qqdugh3yehhs2.cloudworkstations.dev',
    ]
  }
};

module.exports = nextConfig;
