
import { type Topic } from './types';
import { createTopic } from './utils';

const PATH_PREFIX = 'linear-algebra-for-quantitative-finance';

export const linearAlgebraPart1: Topic[] = [
    // --- Module 1 ---
    createTopic({
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
        parent: 'la-module-1',
        title: 'Matrix Operations',
        icon: 'Waypoints',
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
        parent: 'la-module-1',
        title: 'Determinant (Geometric Meaning) 📐',
        icon: 'Waypoints',
        description: "Understanding how transformations scale space.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'determinant-intro', title: 'Introduction' },
            { id: 'determinant-properties', title: 'Properties' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Change of Basis / Coordinate Systems',
        icon: 'Waypoints',
        description: "Viewing vectors in different reference frames.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'change-of-basis-intro', title: 'Introduction' },
            { id: 'change-of-basis-matrix', title: 'Change of Basis Matrix' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Linear Independence',
        icon: 'Waypoints',
        description: "Crucial for diversification and factor models.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'lin-indep-definition', title: 'Defining Linear Independence' },
            { id: 'spanning-sets', title: 'Spanning Sets' },
            { id: 'basis-and-dimension', title: 'Basis and Dimension' },
        ]
    }),

    // --- Module 2 ---
     createTopic({
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
     createTopic({
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
];
