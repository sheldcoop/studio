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
];

export * from './types';
