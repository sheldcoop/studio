
import { type Topic } from './types';
import { createTopic } from './utils';

export const linearAlgebraAnimations: Topic[] = [
    createTopic({
        parent: 'la-anim-module-1',
        id: 'visualizing-determinant',
        title: 'Visualizing the Determinant',
        icon: 'BoxSelect',
        description: 'An interactive visualization of how a matrix transforms space and how the determinant measures this change.',
        category: 'sub-topic',
        duration: 10,
    }),
]
