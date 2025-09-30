
import { MetadataRoute } from 'next';
import { allTopics } from '@/lib/curriculum';
import { learningPaths } from '@/lib/learning-paths';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantfinancelab.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: `${URL}/`, lastModified: new Date() },
    { url: `${URL}/paths`, lastModified: new Date() },
    { url: `${URL}/interview-prep`, lastModified: new Date() },
    { url: `${URL}/community`, lastModified: new Date() },
    { url: `${URL}/stat-toolkit`, lastModified: new Date() },
    { url: `${URL}/hypothesis-testing`, lastModified: new Date() },
  ];

  // Create routes for the learning path pages
  const pathRoutes = learningPaths.map((path) => ({
    url: `${URL}/paths/${path.id}`,
    lastModified: new Date(),
  }));

  // Create routes for individual topic pages, filtering out only non-visitable placeholder topics.
  const topicRoutes = allTopics
    .filter(topic => {
        // A topic is NOT a real page if it's just an organizational category or has no valid link.
        const isCategory = topic.category === 'parent';
        const hasNoPage = topic.href === '#';
        
        return !isCategory && !hasNoPage;
    })
    .map((topic) => ({
      url: `${URL}${topic.href}`,
      lastModified: new Date(),
  }));

  return [...staticRoutes, ...pathRoutes, ...topicRoutes];
}
