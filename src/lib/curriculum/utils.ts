
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
    pathPrefix?: string; // e.g., 'statistics' or 'probability'
}


/**
 * Creates a standardized topic object with an automatically generated href.
 * The ID defaults to a slugified version of the title.
 */
export const createTopic = (options: CreateTopicOptions): Topic => {
    const { 
        id, 
        title, 
        pathPrefix,
        ...rest 
    } = options;

    const slug = id || toSlug(title);
    
    // Construct the href based on whether a pathPrefix is provided
    const href = pathPrefix ? `/${pathPrefix}/${slug}` : `/topics/${slug}`;

    return {
        id: slug,
        title,
        href,
        ...rest,
    };
};
