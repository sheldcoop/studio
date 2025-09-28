import { MetadataRoute } from 'next'

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${URL}/sitemap.xml`,
  }
}
