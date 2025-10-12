
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
    pathPrefix?: string; // e.g., 'statistics-for-quantitative-finance' or 'quantlab'
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
        pathPrefix,
        href: explicitHref, // Capture the explicit href
        ...rest 
    } = options;

    const slug = id || toSlug(title);
    
    // Use the explicit href if provided. Otherwise, construct it.
    let href = explicitHref;
    if (!href && pathPrefix) {
        if (pathPrefix === 'quantlab') {
            // QuantLab tools get a direct /quantlab/[slug] path.
            href = `/quantlab/${slug}`;
        } else {
            // All other learning path content pages get /[pathPrefix]/[slug]
            href = `/${pathPrefix}/${slug}`;
        }
    } else if (!href) {
        // Fallback for topics without a pathPrefix
        href = `/topics/${slug}`;
    }


    return {
        id: slug,
        title,
        href,
        ...rest,
    };
};
