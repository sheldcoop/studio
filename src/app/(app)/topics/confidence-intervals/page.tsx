import {
  Calculator,
  BarChart3,
  AreaChart,
  BrainCircuit,
  CandlestickChart,
  Sigma,
  Pi,
  Cpu,
  LineChart,
  Boxes,
  type LucideIcon,
  FunctionSquare,
  FolderKanban
} from 'lucide-react';

export const taglines = [
  ['From Data to ', 'Insight'],
  ['From Insight to ', 'Model'],
  ['From Model to ', 'Signal'],
  ['From Signal to ', 'Trade'],
  ['From Trade to ', 'Alpha'],
  ['From Alpha to ', 'Mastery'],
];

export type LearningPath = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  lessons: {
    title:string;
    duration: number; // in minutes
    status: 'completed' | 'in-progress' | 'not-started';
  }[];
};

export const learningPaths: LearningPath[] = [
  {
    id: 'linear-algebra',
    title: 'Linear Algebra for Quants',
    icon: Calculator,
    description: 'Master vectors, matrices, and eigenvalues for financial modeling.',
    lessons: [
      { title: 'Vectors and Spaces', duration: 45, status: 'completed' },
      { title: 'Matrix Transformations', duration: 60, status: 'completed' },
      { title: 'Eigenvalues and Eigenvectors', duration: 75, status: 'in-progress' },
      { title: 'Principal Component Analysis (PCA)', duration: 90, status: 'not-started' },
    ],
  },
  {
    id: 'statistics',
    title: 'Advanced Statistics',
    icon: BarChart3,
    description: 'Deep dive into probability, distributions, and hypothesis testing.',
    lessons: [
        { title: 'Probability Theory', duration: 60, status: 'completed' },
        { title: 'Common Distributions', duration: 75, status: 'in-progress' },
        { title: 'Hypothesis Testing & P-Values', duration: 90, status: 'not-started' },
        { title: 'Bayesian Statistics Intro', duration: 60, status: 'not-started' },
    ],
  },
  {
    id: 'time-series',
    title: 'Time Series Analysis',
    icon: AreaChart,
    description: 'Learn to model and forecast financial time series data.',
    lessons: [
        { title: 'AR, MA, ARMA, ARIMA Models', duration: 75, status: 'completed' },
        { title: 'Stationarity and Cointegration', duration: 60, status: 'not-started' },
        { title: 'ARCH/GARCH Models', duration: 60, status: 'not-started' },
        { title: 'Forecasting Techniques', duration: 45, status: 'not-started' },
    ],
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning in Finance',
    icon: BrainCircuit,
    description: 'Apply ML algorithms to trading, risk, and asset management.',
    lessons: [
        { title: 'Supervised vs. Unsupervised', duration: 45, status: 'in-progress' },
        { title: 'Regression and Classification', duration: 90, status: 'not-started' },
        { title: 'Intro to Neural Networks', duration: 75, status: 'not-started' },
        { title: 'Feature Engineering for Finance', duration: 60, status: 'not-started' },
    ],
  },
  {
    id: 'algo-trading',
    title: 'Algorithmic Trading Strategies',
    icon: CandlestickChart,
    description: 'Design, backtest, and deploy automated trading strategies.',
    lessons: [
        { title: 'Strategy Backtesting', duration: 90, status: 'not-started' },
        { title: 'Risk Management in Algo Trading', duration: 60, status: 'not-started' },
        { title: 'Execution and Slippage', duration: 45, status: 'not-started' },
        { title: 'Mean Reversion Strategies', duration: 75, status: 'not-started' },
    ],
  },
];

