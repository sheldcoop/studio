
import { type Topic } from './types';
import { mainTopics } from './main';
import { linearAlgebraTopics } from './linear-algebra';
import { statisticsTopics } from './statistics';
import { probabilityTopics } from './probability';
import { probabilityAdvancedTopics } from './probability-advanced';

export const allTopics: Topic[] = [
    ...mainTopics,
    ...linearAlgebraTopics,
    ...statisticsTopics,
    ...probabilityTopics,
    ...probabilityAdvancedTopics,
];

export { mainTopics };
export * from './types';
