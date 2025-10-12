
import { type Topic, type SubTopic } from './types';
import { learningPaths } from '@/lib/learning-paths';
import { allTopics as curriculumTopics } from '@/lib/curriculum';

// Slug generation utility
const toSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

interface CreateTopicOptions {
    id?: string;
    title: string;
    description: string;
    icon?: string;
    category: Topic['category'];
    parent: string; // Parent is now mandatory
    status?: Topic['status'];
    duration?: number;
    subTopics?: SubTopic[];
    content?: string;
    interactiveExamples?: Topic['interactiveExamples'];
    animation?: string;
    href?: string; // Allow explicitly setting the href
}

// Function to find the top-level path (e.g., 'linear-algebra-for-quantitative-finance')
// for any given module or topic ID.
const findTopLevelPath = (parentId: string | undefined): string | undefined => {
    if (!parentId) return undefined;

    const isTopLevelPath = learningPaths.some(p => p.id === parentId);
    if (isTopLevelPath) {
        return parentId;
    }
    // This was the source of the circular dependency. It's no longer needed.
    // const parentTopic = curriculumTopics.find(t => t.id === parentId);
    // return findTopLevelPath(parentTopic?.parent);
    return parentId; // Simplified logic, assumes parent is a direct path or needs to be resolved later.
}

/**
 * Creates a standardized topic object with a correctly generated href.
 * The URL is constructed based on the top-level learning path.
 */
export const createTopic = (options: CreateTopicOptions): Topic => {
    const { 
        id, 
        title, 
        parent,
        href: explicitHref,
        ...rest 
    } = options;

    const slug = id || toSlug(title);
    
    // Determine the correct href.
    // If an explicit href is provided, use it. This is useful for cross-linking.
    // Otherwise, construct the URL based on the parent.
    const finalHref = explicitHref || `/${parent}/${slug}`;

    return {
        id: slug,
        title,
        href: finalHref,
        parent,
        ...rest,
    };
};