export const quantTopics = [
  { value: 'Linear Algebra', label: 'Linear Algebra' },
  { value: 'Calculus', label: 'Calculus' },
  { value: 'Probability Theory', label: 'Probability Theory' },
  { value: 'Statistics', label: 'Statistics' },
  { value: 'Stochastic Processes', label: 'Stochastic Processes' },
  { value: 'Time Series Analysis', label: 'Time Series Analysis' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Options Pricing', label: 'Options Pricing' },
  { value: 'Risk Management', label: 'Risk Management' },
  { value: 'Algorithmic Trading', label: 'Algorithmic Trading' },
  { value: 'Portfolio Management', label: 'Portfolio Management' },
];


export type CommunityPost = {
    id: string;
    topic: string;
    author: string;
    replies: number;
    views: number;
    lastPost: {
        author: string;
        time: string;
    };
};

export const communityPosts: CommunityPost[] = [
    {
        id: '1',
        topic: 'Best resources for understanding Ito\'s Lemma?',
        author: 'newbie_quant',
        replies: 12,
        views: 125,
        lastPost: { author: 'quant_master', time: '2 hours ago' },
    },
    {
        id: '2',
        topic: 'PCA for Pairs Trading - Does it work?',
        author: 'algo_trader_88',
        replies: 8,
        views: 98,
        lastPost: { author: 'stat_arb_king', time: '5 hours ago' },
    },
    {
        id: '3',
        topic: 'Interview Experience at Jane Street (First Round)',
        author: 'future_hf_trader',
        replies: 25,
        views: 543,
        lastPost: { author: 'jane_street_alum', time: '1 day ago' },
    },
    {
        id: '4',
        topic: 'Python vs C++ for high-frequency trading',
        author: 'speed_demon',
        replies: 42,
        views: 890,
        lastPost: { author: 'c++_purist', time: '1 day ago' },
    },
    {
        id: '5',
        topic: 'GARCH model implementation query',
        author: 'volatility_smile',
        replies: 5,
        views: 67,
        lastPost: { author: 'econometrics_wiz', time: '2 days ago' },
    },
];

export const quantJourney = [
  {
    id: 'linear-algebra',
    title: 'Linear Algebra',
    description: 'Vectors, matrices, and tensors. The language of data.',
    icon: Pi,
    href: '/topics/linear-algebra',
  },
  {
    id: 'stats-prob',
    title: 'Statistics & Probability',
    description: 'Quantifying uncertainty and making sense of distributions.',
    icon: Sigma,
    href: '/topics/hypothesis-testing-p-values',
  },
  {
    id: 'mental-math',
    title: 'Mental Math',
    description: 'Train your calculation speed and accuracy for interviews.',
    icon: BrainCircuit,
    href: '/topics/mental-math',
  },
  {
    id: 'time-series',
    title: 'Time Series Analysis',
    description: 'ARIMA, GARCH, and forecasting market movements.',
    icon: LineChart,
    href: '/topics/time-series',
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Building predictive models for financial markets.',
    icon: Cpu,
    href: '/topics/machine-learning',
  },
  {
    id: 'algo-trading',
    title: 'Algorithmic Trading',
    description: 'From strategy backtesting to live deployment.',
    icon: CandlestickChart,
    href: '/topics/algo-trading',
  },
  {
    id: 'stat-toolkit',
    title: "Statistician's Toolkit",
    description: 'Interactive tools for hands-on statistical analysis.',
    icon: Boxes,
    href: '/topics/stat-toolkit',
  },
];

export const statsToolkitTiers = [
  {
    title: 'Tier 1: The Absolute Foundations',
    concepts: [
      { name: 'Descriptive Statistics Explorer', slug: 'descriptive-statistics-explorer' },
      { name: 'The Normal Distribution', slug: 'normal-distribution' },
      { name: 'The Central Limit Theorem (CLT)', slug: 'central-limit-theorem' },
      { name: 'Confidence Intervals', slug: 'ci' },
      { name: 'Hypothesis Testing & P-Values', slug: 'hypothesis-testing-p-values' },
      { name: 'Type I & Type II Errors', slug: 'type-i-and-type-ii-errors' },
      { name: 'Correlation vs. Causation', slug: 'correlation-vs-causation' },
      { name: 'Linear Regression', slug: 'linear-regression' },
      { name: 'Standard Deviation & Variance', slug: 'standard-deviation-variance' },
      { name: 'R-squared & Goodness of Fit', slug: 'r-squared-goodness-of-fit' },
    ],
  },
  {
    title: 'Tier 2: Intermediate & Specialized Tools',
    concepts: [
      { name: 'Bayes\' Theorem', slug: 'bayes-theorem' },
      { name: 'The Law of Large Numbers', slug: 'law-of-large-numbers' },
      { name: 'Binomial Distribution', slug: 'binomial-distribution' },
      { name: 'Poisson Distribution', slug: 'poisson-distribution' },
      { name: 'Chi-Squared Test', slug: 'chi-squared-test' },
      { name: 'Analysis of Variance (ANOVA)', slug: 'anova' },
      { name: 'Logistic Regression', slug: 'logistic-regression' },
      { name: 'Moment Generating Functions', slug: 'moment-generating-functions' },
      { name: 'Maximum Likelihood Estimation (MLE)', slug: 'maximum-likelihood-estimation' },
    ],
  },
  {
    title: 'Tier 3: Advanced & Quant-Specific Concepts',
    concepts: [
      { name: 'Monte Carlo Simulation', slug: 'monte-carlo-simulation' },
      { name: 'Time Series Decomposition', slug: 'time-series-decomposition' },
      { name: 'Autocorrelation (ACF & PACF)', slug: 'autocorrelation-acf-pacf' },
      { name: 'Volatility & Standard Deviation (GARCH)', slug: 'volatility-garch' },
      { name: 'Efficient Frontier & Sharpe Ratio', slug: 'efficient-frontier-sharpe-ratio' },
      { name: 'Principal Component Analysis (PCA)', slug: 'principal-component-analysis-pca' },
      { name: 'Kalman Filters', slug: 'kalman-filters' },
      { name: 'Stochastic Calculus & Ito\'s Lemma', slug: 'stochastic-calculus-itos-lemma' },
    ],
  },
];