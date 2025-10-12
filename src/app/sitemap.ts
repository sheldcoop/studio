
import { MetadataRoute } from 'next';
import { allTopics } from '@/lib/curriculum';
import { learningPaths } from '@/lib/learning-paths';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: `/`, lastModified: new Date() },
    { url: `/paths`, lastModified: new Date() },
    { url: `/interview-prep`, lastModified: new Date() },
    { url: `/community`, lastModified: new Date() },
    { url: `/quantlab`, lastModified: new Date() },
    { url: `/topics`, lastModified: new Date() },
    { url: `/login`, lastModified: new Date() },
    { url: `/profile`, lastModified: new Date() },
    { url: `/settings`, lastModified: new Date() },
  ];

  // Create routes for the learning path pages
  const pathRoutes = learningPaths.map((path) => ({
    url: path.href,
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
      url: topic.href,
      lastModified: new Date(),
  }));
  
  // Combine all routes and ensure uniqueness
  const allRoutes = [
    ...staticRoutes,
    ...pathRoutes,
    ...topicRoutes,
  ];

  // Use a Set to automatically handle any duplicates based on the URL
  const uniqueUrls = new Map(allRoutes.map(route => [route.url, route]));

  return Array.from(uniqueUrls.values());
}
