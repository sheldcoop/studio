
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
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
     createTopic({
        parent: 'la-module-3',
        title: 'Diagonalization',
        icon: 'Waypoints',
        description: "Simplify complex systems for long-term modeling.",
        category: 'sub-topic',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
     createTopic({
        parent: 'la-module-3',
        title: 'Singular Value Decomposition (SVD)',
        icon: 'Waypoints',
        description: "The master decomposition for any matrix.",
        category: 'sub-topic',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
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
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
     createTopic({
        parent: 'la-module-4',
        title: 'Positive Definite Matrices',
        icon: 'Waypoints',
        description: "The mathematical property that makes portfolio optimization possible.",
        category: 'sub-topic',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
     createTopic({
        parent: 'la-module-4',
        title: 'Cholesky Decomposition',
        icon: 'Waypoints',
        description: "The key to generating correlated random asset paths for Monte Carlo simulations.",
        category: 'sub-topic',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),

    // --- Module 5: Orthogonality & Projections ---
    createTopic({
        parent: 'la-module-5',
        title: 'The Inexact Problem',
        icon: 'Waypoints',
        description: 'What to do when Ax=b has no solution.',
        category: 'sub-topic',
        duration: 15,
    }),
    createTopic({
        parent: 'la-module-5',
        title: 'Projections onto Subspaces',
        icon: 'Waypoints',
        description: 'The geometric solution: find the closest point in the column space.',
        category: 'sub-topic',
        duration: 30,
    }),
    createTopic({
        parent: 'la-module-5',
        title: 'The Normal Equations',
        icon: 'Waypoints',
        description: 'The algebraic solution: deriving AᵀAx̂ = Aᵀb.',
        category: 'sub-topic',
        duration: 30,
    }),

    // --- Module 6: Least Squares & The QR Decomposition ---
    createTopic({
        parent: 'la-module-6',
        title: 'Linear Regression',
        icon: 'Waypoints',
        description: 'The quintessential application of least squares.',
        category: 'sub-topic',
        duration: 25,
    }),
    createTopic({
        parent: 'la-module-6',
        title: 'Gram-Schmidt Process',
        icon: 'Waypoints',
        description: 'Creating a stable, orthonormal basis (Q).',
        category: 'sub-topic',
        duration: 30,
    }),
    createTopic({
        parent: 'la-module-6',
        title: 'QR Decomposition',
        icon: 'Waypoints',
        description: 'A numerically superior method for solving least squares problems.',
        category: 'sub-topic',
        duration: 35,
    }),
];
