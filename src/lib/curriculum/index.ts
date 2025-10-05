
import { type Topic } from './types';
import { mainTopics } from './main';
import { linearAlgebraTopics } from './linear-algebra';
import { statisticsTopics } from './statistics';
import { probabilityTopics } from './probability';
import { machineLearningTopics } from './machine-learning';

export const allTopics: Topic[] = [
    ...mainTopics,
    ...linearAlgebraTopics,
    ...statisticsTopics,
    ...probabilityTopics,
    ...machineLearningTopics,
];

// --- Build-time Uniqueness Check ---
// This code runs at build time to ensure all topic IDs are unique.
// If a duplicate is found, it will throw an error and fail the build,
// preventing duplicate slugs from ever reaching production.
const topicIds = allTopics.map(t => t.id);
const duplicateIds = topicIds.filter((id, index) => topicIds.indexOf(id) !== index);

if (duplicateIds.length > 0) {
  throw new Error(`Error: Duplicate topic IDs found in curriculum: ${[...new Set(duplicateIds)].join(', ')}. Please ensure all topic IDs are unique.`);
}

export { mainTopics };
export * from './types';
export * from './utils';
