
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

  // Create routes for individual topic pages, filtering out placeholder/category topics
  const topicRoutes = allTopics
    .filter(topic => {
        // Exclude topics that are just organizational categories
        const isCategory = topic.category === 'parent';
        // Exclude topics that don't have a real page
        const hasNoPage = topic.href === '#';
        // A topic is a "real" page if it has sub-topics (like a chapter), interactive examples, or its own content.
        // If it lacks all of these, it's likely just a link in a list.
        const hasContent = !!topic.subTopics || !!topic.interactiveExamples || !!topic.content;
        // The old logic was too permissive. This is a stricter check.
        // A page is only a "parent-only" if it has children but no content of its own.
        const isParentOnly = allTopics.some(child => child.parent === topic.id) && !hasContent;

        return !isCategory && !hasNoPage && !isParentOnly;
    })
    .map((topic) => ({
      url: `${URL}${topic.href}`,
      lastModified: new Date(),
  }));

  return [...staticRoutes, ...pathRoutes, ...topicRoutes];
}
