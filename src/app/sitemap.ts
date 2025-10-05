
import { MetadataRoute } from 'next';
import { allTopics } from '@/lib/curriculum';
import { learningPaths } from '@/lib/learning-paths';

const URL = process.env.SITE_URL || 'https://quantprep.firerun.app';

export default function sitemap(): MetadataRoute.Sitemap {
  // Higher priority for main navigation and path pages
  const primaryPages: MetadataRoute.Sitemap = [
    { url: `${URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${URL}/paths`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${URL}/topics`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${URL}/community`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${URL}/interview-prep`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Learning path landing pages
  const pathRoutes: MetadataRoute.Sitemap = learningPaths.map((path) => ({
    url: `${URL}/paths/${path.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Individual topic pages
  const topicRoutes: MetadataRoute.Sitemap = allTopics
    .filter(topic => !topic.category.includes('parent') && topic.href !== '#') // Filter out non-visitable parent categories
    .map((topic) => ({
      url: `${URL}${topic.href}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
  }));
  
  return [
      ...primaryPages,
      ...pathRoutes,
      ...topicRoutes
  ];
}
