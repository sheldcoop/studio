
import { type Topic } from './types';
import { createTopic } from './utils';

export const machineLearningPart3: Topic[] = [
  // --- Module 4: NLP for Alpha Generation ---
  createTopic({
    id: 'ml-financial-sentiment-analysis',
    parent: 'ml-module-4',
    title: 'Financial Sentiment Analysis (News, Earnings Reports, Tweets)',
    duration: 35,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-financial-sentiment-analysis-news-earnings-reports-tweets-theory', title: 'Core Theory' },
        { id: 'ml-financial-sentiment-analysis-news-earnings-reports-tweets-application', title: 'Financial Application' },
        { id: 'ml-financial-sentiment-analysis-news-earnings-reports-tweets-interactive', title: 'Interactive Demo' },
        { id: 'ml-financial-sentiment-analysis-news-earnings-reports-tweets-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-information-extraction',
    parent: 'ml-module-4',
    title: 'Information Extraction (NER, Topic Modeling)',
    duration: 30,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-information-extraction-ner-topic-modeling-theory', title: 'Core Theory' },
        { id: 'ml-information-extraction-ner-topic-modeling-application', title: 'Financial Application' },
        { id: 'ml-information-extraction-ner-topic-modeling-interactive', title: 'Interactive Demo' },
        { id: 'ml-information-extraction-ner-topic-modeling-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-advanced-text-representation',
    parent: 'ml-module-4',
    title: 'Advanced Text Representation (Word2Vec, Transformers - BERT)',
    duration: 25,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-advanced-text-representation-word2vec-transformers-bert-theory', title: 'Core Theory' },
        { id: 'ml-advanced-text-representation-word2vec-transformers-bert-application', title: 'Financial Application' },
        { id: 'ml-advanced-text-representation-word2vec-transformers-bert-interactive', title: 'Interactive Demo' },
        { id: 'ml-advanced-text-representation-word2vec-transformers-bert-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-integrating-nlp-signals',
    parent: 'ml-module-4',
    title: 'Integrating NLP Signals into Trading Models',
    duration: 25,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-integrating-nlp-signals-into-trading-models-theory', title: 'Core Theory' },
        { id: 'ml-integrating-nlp-signals-into-trading-models-application', title: 'Financial Application' },
        { id: 'ml-integrating-nlp-signals-into-trading-models-interactive', title: 'Interactive Demo' },
        { id: 'ml-integrating-nlp-signals-into-trading-models-problems', title: 'Practice Problems' },
    ]
  }),

  // --- Module 5: Advanced Topics & Modern Frontiers ---
  createTopic({
    id: 'ml-reinforcement-learning-for-trading',
    parent: 'ml-module-5',
    title: 'Reinforcement Learning for Optimal Trading',
    duration: 40,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-reinforcement-learning-for-optimal-trading-theory', title: 'Core Theory' },
        { id: 'ml-reinforcement-learning-for-optimal-trading-application', title: 'Financial Application' },
        { id: 'ml-reinforcement-learning-for-optimal-trading-interactive', title: 'Interactive Demo' },
        { id: 'ml-reinforcement-learning-for-optimal-trading-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-portfolio-optimization',
    parent: 'ml-module-5',
    title: 'Portfolio Optimization with ML (Covariance Estimation)',
    duration: 35,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-portfolio-optimization-with-ml-covariance-estimation-theory', title: 'Core Theory' },
        { id: 'ml-portfolio-optimization-with-ml-covariance-estimation-application', title: 'Financial Application' },
        { id: 'ml-portfolio-optimization-with-ml-covariance-estimation-interactive', title: 'Interactive Demo' },
        { id: 'ml-portfolio-optimization-with-ml-covariance-estimation-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-alternative-data',
    parent: 'ml-module-5',
    title: 'Leveraging Alternative Data (Satellite Imagery, Web Data)',
    duration: 35,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-leveraging-alternative-data-satellite-imagery-web-data-theory', title: 'Core Theory' },
        { id: 'ml-leveraging-alternative-data-satellite-imagery-web-data-application', title: 'Financial Application' },
        { id: 'ml-leveraging-alternative-data-satellite-imagery-web-data-interactive', title: 'Interactive Demo' },
        { id: 'ml-leveraging-alternative-data-satellite-imagery-web-data-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-ai-ethics-and-regulation',
    parent: 'ml-module-5',
    title: 'AI Ethics & Regulation in Finance',
    duration: 30,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-ai-ethics-regulation-in-finance-theory', title: 'Core Theory' },
        { id: 'ml-ai-ethics-regulation-in-finance-application', title: 'Financial Application' },
        { id: 'ml-ai-ethics-regulation-in-finance-interactive', title: 'Interactive Demo' },
        { id: 'ml-ai-ethics-regulation-in-finance-problems', title: 'Practice Problems' },
    ]
  }),
];
