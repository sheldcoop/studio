
import { type Topic } from './types';
import { createTopic } from './utils';

export const linearAlgebraPart1: Topic[] = [
    // --- Module 1 ---
    createTopic({
        parent: 'la-module-1',
        title: 'The Two Views of a Vector',
        icon: 'Waypoints',
        description: "Vectors as geometric arrows vs. vectors as ordered lists of numbers (the data science view).",
        category: 'sub-topic',
        duration: 15,
        status: 'completed',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Vector Operations',
        icon: 'Waypoints',
        description: "Addition, subtraction (tip-to-tail rule), and scalar multiplication (stretching/shrinking).",
        category: 'sub-topic',
        duration: 20,
        status: 'in-progress',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'The Dot Product, Norms, and Angles',
        icon: 'Waypoints',
        description: "The dot product as a measure of 'projection' or 'agreement.' L1 and L2 norms as measures of length/magnitude. Cosine similarity as a practical application.",
        category: 'sub-topic',
        duration: 25,
        status: 'not-started',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Orthogonality',
        icon: 'Waypoints',
        description: "The concept of perpendicular vectors (dot product = 0) and its meaning: independence.",
        category: 'sub-topic',
        duration: 20,
        status: 'not-started',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'The Two Views of a Matrix',
        icon: 'Waypoints',
        description: "A matrix as a container for data (a collection of vectors) vs. a matrix as a linear transformation that moves, rotates, and scales space.",
        category: 'sub-topic',
        duration: 15,
        status: 'not-started',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Matrix Operations',
        icon: 'Waypoints',
        description: "Addition, scalar multiplication, and the transpose.",
        category: 'sub-topic',
        duration: 20,
        status: 'not-started',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Matrix Multiplication',
        icon: 'Waypoints',
        description: "Taught not just as a rule, but as the composition of linear transformations. This explains why AB ≠ BA.",
        category: 'sub-topic',
        duration: 25,
        status: 'not-started',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Special Matrices',
        icon: 'Waypoints',
        description: "Identity matrix (the 'do nothing' operation), inverse matrix (the 'undo' operation), diagonal, triangular, and symmetric matrices.",
        category: 'sub-topic',
        duration: 20,
        status: 'not-started',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Linear Combinations and Span',
        icon: 'Waypoints',
        description: "What can you build with a set of vectors?",
        category: 'sub-topic',
        duration: 20,
        status: 'not-started',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Linear Independence',
        icon: 'Waypoints',
        description: "Identifying and removing redundant vectors.",
        category: 'sub-topic',
        duration: 20,
        status: 'not-started',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Basis and Dimension',
        icon: 'Waypoints',
        description: "The minimal set of vectors needed to define a space and the concept of its dimension.",
        category: 'sub-topic',
        duration: 25,
        status: 'not-started',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Vector Spaces and Subspaces',
        icon: 'Waypoints',
        description: "Formalizing these concepts. A subspace as a 'plane' or 'line' within a higher-dimensional space that passes through the origin.",
        category: 'sub-topic',
        duration: 25,
        status: 'not-started',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),

    // --- Module 2 ---
     createTopic({
        parent: 'la-module-2',
        title: 'Systems of Linear Equations',
        icon: 'Waypoints',
        description: "The mathematical basis for linear regression.",
        category: 'sub-topic',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
     createTopic({
        parent: 'la-module-2',
        title: 'Orthogonality & Projections',
        icon: 'Waypoints',
        description: "The core of Ordinary Least Squares (OLS) regression.",
        category: 'sub-topic',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
     createTopic({
        parent: 'la-module-2',
        title: 'The Four Fundamental Subspaces',
        icon: 'Waypoints',
        description: "Understand the complete picture of a matrix.",
        category: 'sub-topic',
        subTopics: [
            { id: 'theory', title: 'Core Theory' },
            { id: 'application', title: 'Financial Application' },
            { id: 'interactive', title: 'Interactive Demo' },
            { id: 'problems', title: 'Practice Problems' },
        ]
    }),
];
