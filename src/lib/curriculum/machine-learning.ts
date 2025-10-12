
import { type Topic } from './types';
import { machineLearningPart1 } from './machine-learning-part-1';
import { machineLearningPart2 } from './machine-learning-part-2';
import { machineLearningPart3 } from './machine-learning-part-3';

const rawTopics: Topic[] = [
    ...machineLearningPart1,
    ...machineLearningPart2,
    ...machineLearningPart3,
];

// Post-process to fix hrefs
export const machineLearningTopics: Topic[] = rawTopics.map(topic => {
    // If href is already defined (like for mental math), don't change it.
    if (topic.href) {
        return topic;
    }
    return {
        ...topic,
        href: `/machine-learning-for-quantitative-finance/${topic.id}`,
    }
});
