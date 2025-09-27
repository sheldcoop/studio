import { MetadataRoute } from 'next';
import { quantJourney } from '@/lib/data';

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

  const topicRoutes = quantJourney.map((topic) => ({
    url: `${URL}${topic.href}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...topicRoutes];
}
