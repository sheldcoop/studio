
import { type Topic } from './types';
import { machineLearningPart1 } from './machine-learning-part-1';
import { machineLearningPart2 } from './machine-learning-part-2';
import { machineLearningPart3 } from './machine-learning-part-3';

export const machineLearningTopics: Topic[] = [
    ...machineLearningPart1,
    ...machineLearningPart2,
    ...machineLearningPart3,
];
