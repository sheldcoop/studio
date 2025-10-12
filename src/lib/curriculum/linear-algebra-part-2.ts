
import { type Topic } from './types';
import { createTopic } from './utils';

export const linearAlgebraPart2: Topic[] = [
    // --- Module 3 ---
     createTopic({
        parent: 'la-module-3',
        title: 'Eigenvalues & Eigenvectors',
        icon: 'Waypoints',
        description: "Find the 'axes of greatest variance' in your data.",
        category: 'sub-topic',
        subTopics: [
            { id: 'eigen-definition', title: 'Geometric & Algebraic Definition' },
            { id: 'characteristic-equation', title: 'The Characteristic Equation' },
            { id: 'finding-eigenvalues', title: 'Finding Eigenvalues' },
            { id: 'finding-eigenvectors', title: 'Finding Eigenvectors' },
        ]
    }),
     createTopic({
        parent: 'la-module-3',
        title: 'Diagonalization',
        icon: 'Waypoints',
        description: "Simplify complex systems for long-term modeling.",
        category: 'sub-topic',
        subTopics: [
            { id: 'diagonalization-theorem', title: 'The Diagonalization Theorem' },
            { id: 'process-of-diagonalization', title: 'Process of Diagonalization' },
            { id: 'matrix-powers', title: 'Powers of a Matrix' },
        ]
    }),
     createTopic({
        parent: 'la-module-3',
        title: 'Singular Value Decomposition (SVD)',
        icon: 'Waypoints',
        description: "The master decomposition for any matrix.",
        category: 'sub-topic',
        subTopics: [
            { id: 'svd-intro', title: 'Introduction to SVD' },
            { id: 'svd-calculation', title: 'Calculating SVD' },
            { id: 'svd-applications', title: 'Applications of SVD' },
        ]
    }),

    // --- Module 4 ---
     createTopic({
        parent: 'la-module-4',
        title: 'Covariance & Correlation Matrices',
        icon: 'Waypoints',
        description: "The cornerstone of portfolio theory.",
        category: 'sub-topic',
        subTopics: [
            { id: 'cov-matrix-def', title: 'Defining Covariance Matrices' },
            { id: 'corr-matrix-def', title: 'Defining Correlation Matrices' },
            { id: 'portfolio-variance', title: 'Calculating Portfolio Variance' },
        ]
    }),
     createTopic({
        parent: 'la-module-4',
        title: 'Positive Definite Matrices',
        icon: 'Waypoints',
        description: "The mathematical property that makes portfolio optimization possible.",
        category: 'sub-topic',
        subTopics: [
            { id: 'pdm-definition', title: 'Defining Positive Definite' },
            { id: 'pdm-properties', title: 'Properties and Importance' },
        ]
    }),
     createTopic({
        parent: 'la-module-4',
        title: 'Cholesky Decomposition',
        icon: 'Waypoints',
        description: "The key to generating correlated random asset paths for Monte Carlo simulations.",
        category: 'sub-topic',
        subTopics: [
            { id: 'cholesky-intro', title: 'Introduction to Cholesky' },
            { id: 'cholesky-calculation', title: 'Calculating the Decomposition' },
            { id: 'cholesky-monte-carlo', title: 'Application in Monte Carlo' },
        ]
    }),
];
