
import { type Topic, type SubTopic } from './types';

// Slug generation utility
const toSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\(.*\)|\[.*\]/g, '') // Remove content in parentheses or brackets
    .replace(/&/g, 'and')         // Replace & with 'and'
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars except -
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
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
    previousSlugs?: string[];
    href?: string; // Allow manual href override
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
        href: manualHref,
        ...rest 
    } = options;

    const slug = id || toSlug(title);
    
    // Construct the href based on whether a pathPrefix is provided, unless manually overridden
    const href = manualHref || (pathPrefix ? `/${pathPrefix}/${slug}` : `/topics/${slug}`);

    return {
        id: slug,
        title,
        href,
        ...rest,
    };
};
