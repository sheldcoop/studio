
import { type Topic } from './types';
import { createTopic } from './utils';

export const probabilityForQuantsPart3: Topic[] = [
    // --- Module 5: Stochastic Processes ---
    createTopic({
        id: 'prob-introduction-to-stochastic-processes-stationarity',
        parent: 'prob-quant-mod-5',
        title: 'Introduction to Stochastic Processes & Stationarity',
        icon: 'Clock',
        description: "Understanding random phenomena that evolve over time.",
        category: 'sub-topic',
        duration: 20,
        subTopics: [
            { id: 'stochastic-def', title: 'Defining a Stochastic Process' },
            { id: 'stochastic-stationarity', title: 'Stationarity' },
        ]
    }),
    createTopic({
        id: 'prob-discrete-time-markov-chains',
        parent: 'prob-quant-mod-5',
        title: 'Discrete-Time Markov Chains',
        icon: 'Footprints',
        description: "Modeling memoryless state transitions.",
        category: 'sub-topic',
        duration: 40,
        subTopics: [
            { id: 'markov-property', title: 'The Markov Property' },
            { id: 'markov-transition-matrix', title: 'Transition Matrices' },
            { id: 'markov-steady-state', title: 'Steady-State Distributions' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-5',
        id: 'poisson-process-deep-dive',
        href: '/quantlab/poisson-distribution',
        title: 'The Poisson Process',
        icon: 'Zap',
        description: "Modeling the timing of random events.",
        category: 'sub-topic',
        duration: 30,
        subTopics: [
            { id: 'poisson-process-def', title: 'Definition' },
            { id: 'poisson-inter-arrival', title: 'Inter-arrival Times' },
        ]
    }),
    createTopic({
        id: 'prob-random-walks-brownian-motion',
        parent: 'prob-quant-mod-5',
        title: 'Random Walks & Brownian Motion',
        icon: 'TrendingDown',
        description: "The mathematical foundation of stock price movements.",
        category: 'sub-topic',
        duration: 30,
        subTopics: [
            { id: 'brownian-random-walk', title: 'From Random Walks to Brownian Motion' },
            { id: 'brownian-properties', title: 'Properties of Brownian Motion' },
        ]
    }),

    // --- Module 6: Advanced & Measure-Theoretic Probability ---
    createTopic({
        id: 'prob-sigma-algebras-probability-measures',
        parent: 'prob-quant-mod-6',
        title: 'Sigma-Algebras & Probability Measures',
        icon: 'Ruler',
        description: "The rigorous foundation of modern probability.",
        category: 'sub-topic',
        duration: 35,
        subTopics: [
            { id: 'sigma-algebra-def', title: 'Sigma-Algebras' },
            { id: 'prob-measure-def', title: 'Probability Measures' },
        ]
    }),
    createTopic({
        id: 'prob-the-lebesgue-integral-rigorous-expectation',
        parent: 'prob-quant-mod-6',
        title: 'The Lebesgue Integral & Rigorous Expectation',
        icon: 'PenTool',
        description: "A more powerful theory of integration.",
        category: 'sub-topic',
        duration: 35,
        subTopics: [
            { id: 'lebesgue-intro', title: 'Motivation for Lebesgue' },
            { id: 'lebesgue-expectation', title: 'Expectation via Lebesgue' },
        ]
    }),
    createTopic({
        id: 'prob-martingales',
        parent: 'prob-quant-mod-6',
        title: 'Martingales',
        icon: 'Scale',
        description: "The formal model of a fair game.",
        category: 'sub-topic',
        duration: 40,
        subTopics: [
            { id: 'martingale-def', title: 'Definition of a Martingale' },
            { id: 'martingale-stopping-times', title: 'Optional Stopping Theorem' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-6',
        id: 'stochastic-calculus-itos-lemma-deep-dive',
        href: '/quantlab/stochastic-calculus-itos-lemma',
        title: "Introduction to Itô Calculus",
        icon: 'AreaChart',
        description: "The calculus of random walks, essential for derivatives pricing.",
        category: 'sub-topic',
        duration: 40,
        subTopics: [
            { id: 'ito-integral', title: 'The Itô Integral' },
            { id: 'ito-lemma', title: "Itô's Lemma" },
        ]
    }),
];
