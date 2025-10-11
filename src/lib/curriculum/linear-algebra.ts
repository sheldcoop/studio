
import { type Topic } from './types';
import { linearAlgebraPart1 } from './linear-algebra-part-1';
import { linearAlgebraPart2 } from './linear-algebra-part-2';

export const linearAlgebraTopics: Topic[] = [
    // This is a special case to create a link to the standalone QuantLab page
    // from within the Learning Path structure.
    {
      id: 'matrix-decomposition-quantlab',
      title: 'Interactive: Matrix Decomposition',
      icon: 'Grid',
      description: "Interactively explore how matrices are factored into simpler components.",
      category: 'sub-topic',
      parent: 'la-module-1', 
      href: '/quantlab/linear-algebra/matrix-decomposition'
    },
    ...linearAlgebraPart1,
    ...linearAlgebraPart2,
];
