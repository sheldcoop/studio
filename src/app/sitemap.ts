
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
    { url: `${URL}/topics`, lastModified: new Date() },
  ];

  // Create routes for the learning path pages
  const pathRoutes = learningPaths.map((path) => ({
    url: `${URL}/paths/${path.id}`,
    lastModified: new Date(),
  }));

  // Create routes for individual topic pages, filtering out only non-visitable placeholder topics.
  const topicRoutes = allTopics
    .filter(topic => {
        // A topic is a real page if it's not just a parent category and has a real URL.
        const isCategory = topic.category === 'parent';
        const hasNoPage = topic.href === '#';
        
        return !isCategory && !hasNoPage;
    })
    .map((topic) => ({
      url: `${URL}${topic.href}`,
      lastModified: new Date(),
  }));
  
  // Use a Set to automatically handle any duplicates
  const allUrls = new Set([
      ...staticRoutes.map(r => r.url), 
      ...pathRoutes.map(r => r.url), 
      ...topicRoutes.map(r => r.url)
  ]);

  return Array.from(allUrls).map(url => ({
      url,
      lastModified: new Date(),
  }));
}
