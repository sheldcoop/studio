
import { type Topic } from './types';
import { createTopic } from './utils';
import { matrixOperationsTheory } from './matrix-operations';

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
        subTopics: matrixOperationsTheory
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Determinant (Geometric Meaning) 📐',
        icon: 'Waypoints',
        description: "Understanding how transformations scale space.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        animation: 'determinant',
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
    createTopic({
        parent: 'la-module-1',
        id: 'vector-projection',
        title: 'Vector Projection: The Story of a Shadow',
        icon: 'Waypoints',
        description: "Decomposing vectors into orthogonal components.",
        category: 'sub-topic',
        pathPrefix: 'quantlab', // To use the /quantlab/ route
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
            { id: 'gaussian-elimination-intro', title: 'Intro to Gaussian Elimination' },
            { id: 'solving-systems', title: 'Solving Systems of Equations' },
        ]
    }),
    createTopic({
        id: 'gaussian-elimination',
        parent: 'la-module-2',
        title: 'Gaussian Elimination: A Dance of Lines',
        icon: 'Waypoints',
        description: "An interactive visualizer for row operations.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
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
        ]
    }),
    createTopic({
        id: 'gram-schmidt-orthogonalization',
        parent: 'la-module-2',
        title: 'Gram-Schmidt: The Art of Tidying Up',
        icon: 'Waypoints',
        description: "An interactive visualizer for creating an orthogonal basis.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
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
