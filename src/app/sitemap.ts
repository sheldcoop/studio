
import { MetadataRoute } from 'next';
import { allTopics } from '@/lib/curriculum';
import { learningPaths } from '@/lib/learning-paths';

const siteUrl = 'https://quantfinancelab.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2024-07-26'); // Use a static date for consistency

  const staticRoutes = [
    '/',
    '/paths',
    '/interview-prep',
    '/community',
    '/quantlab',
    '/topics',
    '/login',
    '/profile',
    '/settings',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
  }));

  const pathRoutes = learningPaths.map((path) => ({
    url: `${siteUrl}${path.href}`,
    lastModified,
  }));

  const topicRoutes = allTopics
    .filter(topic => topic.href !== '#')
    .map((topic) => ({
      url: `${siteUrl}${topic.href}`,
      lastModified,
  }));

  const allRoutes = [...staticRoutes, ...pathRoutes, ...topicRoutes];

  // Use a Map to ensure all URLs are unique
  const uniqueUrls = new Map(allRoutes.map(route => [route.url, route]));

  return Array.from(uniqueUrls.values());
}
