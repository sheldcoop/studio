
import { MetadataRoute } from 'next';
import { allTopics } from '@/lib/curriculum';
import { learningPaths } from '@/lib/learning-paths';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantprep.firerun.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '/',
    '/paths',
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
      // A topic is a real, visitable page if it's not just a parent category and doesn't have a '#' href.
      const isParentCategory = topic.category === 'parent';
      const isPlaceholderLink = topic.href === '#';
      return !isParentCategory && !isPlaceholderLink;
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

  // Use a Set to ensure all URLs are unique before returning the final array
  const uniqueUrls = new Map(allRoutes.map(route => [route.url, route]));
  
  return Array.from(uniqueUrls.values());
}
