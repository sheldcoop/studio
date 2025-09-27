import { MetadataRoute } from 'next';
import { allTopics } from '@/lib/data';

const URL = 'https://quantfinancelab.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    {
      url: `${URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/paths`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/interview-prep`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/community`,
      lastModified: new Date(),
    },
    {
      url: `${URL}/topics`,
      lastModified: new Date(),
    },
  ];

  // We filter out the 'parent' category topics as they are not actual pages
  const topicRoutes = allTopics
    .filter(topic => topic.category !== 'parent')
    .map((topic) => ({
      url: `${URL}${topic.href}`,
      lastModified: new Date(),
  }));

  return [...staticRoutes, ...topicRoutes];
}
