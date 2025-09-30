import { type Topic } from './types';
import { mainTopics } from './main';
import { linearAlgebraTopics } from './linear-algebra';
import { statisticsTopics } from './statistics';
import { probabilityTopics } from './probability';

export const allTopics: Topic[] = [
    ...mainTopics,
    ...linearAlgebraTopics,
    ...statisticsTopics,
    ...probabilityTopics,
].map(topic => {
    // Override href for this specific topic to point to the new dedicated page
    if (topic.id === 'bayes-theorem') {
        return { ...topic, href: '/probability/bayes-theorem' };
    }
    return topic;
});

export * from './types';
