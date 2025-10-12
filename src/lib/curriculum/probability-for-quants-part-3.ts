
import { type Topic } from './types';
import { createTopic } from './utils';

export const probabilityForQuantsPart3: Topic[] = [
    // --- Module 5: Stochastic Processes ---
    createTopic({
        parent: 'probability-for-quants',
        title: 'Introduction to Stochastic Processes & Stationarity',
        icon: 'Clock',
        description: "Understanding random phenomena that evolve over time.",
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
        title: 'Discrete-Time Markov Chains',
        icon: 'Footprints',
        description: "Modeling memoryless state transitions.",
        category: 'sub-topic',
        duration: 40,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'probability-for-quants',
        id: 'poisson-distribution',
        href: '/quantlab/poisson-distribution',
        title: 'The Poisson Process',
        icon: 'Zap',
        description: "Modeling the timing of random events.",
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
        title: 'Random Walks & Brownian Motion',
        icon: 'TrendingDown',
        description: "The mathematical foundation of stock price movements.",
        category: 'sub-topic',
        duration: 30,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),

    // --- Module 6: Advanced & Measure-Theoretic Probability ---
    createTopic({
        parent: 'probability-for-quants',
        title: 'Sigma-Algebras & Probability Measures',
        icon: 'Ruler',
        description: "The rigorous foundation of modern probability.",
        category: 'sub-topic',
        duration: 35,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'probability-for-quants',
        title: 'The Lebesgue Integral & Rigorous Expectation',
        icon: 'PenTool',
        description: "A more powerful theory of integration.",
        category: 'sub-topic',
        duration: 35,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'probability-for-quants',
        title: 'Martingales',
        icon: 'Scale',
        description: "The formal model of a fair game.",
        category: 'sub-topic',
        duration: 40,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'probability-for-quants',
        id: 'stochastic-calculus-itos-lemma',
        href: '/quantlab/stochastic-calculus-itos-lemma',
        title: "Introduction to Itô Calculus",
        icon: 'AreaChart',
        description: "The calculus of random walks, essential for derivatives pricing.",
        category: 'sub-topic',
        duration: 40,
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
];
