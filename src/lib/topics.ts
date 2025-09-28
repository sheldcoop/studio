
import {
  Pi,
  Sigma,
  BrainCircuit,
  LineChart,
  Cpu,
  CandlestickChart,
  Boxes,
  Percent,
  Waypoints,
  FunctionSquare,
  FolderKanban,
  type LucideIcon,
} from 'lucide-react';

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
    id: 'linear-algebra-for-quantitative-finance',
    title: 'Linear Algebra',
    description: 'Vectors, matrices, and tensors. The language of data.',
    icon: Pi,
    href: '/paths/linear-algebra-for-quantitative-finance',
    category: 'main',
  },
  {
    id: 'statistics-for-quantitative-finance',
    title: 'Statistics',
    description: 'Quantifying uncertainty and making sense of distributions.',
    icon: Sigma,
    href: '/paths/statistics-for-quantitative-finance',
    category: 'main',
  },
  {
    id: 'probability',
    title: 'Probability',
    description: 'Understanding chance and modeling random events.',
    icon: Percent,
    href: '/topics/probability',
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
    id: 'time-series-analysis-for-quantitative-finance',
    title: 'Time Series Analysis',
    description: 'ARIMA, GARCH, and forecasting market movements.',
    icon: LineChart,
    href: '/paths/time-series-analysis-for-quantitative-finance',
    category: 'main',
  },
  {
    id: 'machine-learning-for-quantitative-finance',
    title: 'Machine Learning',
    description: 'Building predictive models for financial markets.',
    icon: Cpu,
    href: '/paths/machine-learning-for-quantitative-finance',
    category: 'main',
  },
  {
    id: 'algo-trading',
    title: 'Algorithmic Trading',
    description: 'From strategy backtesting to live deployment.',
    icon: CandlestickChart,
    href: '/paths/algo-trading',
    category: 'main',
  },
  {
    id: 'stat-toolkit',
    title: "Statistician's Toolkit",
    description: 'Interactive tools for hands-on statistical analysis.',
    icon: Boxes,
    href: '/stat-toolkit',
    category: 'main',
  },

  // --- Linear Algebra Path Topics ---
  { id: 'linear-equation-systems', title: 'Chapter 1: Linear Equation Systems', href: '/linear-algebra/linear-equation-systems', icon: Waypoints, description: 'What is a Linear System?, Geometric Interpretation in 2D and 3D, Solving Systems with Gaussian Elimination, Row Echelon Form (REF) and Reduced Row Echelon Form (RREF), Existence and Uniqueness of Solutions', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'basic-matrix-algebra', title: 'Chapter 2: Basic Matrix Algebra', href: '/linear-algebra/basic-matrix-algebra', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'determinants-and-lu-factorization', title: 'Chapter 3: Determinants and LU Factorization', href: '/linear-algebra/determinants-and-lu-factorization', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'vector-operations-and-linear-combinations', title: 'Chapter 4: Vector Operations and Linear Combinations', href: '/linear-algebra/vector-operations-and-linear-combinations', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'linear-independence-vector-spaces-and-subspaces', title: 'Chapter 5: Linear Independence, Vector Spaces, and Subspaces', href: '/linear-algebra/linear-independence-vector-spaces-and-subspaces', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'basis-dimension-and-four-fundamental-subspaces', title: 'Chapter 6: Basis, Dimension, and the Four Fundamental Subspaces', href: '/linear-algebra/basis-dimension-and-four-fundamental-subspaces', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'linear-transformations', title: 'Chapter 7: Linear Transformations', href: '/linear-algebra/linear-transformations', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'inner-products-and-orthogonality', title: 'Chapter 8: Inner Products and Orthogonality', href: '/linear-algebra/inner-products-and-orthogonality', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'gram-schmidt-process-and-qr-decomposition', title: 'Chapter 9: The Gram-Schmidt Process and QR Decomposition', href: '/linear-algebra/gram-schmidt-process-and-qr-decomposition', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'eigenvalues-and-eigenvectors', title: 'Chapter 10: Eigenvalues and Eigenvectors', href: '/linear-algebra/eigenvalues-and-eigenvectors', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'diagonalization-and-applications-to-dynamic-systems', title: 'Chapter 11: Diagonalization and Applications to Dynamic Systems', href: '/linear-algebra/diagonalization-and-applications-to-dynamic-systems', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'symmetric-matrices-quadratic-forms-cholesky-decomposition', title: 'Chapter 12: Symmetric Matrices, Quadratic Forms, and Cholesky Decomposition', href: '/linear-algebra/symmetric-matrices-quadratic-forms-cholesky-decomposition', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'singular-value-decomposition-svd', title: 'Chapter 13: The Singular Value Decomposition (SVD)', href: '/linear-algebra/singular-value-decomposition-svd', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'principal-component-analysis-pca', title: 'Chapter 14: Principal Component Analysis (PCA)', href: '/linear-algebra/principal-component-analysis-pca', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},
  { id: 'multivariate-normal-distribution', title: 'Chapter 15: The Multivariate Normal Distribution', href: '/linear-algebra/multivariate-normal-distribution', icon: Waypoints, description: '', category: 'sub-topic', parent: 'la-main-chapters'},

  
  // --- Statistics Topics ---

  // Parent "topic" for Hypothesis testing
  { id: 'hypothesis-testing-p-values', title: 'Hypothesis Testing & P-Values', href: '/hypothesis-testing-p-values', icon: FunctionSquare, description: 'The detective work of data science.', category: 'sub-topic', parent: 'statistics-for-quantitative-finance' },

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
  { id: 'volatility-garch', title: 'Volatility &amp; Standard Deviation (GARCH)', href: '/topics/volatility-garch', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },
  { id: 'efficient-frontier-sharpe-ratio', title: 'Efficient Frontier &amp; Sharpe Ratio', href: '/topics/efficient-frontier-sharpe-ratio', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },
  { id: 'kalman-filters', title: 'Kalman Filters', href: '/topics/kalman-filters', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },
  { id: 'stochastic-calculus-itos-lemma', title: "Stochastic Calculus &amp; Ito's Lemma", href: '/topics/stochastic-calculus-itos-lemma', icon: FunctionSquare, description: '', category: 'sub-topic', parent: 'stats-advanced' },

];
