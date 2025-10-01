
import { FunctionSquare } from 'lucide-react';
import { type Topic } from './types';

// Helper to create slugs from titles
const toSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const createTopic = (module: string, title: string, description: string): Topic => ({
    id: `stats-${toSlug(title)}`,
    title,
    href: `/statistics/${toSlug(title)}`,
    icon: FunctionSquare,
    description,
    category: 'sub-topic',
    parent: module,
});

export const statisticsHomepageTopics: Topic[] = [
    // --- Module 1: Foundations in Probability & Random Variables ---
    createTopic('stats-mod-1', 'Set Theory, Sample Spaces, and Events', 'Understanding the building blocks of probability.'),
    createTopic('stats-mod-1', "Axioms of Probability (Kolmogorov)", 'The three fundamental rules that govern all of probability.'),
    createTopic('stats-mod-1', 'Conditional Probability and Independence', 'How the occurrence of one event affects another.'),
    createTopic('stats-mod-1', "Law of Total Probability and Bayes' Theorem", 'Updating your beliefs in the face of new evidence.'),
    createTopic('stats-mod-1', 'Probability Mass Functions (PMF) and Cumulative Distribution Functions (CDF)', 'Describing the probabilities of discrete outcomes.'),
    createTopic('stats-mod-1', 'Expected Value E[X], Variance Var[X], and Standard Deviation', 'Calculating the center and spread of a random variable.'),
    createTopic('stats-mod-1', 'Common Discrete Distributions (Binomial, Poisson, Geometric)', 'Exploring key models for discrete random events.'),
    createTopic('stats-mod-1', 'Moment Generating Functions (MGFs) for Discrete R.V.s', 'A powerful tool for analyzing distributions.'),
    createTopic('stats-mod-1', 'Probability Density Functions (PDF) and CDF', 'Describing the probabilities of continuous outcomes.'),
    createTopic('stats-mod-1', 'Expected Value and Variance via Integration', 'Applying calculus to find the moments of continuous variables.'),
    createTopic('stats-mod-1', 'Common Continuous Distributions (Uniform, Exponential, Gamma)', 'Exploring key models for continuous random events.'),
    createTopic('stats-mod-1', 'MGFs for Continuous R.V.s', 'Extending moment generating functions to continuous cases.'),
    createTopic('stats-mod-1', 'Joint PMFs and Joint PDFs', 'Modeling the behavior of multiple random variables at once.'),
    createTopic('stats-mod-1', 'Marginal and Conditional Distributions', "Isolating one variable's behavior from a joint distribution."),
    createTopic('stats-mod-1', 'Covariance Cov(X, Y) and Correlation ρ', 'Measuring how two random variables move together.'),
    createTopic('stats-mod-1', 'Independence of Random Variables', 'Defining when two variables have no influence on each other.'),

    // --- Module 2: Key Distributions & Asymptotic Theory ---
    createTopic('stats-mod-2', 'Properties of the Normal Distribution and the Z-Score', 'Mastering the bell curve and standardization.'),
    createTopic('stats-mod-2', 'Linear Combinations of Independent Normal Random Variables', 'Understanding how normal variables combine.'),
    createTopic('stats-mod-2', 'Multivariate Normal Distribution', 'The cornerstone of modern portfolio theory.'),
    createTopic('stats-mod-2', 'Marginal and Conditional Distributions of Multivariate Normal', 'Dissecting multi-asset models.'),
    createTopic('stats-mod-2', 'Applications in Portfolio Theory and Financial Modeling', 'Putting the multivariate normal to practical use.'),
    createTopic('stats-mod-2', "The t-Distribution (Student's t)", 'The essential tool for inference with small samples.'),
    createTopic('stats-mod-2', 'The χ² (Chi-Squared) Distribution', 'The basis for tests of variance and goodness-of-fit.'),
    createTopic('stats-mod-2', 'The F-Distribution (Fisher–Snedecor)', 'The key to comparing variances between two groups (ANOVA).'),
    createTopic('stats-mod-2', 'Convergence in Probability and the Weak Law of Large Numbers (WLLN)', 'Why casino averages are so stable.'),
    createTopic('stats-mod-2', 'Convergence in Distribution and the Central Limit Theorem (CLT)', 'Why the normal distribution is everywhere.'),
    createTopic('stats-mod-2', "Slutsky's Theorem and the Delta Method", 'Tools for approximating the distribution of functions of random variables.'),
    
    // --- Module 3: Statistical Inference & Estimation Theory ---
    createTopic('stats-mod-3', 'Definition of a Statistic and an Estimator', 'Distinguishing between a function of data and a guess for a parameter.'),
    createTopic('stats-mod-3', 'Unbiasedness, Bias, and Asymptotic Unbiasedness', 'Evaluating the accuracy of estimators.'),
    createTopic('stats-mod-3', 'Efficiency and the Cramér-Rao Lower Bound (CRLB)', 'Finding the "best" possible unbiased estimator.'),
    createTopic('stats-mod-3', 'Consistency and Sufficiency', 'Properties of estimators that improve with more data.'),
    createTopic('stats-mod-3', 'Method of Moments (MoM) Estimation', 'A straightforward technique for finding estimators.'),
    createTopic('stats-mod-3', 'Maximum Likelihood Estimation (MLE)', 'The most important method for parameter estimation in finance.'),
    createTopic('stats-mod-3', 'Finding MLE Estimates via Optimization', 'The practical side of implementing MLE.'),
    createTopic('stats-mod-3', 'General Construction of Confidence Intervals (CIs)', 'A framework for creating intervals for any parameter.'),
    createTopic('stats-mod-3', 'Deriving CIs for Mean and Variance', 'Using t, χ², and Z pivotal quantities to build intervals.'),
    createTopic('stats-mod-3', 'Null vs. Alternative Hypotheses, Type I and II Errors', 'The fundamental setup of all hypothesis tests.'),
    createTopic('stats-mod-3', 'Neyman-Pearson Lemma for Optimal Tests', 'Finding the most powerful test for a given significance level.'),
    createTopic('stats-mod-3', "Likelihood Ratio Tests (LRT) and Wilks' Theorem", 'A general method for comparing nested models.'),
    createTopic('stats-mod-3', 'Testing with p-values and Critical Regions', 'The two equivalent approaches to making a statistical decision.'),
    
    // --- Module 4: Linear Modeling & Econometrics ---
    createTopic('stats-mod-4', 'Simple Linear Regression (SLR)', 'Modeling the relationship between two variables.'),
    createTopic('stats-mod-4', 'Derivation of the OLS Estimators', 'The calculus behind finding the "best fit" line.'),
    createTopic('stats-mod-4', 'Properties of the Fitted Model (R-Squared, Residuals)', 'Assessing how well your linear model fits the data.'),
    createTopic('stats-mod-4', 'Multiple Linear Regression (MLR) in Matrix Form', 'Extending SLR to multiple predictors using linear algebra.'),
    createTopic('stats-mod-4', 'Derivation of the MLR OLS Estimator', 'The matrix algebra for solving a multiple regression problem.'),
    createTopic('stats-mod-4', 'Gauss-Markov Theorem and the BLUE Property', 'The theoretical justification for using OLS.'),
    createTopic('stats-mod-4', 't-tests for Individual Coefficients', 'Testing the significance of a single predictor.'),
    createTopic('stats-mod-4', 'F-tests for Joint Hypotheses and Overall Model Significance', 'Testing the significance of a group of predictors or the entire model.'),
    createTopic('stats-mod-4', 'Model Assumptions (Linearity, Exogeneity, Homoskedasticity)', 'The critical assumptions that must hold for OLS to be valid.'),
    createTopic('stats-mod-4', 'Multicollinearity and Variance Inflation Factor (VIF)', 'Diagnosing when predictors are too correlated with each other.'),
    createTopic('stats-mod-4', 'Heteroskedasticity: Detection and Robust Standard Errors', 'Handling non-constant variance in the error terms.'),
    createTopic('stats-mod-4', 'Autocorrelation: Durbin-Watson Test', 'Detecting patterns in the error terms over time.'),

    // --- Module 5: Time Series Analysis & Computational Methods ---
    createTopic('stats-mod-5', 'Characteristics of Time Series: Trend, Seasonality, Cycles', 'Decomposing the components of a time series.'),
    createTopic('stats-mod-5', 'Strict vs. Weak Stationarity', 'The most important property for modeling time series data.'),
    createTopic('stats-mod-5', 'Autocorrelation Function (ACF) and Partial Autocorrelation Function (PACF)', 'The key tools for identifying the structure of a time series.'),
    createTopic('stats-mod-5', 'ARIMA Models', 'A class of models for forecasting time series data.'),
    createTopic('stats-mod-5', 'GARCH Models for Volatility', 'Modeling the changing volatility of financial returns.'),
    createTopic('stats-mod-5', 'Monte Carlo Simulation for Pricing and Risk', 'Using random simulation to solve complex problems.'),
    createTopic('stats-mod-5', 'Bootstrapping for Estimating Standard Errors', 'A powerful resampling method for inference.'),
    createTopic('stats-mod-5', 'Jackknife Resampling Techniques', 'A related method for bias and variance estimation.'),
    createTopic('stats-mod-5', 'Introduction to Random Walks and Martingales', 'The mathematical foundation of efficient markets.'),
    createTopic('stats-mod-5', 'Geometric Brownian Motion (GBM)', 'The standard model for stock price paths.'),

    // --- Module 6: Advanced Quant Modeling & Numerical Methods ---
    createTopic('stats-mod-6', 'Generalized Linear Models (GLMs)', 'Extending linear models to non-normal data.'),
    createTopic('stats-mod-6', 'Logistic Regression for Binary Outcomes', 'Modeling probabilities, such as the probability of default.'),
    createTopic('stats-mod-6', 'Poisson Regression for Count Data', 'Modeling the frequency of events.'),
    createTopic('stats-mod-6', 'Ridge Regression (L2 Penalty)', "A technique to handle multicollinearity and prevent overfitting."),
    createTopic('stats-mod-6', 'LASSO Regression (L1 Penalty) for Feature Selection', 'A powerful method for automatically selecting important variables.'),
    createTopic('stats-mod-6', 'Cross-Validation for Hyperparameter Tuning', 'The gold standard for selecting model parameters.'),
    createTopic('stats-mod-6', 'Bayesian Inference: Priors, Likelihood, and Posteriors', 'An alternative framework for statistical inference.'),
    createTopic('stats-mod-6', 'Markov Chain Monte Carlo (MCMC)', 'The computational engine behind modern Bayesian analysis.'),
    createTopic('stats-mod-6', 'Numerical Optimization: Newton-Raphson & Gradient Descent', 'The algorithms that power MLE and machine learning.'),
    createTopic('stats-mod-6', 'Implementing OLS and MLE in Python/R', 'Practical coding examples of core statistical techniques.'),
];
