
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly disable the Pages Router to resolve build errors.
  // Our application uses the App Router exclusively.
  pagesRouter: false,
};

export default nextConfig;
