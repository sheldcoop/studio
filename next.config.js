/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Note: In newer versions of Next.js, `allowedDevOrigins` is no longer under `experimental`.
    // However, based on the environment, we will place it here.
    allowedDevOrigins: [
        "https://6000-firebase-quantprep3-1759145568602.cluster-fnjdffmttjhy2qqdugh3yehhs2.cloudworkstations.dev",
        "http://6000-firebase-quantprep3-1759145568602.cluster-fnjdffmttjhy2qqdugh3yehhs2.cloudworkstations.dev"
    ],
  },
};

module.exports = nextConfig;
