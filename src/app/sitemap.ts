
import { MetadataRoute } from 'next';
import { allTopics } from '@/lib/curriculum';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quantfinancelab.com';

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
      url: `${URL}/stat-toolkit`,
      lastModified: new Date(),
    },
  ];

  // We filter out 'parent' category topics and topics with no real page (href === '#')
  const topicRoutes = allTopics
    .filter(topic => 
        topic.category !== 'parent' && 
        topic.href !== '#' && 
        (topic.subTopics || topic.interactiveExamples || topic.category === 'main' || topic.parent === 'stats-foundations' || topic.parent === 'prob-core-tools' || topic.parent === 'prob-dist-discrete' || topic.parent === 'prob-dist-continuous')
    )
    .map((topic) => ({
      url: `${URL}${topic.href}`,
      lastModified: new Date(),
  }));

  return [...staticRoutes, ...topicRoutes];
}
