
import { type Topic } from './types';
import { mainTopics } from './main';
import { statisticsTopics } from './statistics';
import { probabilityTopics } from './probability';
import { statisticsHomepageTopics } from './statistics-homepage';
import { linearAlgebraTopics } from './linear-algebra';

export const allTopics: Topic[] = [
    ...mainTopics,
    ...statisticsTopics,
    ...probabilityTopics,
    ...statisticsHomepageTopics,
    ...linearAlgebraTopics,
];

export { mainTopics };
export * from './types';
