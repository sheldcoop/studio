
import { type Topic } from './types';
import { createTopic } from './utils';

export const probabilityForQuantsPart1: Topic[] = [
    // --- Module 1: Foundations of Probability ---
    createTopic({
        parent: 'prob-quant-mod-1',
        title: 'The Basics: Sample Spaces & Events',
        icon: 'Dice3',
        description: "Understanding the building blocks of probability.",
        category: 'sub-topic',
        duration: 20,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-1',
        title: 'Combinatorics: The Art of Counting',
        icon: 'Calculator',
        description: "Techniques for counting outcomes and possibilities.",
        category: 'sub-topic',
        duration: 25,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-1',
        title: 'Conditional Probability & Independence',
        icon: 'GitBranch',
        description: "How the occurrence of one event affects another.",
        category: 'sub-topic',
        duration: 20,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        id: 'bayes-theorem-lesson',
        parent: 'prob-quant-mod-1',
        href: '/quantlab/bayes-theorem',
        title: "Bayes' Theorem",
        icon: 'BrainCircuit',
        description: "Updating beliefs in the face of new evidence.",
        category: 'sub-topic',
        duration: 20,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),

    // --- Module 2: Random Variables & Distributions ---
    createTopic({
        parent: 'prob-quant-mod-2',
        title: 'Random Variables (Discrete & Continuous)',
        icon: 'BarChart3',
        description: "Mapping outcomes of a random process to numbers.",
        category: 'sub-topic',
        duration: 20,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-2',
        title: 'Expectation, Variance & Moments',
        icon: 'Target',
        description: "Calculating the center, spread, and shape of a distribution.",
        category: 'sub-topic',
        duration: 25,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-2',
        title: 'Common Discrete Distributions',
        icon: 'Component',
        description: "Exploring Bernoulli, Binomial, and Poisson distributions.",
        category: 'sub-topic',
        duration: 30,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-2',
        title: 'Common Continuous Distributions',
        icon: 'AreaChart',
        description: "Exploring Uniform, Normal, and Exponential distributions.",
        category: 'sub-topic',
        duration: 25,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
];
