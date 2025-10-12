
import { type Topic } from './types';
import { linearAlgebraPart1 } from './linear-algebra-part-1';
import { linearAlgebraPart2 } from './linear-algebra-part-2';

const rawTopics: Topic[] = [
    ...linearAlgebraPart1,
    ...linearAlgebraPart2,
];

// Post-process to fix hrefs
export const linearAlgebraTopics: Topic[] = rawTopics.map(topic => ({
    ...topic,
    href: `/linear-algebra-for-quantitative-finance/${topic.id}`,
}));
