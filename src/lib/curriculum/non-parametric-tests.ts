
import type { Topic } from './types';
import { createTopic } from './utils';

export const nonParametricTests: Topic[] = [
    createTopic({
        id: 'chi-squared-test',
        title: 'Chi-Squared Test',
        icon: 'FunctionSquare',
        description:
        'Analyzes categorical data to find significant relationships.',
        category: 'non-parametric',
        pathPrefix: 'quantlab',
    }),
    createTopic({
        id: 'mann-whitney-u-test',
        title: 'Mann-Whitney U Test',
        icon: 'FunctionSquare',
        description:
        'Alternative to the T-Test when data is not normally distributed.',
        category: 'non-parametric',
        pathPrefix: 'quantlab',
    }),
    createTopic({
        id: 'kruskal-wallis-test',
        title: 'Kruskal-Wallis Test',
        icon: 'FunctionSquare',
        description: 'Alternative to ANOVA for comparing three or more groups.',
        category: 'non-parametric',
        pathPrefix: 'quantlab',
    }),
    createTopic({
        id: 'wilcoxon-signed-rank-test',
        title: 'Wilcoxon Signed-Rank Test',
        icon: 'FunctionSquare',
        description:
        'Alternative to the paired T-Test for repeated measurements.',
        category: 'non-parametric',
        pathPrefix: 'quantlab',
    }),
    createTopic({
        id: 'spearmans-rank-correlation',
        title: "Spearman's Rank Correlation",
        icon: 'FunctionSquare',
        description:
        'Measures the monotonic relationship between two ranked variables.',
        category: 'non-parametric',
        pathPrefix: 'quantlab',
    }),
    createTopic({
        id: 'friedman-test',
        title: 'Friedman Test',
        icon: 'FunctionSquare',
        description:
        'The non-parametric alternative to a repeated-measures ANOVA.',
        category: 'non-parametric',
        pathPrefix: 'quantlab',
    }),
    createTopic({
        id: 'kolmogorov-smirnov-k-s-test',
        title: 'Kolmogorov-Smirnov (K-S) Test',
        icon: 'FunctionSquare',
        description: 'Tests if a sample is drawn from a specific distribution.',
        category: 'non-parametric',
        pathPrefix: 'quantlab',
    }),
];
