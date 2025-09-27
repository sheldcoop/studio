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
  FolderKanban,
  FileJson,
  Waypoints
} from 'lucide-react';

export const taglines = [
  ['From Data to ', 'Insight'],
  ['From Insight to ', 'Model'],
  ['From Model to ', 'Signal'],
  ['From Signal to ', 'Trade'],
  ['From Trade to ', 'Alpha'],
  ['From Alpha to ', 'Mastery'],
];

export type Topic = {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  category: 'main' | 'sub-topic' | 'parametric' | 'non-parametric' | 'parent';
  parent?: string; // id of parent topic
  status?: 'completed' | 'in-progress' | 'not-started';
  duration?: number; // in minutes
};


export const allTopics: Topic[] = [
  // Main Topics (for homepage cards)
  {
    id: 'linear-algebra',
    title: 'Linear Algebra',
    description: 'Vectors, matrices, and tensors. The language of data.',
    icon: Pi,
    href: '/topics/linear-algebra',
    category: 'main',
  },
  {
    id: 'stats-prob',
    title: 'Statistics & Probability',
    description: 'Quantifying uncertainty and making sense of distributions.',
    icon: Sigma,
    href: '/topics/hypothesis-testing-p-values',
    category: 'main',
  },
  {
    id: 'mental-math',
    title: 'Mental Math',
    description: 'Train your calculation speed and accuracy for interviews.',
    icon: BrainCircuit,
    href: '/topics/mental-math',
    category: 'main',
  },
  {
    id: 'time-series',
    title: 'Time Series Analysis',
    description: 'ARIMA, GARCH, and forecasting market movements.',
    icon: LineChart,
    href: '/topics/time-series',
    category: 'main',
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Building predictive models for financial markets.',
    icon: Cpu,
    href: '/topics/machine-learning',
    category: 'main',
  },
  {
    id: 'algo-trading',
    title: 'Algorithmic Trading',
    description: 'From strategy backtesting to live deployment.',
    icon: CandlestickChart,
    href: '/topics/algo-trading',
    category: 'main',
  },
  {
    id: 'stat-toolkit',
    title: "Statistician's Toolkit",
    description: 'Interactive tools for hands-on statistical analysis.',
    icon: Boxes,
    href: '/topics/stat-toolkit',
    category: 'main',
  },

  // Sub-topics for Linear Algebra
  { id: 'vectors-spaces', title: 'Vectors and Spaces', href: '/topics/vectors-and-spaces', icon: Waypoints, description: 'The fundamental building blocks.', category: 'sub-topic', parent: 'linear-algebra', status: 'completed', duration: 45 },
  { id: 'matrix-transformations', title: 'Matrix Transformations', href: '/topics/matrix-transformations', icon: FileJson, description: 'Learn how matrices act as functions.', category: 'sub-topic', parent: 'linear-algebra', status: 'completed', duration: 60 },
  { id: 'eigenvalues-eigenvectors', title: 'Eigenvalues and Eigenvectors', href: '/topics/eigenvalues-and-eigenvectors', icon: LineChart, description: 'Discover the "special" vectors.', category: 'sub-topic', parent: 'linear-algebra', status: 'in-progress', duration: 75 },
  { id: 'pca', title: 'Principal Component Analysis (PCA)', href: '/topics/principal-component-analysis-pca', icon: BrainCircuit, description: 'A powerful dimensionality reduction technique.', category: 'sub-topic', parent: 'linear-algebra', status: 'not-started', duration: 90 },

  // Parent "topic" for Hypothesis testing
  { id: 'hypothesis-testing-p-values', title: 'Hypothesis Testing & P-Values', href: '/topics/hypothesis-testing-p-values', icon: FunctionSquare, description: 'The detective work of data science.', category: 'sub-topic', parent: 'statistics' },

  // Parametric Tests (sub-topics of hypothesis testing)
  { id: 't-test', title: 'T-Test', href: '/topics/t-test', icon: FunctionSquare, description: 'Compares the means of two groups, assuming normal distribution.', category: 'parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'z-test', title: 'Z-Test', href: '/topics/z-test', icon: FunctionSquare, description: 'Compares means of large samples (n>30) with known population variance.', category: 'parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'anova', title: 'ANOVA', href: '/topics/anova', icon: FunctionSquare, description: 'Compares the averages of three or more groups.', category: 'parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'f-test', title: 'F-Test', href: '/topics/f-test', icon: FunctionSquare, description: 'Compares the variances (spread) of two or more groups.', category: 'parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'confidence-intervals', title: 'Confidence Intervals', href: '/topics/confidence-intervals', icon: FunctionSquare, description: 'Understanding the range where a true value likely lies.', category: 'parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'pearson-correlation', title: 'Pearson Correlation', href: '/topics/pearson-correlation', icon: FunctionSquare, description: 'Measures the linear relationship between two continuous variables.', category: 'parametric', parent: 'hypothesis-testing-p-values' },

  // Non-Parametric Tests (sub-topics of hypothesis testing)
  { id: 'mann-whitney-u-test', title: 'Mann-Whitney U Test', href: '/topics/mann-whitney-u-test', icon: FunctionSquare, description: 'Alternative to the T-Test when data is not normally distributed.', category: 'non-parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'kruskal-wallis-test', title: 'Kruskal-Wallis Test', href: '/topics/kruskal-wallis-test', icon: FunctionSquare, description: 'Alternative to ANOVA for comparing three or more groups.', category: 'non-parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'wilcoxon-signed-rank-test', title: 'Wilcoxon Signed-Rank Test', href: '/topics/wilcoxon-signed-rank-test', icon: FunctionSquare, description: 'Alternative to the paired T-Test for repeated measurements.', category: 'non-parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'spearmans-rank-correlation', title: "Spearman's Rank Correlation", href: '/topics/spearmans-rank-correlation', icon: FunctionSquare, description: 'Measures the monotonic relationship between two ranked variables.', category: 'non-parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'friedman-test', title: 'Friedman Test', href: '/topics/friedman-test', icon: FunctionSquare, description: 'The non-parametric alternative to a repeated-measures ANOVA.', category: 'non-parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'kolmogorov-smirnov-k-s-test', title: 'Kolmogorov-Smirnov (K-S) Test', href: '/topics/kolmogorov-smirnov-k-s-test', icon: FunctionSquare, description: 'Tests if a sample is drawn from a specific distribution.', category: 'non-parametric', parent: 'hypothesis-testing-p-values' },
  { id: 'chi-squared-test', title: 'Chi-Squared Test', href: '/topics/chi-squared-test', icon: FunctionSquare, description: 'Tests for association between two categorical variables.', category: 'non-parametric', parent: 'hypothesis-testing-p-values' },
  
  // Stat Toolkit Parent Categories
  { id: 'stats-foundations', title: 'Tier 1: The Absolute Foundations', href: '#', icon: FolderKanban, description: '', category: 'parent' },
  { id: 'stats-intermediate', title: 'Tier 2: Intermediate & Specialized Tools', href: '#', icon: FolderKanban, description: '', category: 'parent' },
  { id: 'stats-advanced', title: 'Tier 3: Advanced & Quant-Specific Concepts', href: '#', icon: FolderKanban, description: '', category: 'parent' },
  
  // Stat Toolkit Tier 1
  { id: 'descriptive-statistics-explorer', title: 'Descriptive Statistics Explorer', href: '/topics/descriptive-statistics-explorer', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-foundations' },
  { id: 'normal-distribution', title: 'The Normal Distribution', href: '/topics/normal-distribution', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-foundations' },
  { id: 'central-limit-theorem', title: 'The Central Limit Theorem (CLT)', href: '/topics/central-limit-theorem', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-foundations' },
  { id: 'ci', title: 'Confidence Intervals', href: '/topics/ci', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-foundations' },
  { id: 'type-i-and-type-ii-errors', title: 'Type I & Type II Errors', href: '/topics/type-i-and-type-ii-errors', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-foundations' },
  { id: 'correlation-vs-causation', title: 'Correlation vs. Causation', href: '/topics/correlation-vs-causation', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-foundations' },
  { id: 'linear-regression', title: 'Linear Regression', href: '/topics/linear-regression', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-foundations' },
  { id: 'standard-deviation-variance', title: 'Standard Deviation & Variance', href: '/topics/standard-deviation-variance', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-foundations' },
  { id: 'r-squared-goodness-of-fit', title: 'R-squared & Goodness of Fit', href: '/topics/r-squared-goodness-of-fit', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-foundations' },
  
  // Stat Toolkit Tier 2
  { id: 'bayes-theorem', title: "Bayes' Theorem", href: '/topics/bayes-theorem', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-intermediate' },
  { id: 'law-of-large-numbers', title: 'The Law of Large Numbers', href: '/topics/law-of-large-numbers', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-intermediate' },
  { id: 'binomial-distribution', title: 'Binomial Distribution', href: '/topics/binomial-distribution', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-intermediate' },
  { id: 'poisson-distribution', title: 'Poisson Distribution', href: '/topics/poisson-distribution', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-intermediate' },
  { id: 'logistic-regression', title: 'Logistic Regression', href: '/topics/logistic-regression', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-intermediate' },
  { id: 'moment-generating-functions', title: 'Moment Generating Functions', href: '/topics/moment-generating-functions', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-intermediate' },
  { id: 'maximum-likelihood-estimation', title: 'Maximum Likelihood Estimation (MLE)', href: '/topics/maximum-likelihood-estimation', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-intermediate' },

  // Stat Toolkit Tier 3
  { id: 'monte-carlo-simulation', title: 'Monte Carlo Simulation', href: '/topics/monte-carlo-simulation', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },
  { id: 'time-series-decomposition', title: 'Time Series Decomposition', href: '/topics/time-series-decomposition', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },
  { id: 'autocorrelation-acf-pacf', title: 'Autocorrelation (ACF & PACF)', href: '/topics/autocorrelation-acf-pacf', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },
  { id: 'volatility-garch', title: 'Volatility & Standard Deviation (GARCH)', href: '/topics/volatility-garch', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },
  { id: 'efficient-frontier-sharpe-ratio', title: 'Efficient Frontier & Sharpe Ratio', href: '/topics/efficient-frontier-sharpe-ratio', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },
  { id: 'kalman-filters', title: 'Kalman Filters', href: '/topics/kalman-filters', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },
  { id: 'stochastic-calculus-itos-lemma', title: "Stochastic Calculus & Ito's Lemma", href: '/topics/stochastic-calculus-itos-lemma', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },

];


export type LearningPath = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  lessons: Topic[];
};

export const learningPaths: LearningPath[] = [
  {
    id: 'linear-algebra',
    title: 'Linear Algebra for Quants',
    icon: Calculator,
    description: 'Master vectors, matrices, and eigenvalues for financial modeling.',
    lessons: allTopics.filter(t => t.parent === 'linear-algebra'),
  },
  {
    id: 'statistics',
    title: 'Advanced Statistics',
    icon: BarChart3,
    description: 'Deep dive into probability, distributions, and hypothesis testing.',
    lessons: [
      { id: 'prob-theory', title: 'Probability Theory', href: '/topics/probability-theory', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'statistics', status: 'completed', duration: 60 },
      { id: 'common-dist', title: 'Common Distributions', href: '/topics/common-distributions', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'statistics', status: 'in-progress', duration: 75 },
      allTopics.find(t => t.id === 'hypothesis-testing-p-values')!,
      { id: 'bayes-intro', title: 'Bayesian Statistics Intro', href: '/topics/bayesian-statistics-intro', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'statistics', status: 'not-started', duration: 60 },
    ].filter(Boolean) as Topic[],
  },
  {
    id: 'time-series',
    title: 'Time Series Analysis',
    icon: AreaChart,
    description: 'Learn to model and forecast financial time series data.',
    lessons: [
      { id: 'arma', title: 'AR, MA, ARMA, ARIMA Models', href: '/topics/arma-arima', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'time-series', status: 'completed', duration: 75 },
      { id: 'stationarity', title: 'Stationarity and Cointegration', href: '/topics/stationarity-cointegration', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'time-series', status: 'not-started', duration: 60 },
      { id: 'garch', title: 'ARCH/GARCH Models', href: '/topics/arch-garch', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'time-series', status: 'not-started', duration: 60 },
      { id: 'forecasting', title: 'Forecasting Techniques', href: '/topics/forecasting-techniques', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'time-series', status: 'not-started', duration: 45 },
    ],
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning in Finance',
    icon: BrainCircuit,
    description: 'Apply ML algorithms to trading, risk, and asset management.',
    lessons: [
      { id: 'supervised-unsupervised', title: 'Supervised vs. Unsupervised', href: '/topics/supervised-unsupervised', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'machine-learning', status: 'in-progress', duration: 45 },
      { id: 'regression-classification', title: 'Regression and Classification', href: '/topics/regression-classification', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'machine-learning', status: 'not-started', duration: 90 },
      { id: 'intro-neural-networks', title: 'Intro to Neural Networks', href: '/topics/intro-neural-networks', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'machine-learning', status: 'not-started', duration: 75 },
      { id: 'feature-engineering', title: 'Feature Engineering for Finance', href: '/topics/feature-engineering', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'machine-learning', status: 'not-started', duration: 60 },
    ],
  },
  {
    id: 'algo-trading',
    title: 'Algorithmic Trading Strategies',
    icon: CandlestickChart,
    description: 'Design, backtest, and deploy automated trading strategies.',
    lessons: [
        { id: 'backtesting', title: 'Strategy Backtesting', href: '/topics/strategy-backtesting', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'algo-trading', status: 'not-started', duration: 90 },
        { id: 'risk-management', title: 'Risk Management in Algo Trading', href: '/topics/risk-management-algo', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'algo-trading', status: 'not-started', duration: 60 },
        { id: 'execution-slippage', title: 'Execution and Slippage', href: '/topics/execution-slippage', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'algo-trading', status: 'not-started', duration: 45 },
        { id: 'mean-reversion-strategies', title: 'Mean Reversion Strategies', href: '/topics/mean-reversion-strategies', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'algo-trading', status: 'not-started', duration: 75 },
    ],
  },
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

export const quantJourney = allTopics.filter(topic => topic.category === 'main');
