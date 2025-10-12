

import { type Topic } from './types';
import { createTopic } from './utils';

const PATH_PREFIX = 'linear-algebra-for-quantitative-finance';

export const linearAlgebraPart1: Topic[] = [
    // --- Module 1 ---
    createTopic({
        id: 'vectors-vector-spaces',
        parent: 'la-module-1',
        title: 'Vectors & Vector Spaces',
        icon: 'Waypoints',
        description: "Representing asset returns or portfolio weights.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'vector-basics', title: 'Vector Basics' },
            { id: 'vector-operations', title: 'Vector Operations' },
            { id: 'linear-combinations', title: 'Linear Combinations & Span' },
            { id: 'vector-spaces', title: 'Defining a Vector Space' },
        ]
    }),
    createTopic({
        id: 'matrix-operations',
        parent: 'la-module-1',
        title: 'Matrix Operations',
        icon: 'Table',
        description: "Aggregating data across assets and time.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'matrix-add-subtract', title: 'Matrix Addition & Subtraction' },
            { id: 'scalar-multiplication', title: 'Scalar Multiplication' },
            { id: 'matrix-multiplication', title: 'Matrix Multiplication' },
            { id: 'matrix-transpose', title: 'The Matrix Transpose' },
        ]
    }),
    createTopic({
        id: 'change-of-basis',
        parent: 'la-module-1',
        title: 'Change of Basis',
        icon: 'Orbit',
        description: "Viewing vectors from a different perspective.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'change-of-basis-theory', title: 'Core Theory' },
            { id: 'change-of-basis-application', title: 'Financial Application' },
            { id: 'change-of-basis-interactive', title: 'Interactive Demo' },
            { id: 'change-of-basis-problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        id: 'matrix-decomposition',
        parent: 'la-module-1',
        title: 'Matrix Decomposition',
        description: "Unpacking the secret recipe of your data.",
        icon: 'Grid',
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        duration: 25,
    }),

    // --- Module 2 ---
     createTopic({
        id: 'systems-of-linear-equations',
        parent: 'la-module-2',
        title: 'Systems of Linear Equations',
        icon: 'Waypoints',
        description: "The mathematical basis for linear regression.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'sle-matrix-form', title: 'Representing Systems in Matrix Form' },
            { id: 'gaussian-elimination', title: 'Gaussian Elimination' },
            { id: 'solving-systems', title: 'Solving Systems of Equations' },
        ]
    }),
     createTopic({
        id: 'the-four-fundamental-subspaces',
        parent: 'la-module-2',
        title: 'The Four Fundamental Subspaces',
        icon: 'Waypoints',
        description: "Understand the complete picture of a matrix.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'column-space', title: 'Column Space (Image)' },
            { id: 'null-space', title: 'Null Space (Kernel)' },
            { id: 'row-space', title: 'Row Space' },
            { id: 'fundamental-theorem', title: 'The Fundamental Theorem' },
        ]
    }),
     createTopic({
        id: 'orthogonality-projections',
        parent: 'la-module-2',
        title: 'Orthogonality & Projections',
        icon: 'Waypoints',
        description: "The core of Ordinary Least Squares (OLS) regression.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'dot-product', title: 'The Dot Product & Orthogonality' },
            { id: 'orthogonal-projections', title: 'Orthogonal Projections' },
            { id: 'gram-schmidt', title: 'The Gram-Schmidt Process' },
        ]
    }),
];
