
import { type Topic } from './types';
import { createTopic } from './utils';

export const probabilityForQuantsPart2: Topic[] = [
    // --- Module 3: Multivariate Probability & Core Theorems ---
    createTopic({
        parent: 'probability-for-quants',
        title: 'Joint, Marginal & Conditional Distributions',
        icon: 'Users',
        description: "Modeling the behavior of multiple random variables at once.",
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
        parent: 'probability-for-quants',
        id: 'covariance-and-correlation',
        href: '/quantlab/pearson-correlation',
        title: 'Covariance & Correlation',
        icon: 'TrendingUp',
        description: "Measuring how two random variables move together.",
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
        parent: 'probability-for-quants',
        title: 'The Law of Large Numbers (LLN)',
        icon: 'Scale',
        description: "Why casino averages are so stable.",
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
        parent: 'probability-for-quants',
        id: 'central-limit-theorem',
        href: '/quantlab/central-limit-theorem',
        title: 'The Central Limit Theorem (CLT)',
        icon: 'Bell',
        description: "Why the normal distribution is everywhere.",
        category: 'sub-topic',
        duration: 30,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),

    // --- Module 4: Intermediate Topics & Generating Functions ---
    createTopic({
        parent: 'probability-for-quants',
        title: 'Transformations of Random Variables',
        icon: 'Replace',
        description: "Finding the distribution of a function of a random variable.",
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
        parent: 'probability-for-quants',
        title: 'Moment Generating Functions (MGFs)',
        icon: 'Sun',
        description: "A powerful tool for analyzing distributions.",
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
        parent: 'probability-for-quants',
        title: 'Introduction to Information Theory',
        icon: 'Binary',
        description: "Quantifying information with Entropy and KL Divergence.",
        category: 'sub-topic',
        duration: 30,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
];
