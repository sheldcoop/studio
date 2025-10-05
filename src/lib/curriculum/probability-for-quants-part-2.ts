
import { type Topic } from './types';
import { createTopic } from './utils';

export const probabilityForQuantsPart2: Topic[] = [
    // --- Module 3: Multivariate Probability & Core Theorems ---
    createTopic({
        id: 'prob-joint-marginal-conditional-distributions',
        parent: 'prob-quant-mod-3',
        title: 'Joint, Marginal & Conditional Distributions',
        icon: 'Users',
        description: "Modeling the behavior of multiple random variables at once.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'multi-joint-pdf', title: 'Joint Probability Distributions' },
            { id: 'multi-marginal', title: 'Marginal Distributions' },
            { id: 'multi-conditional', title: 'Conditional Distributions' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-3',
        id: 'covariance-and-correlation',
        title: 'Covariance & Correlation',
        href: '/paths/statistics-for-quantitative-finance/pearson-correlation',
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
        href: '/paths/probability-for-quants/law-of-large-numbers-deep-dive',
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
        href: '/paths/statistics-for-quantitative-finance/central-limit-theorem',
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
        id: 'prob-transformations-of-random-variables',
        parent: 'prob-quant-mod-4',
        title: 'Transformations of Random Variables',
        icon: 'Replace',
        description: "Finding the distribution of a function of a random variable.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'trans-one-var', title: 'Functions of One Variable' },
            { id: 'trans-two-vars', title: 'Functions of Two Variables' },
        ]
    }),
    createTopic({
        id: 'prob-moment-generating-functions',
        parent: 'prob-quant-mod-4',
        title: 'Moment Generating Functions (MGFs)',
        icon: 'Sun',
        description: "A powerful tool for analyzing distributions.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'mgf-definition', title: 'Definition and Properties' },
            { id: 'mgf-moments', title: 'Generating Moments' },
            { id: 'mgf-sums', title: 'Sums of Independent R.V.s' },
        ]
    }),
    createTopic({
        id: 'prob-introduction-to-information-theory',
        parent: 'prob-quant-mod-4',
        title: 'Introduction to Information Theory',
        icon: 'Binary',
        description: "Quantifying information with Entropy and KL Divergence.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'info-entropy', title: 'Entropy' },
            { id: 'info-kl-divergence', title: 'KL Divergence' },
        ]
    }),
];
