
import { type Topic } from './types';
import { linearAlgebraPart1 } from './linear-algebra-part-1';
import { linearAlgebraPart2 } from './linear-algebra-part-2';

const rawTopics: Topic[] = [
    ...linearAlgebraPart1,
    ...linearAlgebraPart2,
];

// Post-process to fix hrefs
export const linearAlgebraTopics: Topic[] = rawTopics.map(topic => {
    // If href is already defined (like for mental math or a custom viz page), don't change it.
    if (topic.href) {
        return topic;
    }
    
    return {
        ...topic,
        href: `/linear-algebra-for-quantitative-finance/${topic.id}`,
    };
});
