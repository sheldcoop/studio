
import { type Topic, type SubTopic } from './types';

// Slug generation utility
const toSlug = (title: string, prefix = ''): string => {
  const baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
  return prefix ? `${prefix}-${baseSlug}` : baseSlug;
};


interface CreateTopicOptions {
    id?: string;
    title: string;
    description: string;
    icon?: string;
    category: Topic['category'];
    parent?: string;
    status?: Topic['status'];
    duration?: number;
    subTopics?: SubTopic[];
    content?: string;
    interactiveExamples?: Topic['interactiveExamples'];
    animation?: string;
    href?: string; // Allow explicitly setting the href
}


/**
 * Creates a standardized topic object with an automatically generated href.
 * The ID defaults to a slugified version of the title.
 */
export const createTopic = (options: CreateTopicOptions): Topic => {
    const { 
        id, 
        title, 
        parent, // Get parent to construct the path
        href: explicitHref, // Capture the explicit href
        ...rest 
    } = options;

    const slug = id || toSlug(title);
    
    // Use the explicit href if provided, otherwise construct it based on the parent.
    // If a topic has a parent, it belongs in that parent's path.
    const href = explicitHref || (parent ? `/${parent}/${slug}` : `/topics/${slug}`);

    return {
        id: slug,
        title,
        href,
        parent,
        ...rest,
    };
};
