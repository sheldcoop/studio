
import { type Topic, type SubTopic } from './types';

// Slug generation utility
const toSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, 'and') // Replace & with 'and'
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
 * The URL is constructed based on its parent's path.
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
    
    // For lessons within a structured path, the parent will be the module ID (e.g., 'la-module-1').
    // The top-level path is determined by the parent's parent, and so on.
    // However, for QuantLab tools, the parent is just 'quantlab'.
    const pathPrefix = parent === 'quantlab' ? 'quantlab' : rest.category === 'parent' ? slug : options.parent.startsWith('stats-mod') ? 'statistics-for-quantitative-finance' : options.parent.startsWith('la-mod') ? 'linear-algebra-for-quantitative-finance' : options.parent.startsWith('prob-quant-mod') ? 'probability-for-quants' : parent;

    const finalHref = explicitHref || `/${pathPrefix}/${slug}`;

    return {
        id: slug,
        title,
        href: finalHref,
        parent,
        ...rest,
    };
};
