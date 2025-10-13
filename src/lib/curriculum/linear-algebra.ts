
import { type Topic } from './types';
import { linearAlgebraPart1 } from './linear-algebra-part-1';
import { linearAlgebraPart2 } from './linear-algebra-part-2';
import { createTopic } from './utils';

const animationTopics: Topic[] = [
    createTopic({
        parent: 'la-anim-module-1',
        id: 'visualizing-determinant',
        title: 'Visualizing the Determinant',
        icon: 'BoxSelect',
        description: 'An interactive visualization of how a matrix transforms space and how the determinant measures this change.',
        category: 'sub-topic',
        duration: 10,
    }),
]

const rawTopics: Topic[] = [
    ...linearAlgebraPart1,
    ...linearAlgebraPart2,
    ...animationTopics,
];

// Post-process to fix hrefs
export const linearAlgebraTopics: Topic[] = rawTopics.map(topic => {
    // If href is already defined (like for mental math), don't change it.
    if (topic.href) {
        return topic;
    }
     // Handle animations path separately
    if (topic.parent === 'la-anim-module-1') {
        return {
            ...topic,
            href: `/linear-algebra-animations/${topic.id}`,
        };
    }
    return {
        ...topic,
        href: `/linear-algebra-for-quantitative-finance/${topic.id}`,
    };
});
