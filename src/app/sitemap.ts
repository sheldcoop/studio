
import { MetadataRoute } from 'next';
import { allTopics } from '@/lib/curriculum';
import { learningPaths } from '@/lib/learning-paths';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantfinancelab.com';

export default function sitemap(): MetadataRoute.Sitemap {
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
    lastModified: new Date(),
  }));

  const pathRoutes = learningPaths.map((path) => ({
    url: `${siteUrl}${path.href}`,
    lastModified: new Date(),
  }));

  const topicRoutes = allTopics
    .filter(topic => topic.href !== '#')
    .map((topic) => ({
      url: `${siteUrl}${topic.href}`,
      lastModified: new Date(),
  }));

  const allRoutes = [...staticRoutes, ...pathRoutes, ...topicRoutes];

  const uniqueUrls = new Map(allRoutes.map(route => [route.url, route]));

  return Array.from(uniqueUrls.values());
}
