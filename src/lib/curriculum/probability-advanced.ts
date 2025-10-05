
import { type Topic } from './types';
import { createTopic } from './utils';

export const probabilityAdvancedTopics: Topic[] = [
    // --- Module 1: Foundations of Probability ---
    createTopic({
        parent: 'prob-quant-mod-1',
        title: 'The Basics: Sample Spaces & Events',
        icon: 'Dice3',
        description: "Understanding the building blocks of probability.",
        category: 'sub-topic',
        duration: 20,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'prob-sample-space-def', title: 'Defining a Sample Space' },
            { id: 'prob-events-sets', title: 'Events as Subsets' },
            { id: 'prob-set-operations', title: 'Set Operations on Events' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-1',
        title: 'Combinatorics: The Art of Counting',
        icon: 'Calculator',
        description: "Techniques for counting outcomes and possibilities.",
        category: 'sub-topic',
        duration: 25,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'prob-permutations', title: 'Permutations' },
            { id: 'prob-combinations', title: 'Combinations' },
            { id: 'prob-sampling', title: 'Sampling with/without Replacement' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-1',
        title: 'Conditional Probability & Independence',
        icon: 'GitBranch',
        description: "How the occurrence of one event affects another.",
        category: 'sub-topic',
        duration: 20,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'prob-conditional-def', title: 'Definition of Conditional Probability' },
            { id: 'prob-independence', title: 'Independence of Events' },
            { id: 'prob-multiplication-rule', title: 'The Multiplication Rule' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-1',
        title: "Bayes' Theorem",
        id: 'bayes-theorem-deep-dive',
        href: '/probability/bayes-theorem',
        icon: 'BrainCircuit',
        description: "Updating beliefs in the face of new evidence.",
        category: 'sub-topic',
        duration: 20,
        subTopics: [
            { id: 'bayes-formula', title: 'The Formula' },
            { id: 'bayes-prior-posterior', title: 'Priors, Likelihood, and Posteriors' },
            { id: 'bayes-application', title: 'Application: The Disease Test' },
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
        pathPrefix: 'topics',
        subTopics: [
            { id: 'rv-discrete', title: 'Discrete Random Variables' },
            { id: 'rv-continuous', title: 'Continuous Random Variables' },
            { id: 'rv-cdf', title: 'Cumulative Distribution Function (CDF)' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-2',
        title: 'Expectation, Variance & Moments',
        icon: 'Target',
        description: "Calculating the center, spread, and shape of a distribution.",
        category: 'sub-topic',
        duration: 25,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'rv-expected-value', title: 'Expected Value' },
            { id: 'rv-variance-stddev', title: 'Variance and Standard Deviation' },
            { id: 'rv-moments', title: 'Higher-Order Moments' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-2',
        title: 'Common Discrete Distributions',
        icon: 'Component',
        description: "Exploring Bernoulli, Binomial, and Poisson distributions.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'dist-bernoulli', title: 'Bernoulli Distribution' },
            { id: 'dist-binomial', title: 'Binomial Distribution' },
            { id: 'dist-poisson', title: 'Poisson Distribution' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-2',
        title: 'Common Continuous Distributions',
        icon: 'AreaChart',
        description: "Exploring Uniform, Normal, and Exponential distributions.",
        category: 'sub-topic',
        duration: 25,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'dist-uniform', title: 'Uniform Distribution' },
            { id: 'dist-normal', title: 'Normal Distribution' },
            { id: 'dist-exponential', title: 'Exponential Distribution' },
        ]
    }),

    // --- Module 3: Multivariate Probability & Core Theorems ---
    createTopic({
        parent: 'prob-quant-mod-3',
        title: 'Joint, Marginal & Conditional Distributions',
        icon: 'Users',
        description: "Modeling the behavior of multiple random variables at once.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'multi-joint-pdf', title: 'Joint Probability Distributions' },
            { id: 'multi-marginal', title: 'Marginal Distributions' },
            { id: 'multi-conditional', title: 'Conditional Distributions' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-3',
        title: 'Covariance & Correlation',
        id: 'covariance-and-correlation',
        href: '/topics/pearson-correlation',
        icon: 'TrendingUp',
        description: "Measuring how two random variables move together.",
        category: 'sub-topic',
        duration: 25,
        subTopics: [
            { id: 'multi-covariance-def', title: 'Defining Covariance' },
            { id: 'multi-correlation-def', title: 'Defining Correlation' },
            { id: 'multi-portfolio-app', title: 'Application in Portfolio Theory' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-3',
        id: 'law-of-large-numbers-deep-dive',
        title: 'The Law of Large Numbers (LLN)',
        href: '/topics/law-of-large-numbers',
        icon: 'Scale',
        description: "Why casino averages are so stable.",
        category: 'sub-topic',
        duration: 20,
        subTopics: [
            { id: 'lln-weak', title: 'Weak Law (WLLN)' },
            { id: 'lln-strong', title: 'Strong Law (SLLN)' },
            { id: 'lln-implications', title: 'Implications for Sampling' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-3',
        id: 'central-limit-theorem-deep-dive',
        title: 'The Central Limit Theorem (CLT)',
        href: '/topics/central-limit-theorem',
        icon: 'Bell',
        description: "Why the normal distribution is everywhere.",
        category: 'sub-topic',
        duration: 30,
        subTopics: [
            { id: 'clt-statement', title: 'The Theorem' },
            { id: 'clt-conditions', title: 'Conditions for CLT' },
            { id: 'clt-application', title: 'Applications in Inference' },
        ]
    }),

    // --- Module 4: Intermediate Topics & Generating Functions ---
    createTopic({
        parent: 'prob-quant-mod-4',
        title: 'Transformations of Random Variables',
        icon: 'Replace',
        description: "Finding the distribution of a function of a random variable.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'trans-one-var', title: 'Functions of One Variable' },
            { id: 'trans-two-vars', title: 'Functions of Two Variables' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-4',
        title: 'Moment Generating Functions (MGFs)',
        icon: 'Sun',
        description: "A powerful tool for analyzing distributions.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'mgf-definition', title: 'Definition and Properties' },
            { id: 'mgf-moments', title: 'Generating Moments' },
            { id: 'mgf-sums', title: 'Sums of Independent R.V.s' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-4',
        title: 'Introduction to Information Theory',
        icon: 'Binary',
        description: "Quantifying information with Entropy and KL Divergence.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'info-entropy', title: 'Entropy' },
            { id: 'info-kl-divergence', title: 'KL Divergence' },
        ]
    }),

    // --- Module 5: Stochastic Processes ---
    createTopic({
        parent: 'prob-quant-mod-5',
        title: 'Introduction to Stochastic Processes & Stationarity',
        icon: 'Clock',
        description: "Understanding random phenomena that evolve over time.",
        category: 'sub-topic',
        duration: 20,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'stochastic-def', title: 'Defining a Stochastic Process' },
            { id: 'stochastic-stationarity', title: 'Stationarity' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-5',
        title: 'Discrete-Time Markov Chains',
        icon: 'Footprints',
        description: "Modeling memoryless state transitions.",
        category: 'sub-topic',
        duration: 40,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'markov-property', title: 'The Markov Property' },
            { id: 'markov-transition-matrix', title: 'Transition Matrices' },
            { id: 'markov-steady-state', title: 'Steady-State Distributions' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-5',
        id: 'poisson-process-deep-dive',
        title: 'The Poisson Process',
        href: '/probability/poisson-distribution',
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
        parent: 'prob-quant-mod-5',
        title: 'Random Walks & Brownian Motion',
        icon: 'TrendingDown',
        description: "The mathematical foundation of stock price movements.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'brownian-random-walk', title: 'From Random Walks to Brownian Motion' },
            { id: 'brownian-properties', title: 'Properties of Brownian Motion' },
        ]
    }),

    // --- Module 6: Advanced & Measure-Theoretic Probability ---
    createTopic({
        parent: 'prob-quant-mod-6',
        title: 'Sigma-Algebras & Probability Measures',
        icon: 'Ruler',
        description: "The rigorous foundation of modern probability.",
        category: 'sub-topic',
        duration: 35,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'sigma-algebra-def', title: 'Sigma-Algebras' },
            { id: 'prob-measure-def', title: 'Probability Measures' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-6',
        title: 'The Lebesgue Integral & Rigorous Expectation',
        icon: 'PenTool',
        description: "A more powerful theory of integration.",
        category: 'sub-topic',
        duration: 35,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'lebesgue-intro', title: 'Motivation for Lebesgue' },
            { id: 'lebesgue-expectation', title: 'Expectation via Lebesgue' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-6',
        title: 'Martingales',
        icon: 'Scale',
        description: "The formal model of a fair game.",
        category: 'sub-topic',
        duration: 40,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'martingale-def', title: 'Definition of a Martingale' },
            { id: 'martingale-stopping-times', title: 'Optional Stopping Theorem' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-6',
        id: 'stochastic-calculus-itos-lemma-deep-dive',
        title: "Introduction to Itô Calculus",
        href: '/topics/stochastic-calculus-itos-lemma',
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
