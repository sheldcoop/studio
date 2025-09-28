import { MetadataRoute } from 'next'

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantfinancelab.com';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${URL}/sitemap.xml`,
  }
}
