/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Your Next.js configuration options go here.
  // For example, you can add environment variables, redirects, etc.
  
  // Example of adding an environment variable:
  // env: {
  //   CUSTOM_ENV_VAR: process.env.CUSTOM_ENV_VAR,
  // },

  // Example of setting up redirects:
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-path',
  //       destination: '/new-path',
  //       permanent: true,
  //     },
  //   ];
  // },

  // By default, Next.js will handle TypeScript and Sass compilation.
  // You can customize webpack configuration if needed, but it's often not necessary.
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   // Important: return the modified config
  //   return config;
  // },

  // The `pageExtensions` option allows you to specify which file extensions
  // should be considered as pages.
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Setting this to false can be useful in some advanced scenarios,
  // but it's generally recommended to keep it enabled for React 18 features.
  reactStrictMode: true,

  // This configuration is for the Next.js App Router, which is the default in Next.js 13.4+
  // All pages and layouts should be inside the `src/app` directory.
  // Note: There is no `appDir` boolean to set here anymore. If an `app` directory exists, it is used.
  devIndicators: {
    allowedDevOrigins: [
      'http://*.cloudworkstations.dev:*',
      'https://*.cloudworkstations.dev:*',
    ]
  },
};

export default nextConfig;
