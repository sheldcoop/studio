
import { type Topic } from './types';
import { probabilityForQuantsPart1 } from './probability-for-quants-part-1';
import { probabilityForQuantsPart2 } from './probability-for-quants-part-2';
import { probabilityForQuantsPart3 } from './probability-for-quants-part-3';

export const probabilityAdvancedTopics: Topic[] = [
    ...probabilityForQuantsPart1,
    ...probabilityForQuantsPart2,
    ...probabilityForQuantsPart3,
].map(topic => ({
    ...topic,
    href: `/probability-for-quants/${topic.id}`,
}));
