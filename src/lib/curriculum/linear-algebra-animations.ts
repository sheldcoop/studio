
import { type Topic } from './types';
import { createTopic } from './utils';

export const linearAlgebraAnimationTopics: Topic[] = [
    createTopic({
        parent: 'la-anim-module-1',
        id: 'visualizing-determinant',
        href: '/linear-algebra-animations/visualizing-determinant',
        title: 'Visualizing the Determinant',
        icon: 'BoxSelect',
        description: 'An interactive visualization of how a matrix transforms space and how the determinant measures this change.',
        category: 'sub-topic',
        duration: 20,
    }),
];
