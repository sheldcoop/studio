
import { type Topic, type SubTopic } from './types';
import { learningPaths } from '@/lib/learning-paths';
import { allTopics } from '@/lib/curriculum';

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
    
    // Find the ultimate parent path for this topic
    // This is a simplified lookup assuming modules have parents like 'la-module-1'
    // and those modules are defined in the learning-paths file.
    const parentPath = learningPaths.find(p => p.modules.some(m => m.id === parent));
    const pathPrefix = parentPath ? parentPath.id : parent;
    
    const finalHref = explicitHref || `/${pathPrefix}/${slug}`;

    return {
        id: slug,
        title,
        href: finalHref,
        parent,
        ...rest,
    };
};
