
import { type Topic } from './types';
import { createTopic } from './utils';

const PATH_PREFIX = 'linear-algebra-for-quantitative-finance';

export const linearAlgebraPart2: Topic[] = [
    // --- Module 3 ---
     createTopic({
        parent: 'la-module-3',
        title: 'Eigenvalues & Eigenvectors',
        icon: 'Waypoints',
        description: "Find the 'axes of greatest variance' in your data.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'eigen-definition', title: 'Geometric & Algebraic Definition' },
            { id: 'characteristic-equation', title: 'The Characteristic Equation' },
            { id: 'finding-eigenvalues', title: 'Finding Eigenvalues' },
            { id: 'finding-eigenvectors', title: 'Finding Eigenvectors' },
        ]
    }),
    createTopic({
        id: 'lu-decomposition',
        parent: 'la-module-3',
        title: 'LU Decomposition: The Ultimate Guide',
        icon: 'Waypoints',
        description: "Factoring a complex problem into two simple ones.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
    }),
     createTopic({
        id: 'diagonalization',
        parent: 'la-module-3',
        title: 'Diagonalization',
        icon: 'Waypoints',
        description: "Simplify complex systems for long-term modeling.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'diagonalization-theorem', title: 'The Diagonalization Theorem' },
            { id: 'process-of-diagonalization', title: 'Process of Diagonalization' },
            { id: 'matrix-powers', title: 'Powers of a Matrix' },
        ]
    }),
     createTopic({
        id: 'svd-visualizer',
        parent: 'la-module-3',
        title: 'Singular Value Decomposition (SVD)',
        icon: 'Waypoints',
        description: "The master decomposition for any matrix.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
    }),

    // --- Module 4 ---
     createTopic({
        parent: 'la-module-4',
        id: 'covariance-and-correlation-matrices',
        title: 'Covariance & Correlation Matrices',
        icon: 'Waypoints',
        description: "The cornerstone of portfolio theory.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
    }),
     createTopic({
        parent: 'la-module-4',
        title: 'Positive Definite Matrices',
        icon: 'Waypoints',
        description: "The mathematical property that makes portfolio optimization possible.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'pdm-definition', title: 'Defining Positive Definite' },
            { id: 'pdm-properties', title: 'Properties and Importance' },
        ]
    }),
     createTopic({
        id: 'cholesky-decomposition',
        parent: 'la-module-4',
        title: 'Cholesky Decomposition: The Ultimate Guide',
        icon: 'Waypoints',
        description: "The elegant 'matrix square root' for specialized, high-speed applications.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
    }),
];
