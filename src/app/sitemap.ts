
import { MetadataRoute } from 'next';
import { allTopics } from '@/lib/curriculum';
import { learningPaths } from '@/lib/learning-paths';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantprep.firerun.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '/',
    '/learning-paths',
    '/quantlab',
    '/interview-prep',
    '/community',
    '/topics',
    '/login',
    '/profile',
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date(),
  }));

  // Create routes for the top-level learning path pages
  const pathRoutes = learningPaths.map((path) => ({
    url: `${URL}${path.href}`,
    lastModified: new Date(),
  }));

  // Create routes for all individual, visitable topic pages
  const topicRoutes = allTopics
    .filter(topic => {
      // A topic is a real, visitable page if it doesn't have a '#' href.
      return topic.href && topic.href !== '#';
    })
    .map((topic) => ({
      url: `${URL}${topic.href}`,
      lastModified: new Date(),
  }));
  
  // Combine all routes into a single array
  const allRoutes = [
      ...staticRoutes, 
      ...pathRoutes, 
      ...topicRoutes
  ];

  // Use a Map to ensure all URLs are unique before returning the final array
  const uniqueUrls = new Map(allRoutes.map(route => [route.url, route]));
  
  return Array.from(uniqueUrls.values());
}
