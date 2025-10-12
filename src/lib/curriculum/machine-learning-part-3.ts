
import { type Topic } from './types';
import { createTopic } from './utils';

export const machineLearningPart3: Topic[] = [
  // --- Module 4: NLP for Alpha Generation ---
  createTopic({
    parent: 'ml-module-4',
    title: 'Financial Sentiment Analysis (News, Earnings Reports, Tweets)',
    duration: 35,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-4',
    title: 'Information Extraction (NER, Topic Modeling)',
    duration: 30,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-4',
    title: 'Advanced Text Representation (Word2Vec, Transformers - BERT)',
    duration: 25,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-4',
    title: 'Integrating NLP Signals into Trading Models',
    duration: 25,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),

  // --- Module 5: Advanced Topics & Modern Frontiers ---
  createTopic({
    parent: 'ml-module-5',
    title: 'Reinforcement Learning for Optimal Trading',
    duration: 40,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-5',
    title: 'Portfolio Optimization with ML (Covariance Estimation)',
    duration: 35,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-5',
    title: 'Leveraging Alternative Data (Satellite Imagery, Web Data)',
    duration: 35,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-5',
    title: 'AI Ethics & Regulation in Finance',
    duration: 30,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
];
