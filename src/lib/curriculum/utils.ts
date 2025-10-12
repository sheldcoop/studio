
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
    
    let pathPrefix = parent;
    if (parent.startsWith('la-module')) {
        pathPrefix = 'linear-algebra-for-quantitative-finance';
    } else if (parent.startsWith('stats-mod')) {
        pathPrefix = 'statistics-for-quantitative-finance';
    } else if (parent.startsWith('prob-quant-mod')) {
        pathPrefix = 'probability-for-quants';
    } else if (parent.startsWith('ml-module')) {
        pathPrefix = 'machine-learning-for-quantitative-finance';
    }


    const finalHref = explicitHref || `/${pathPrefix}/${slug}`;

    return {
        id: slug,
        title,
        href: finalHref,
        parent,
        ...rest,
    };
};

