import { FunctionSquare, FolderKanban } from 'lucide-react';
import type { Topic } from './types';

export const statisticsTopics: Topic[] = [
  // Parent "topic" for Hypothesis testing
  {
    id: 'hypothesis-testing',
    title: 'Hypothesis Testing',
    href: '/hypothesis-testing',
    icon: FunctionSquare,
    description: 'The detective work of data science.',
    category: 'sub-topic',
    parent: 'statistics-for-quantitative-finance',
  },

  // Parametric Tests (sub-topics of hypothesis testing)
  {
    id: 't-test',
    title: 'T-Test',
    href: '/topics/statistics/t-test',
    icon: FunctionSquare,
    description: 'Compares the means of two groups, assuming normal distribution.',
    category: 'parametric',
    parent: 'hypothesis-testing',
  },
  {
    id: 'z-test',
    title: 'Z-Test',
    href: '/topics/statistics/z-test',
    icon: FunctionSquare,
    description:
      'Compares means of large samples (n>30) with known population variance.',
    category: 'parametric',
    parent: 'hypothesis-testing',
  },
  {
    id: 'anova',
    title: 'ANOVA',
    href: '/topics/statistics/anova',
    icon: FunctionSquare,
    description: 'Compares the averages of three or more groups.',
    category: 'parametric',
    parent: 'hypothesis-testing',
  },
  {
    id: 'f-test',
    title: 'F-Test',
    href: '/topics/statistics/f-test',
    icon: FunctionSquare,
    description: 'Compares the variances (spread) of two or more groups.',
    category: 'parametric',
    parent: 'hypothesis-testing',
  },
  {
    id: 'pearson-correlation',
    title: 'Pearson Correlation',
    href: '/topics/statistics/pearson-correlation',
    icon: FunctionSquare,
    description:
      'Measures the linear relationship between two continuous variables.',
    category: 'parametric',
    parent: 'hypothesis-testing',
  },

  // Non-Parametric Tests (sub-topics of hypothesis testing)
  {
    id: 'mann-whitney-u-test',
    title: 'Mann-Whitney U Test',
    href: '/topics/statistics/mann-whitney-u-test',
    icon: FunctionSquare,
    description:
      'Alternative to the T-Test when data is not normally distributed.',
    category: 'non-parametric',
    parent: 'hypothesis-testing',
  },
  {
    id: 'kruskal-wallis-test',
    title: 'Kruskal-Wallis Test',
    href: '/topics/statistics/kruskal-wallis-test',
    icon: FunctionSquare,
    description: 'Alternative to ANOVA for comparing three or more groups.',
    category: 'non-parametric',
    parent: 'hypothesis-testing',
  },
  {
    id: 'wilcoxon-signed-rank-test',
    title: 'Wilcoxon Signed-Rank Test',
    href: '/topics/statistics/wilcoxon-signed-rank-test',
    icon: FunctionSquare,
    description:
      'Alternative to the paired T-Test for repeated measurements.',
    category: 'non-parametric',
    parent: 'hypothesis-testing',
  },
  {
    id: 'spearmans-rank-correlation',
    title: "Spearman's Rank Correlation",
    href: '/topics/statistics/spearmans-rank-correlation',
    icon: FunctionSquare,
    description:
      'Measures the monotonic relationship between two ranked variables.',
    category: 'non-parametric',
    parent: 'hypothesis-testing',
  },
  {
    id: 'friedman-test',
    title: 'Friedman Test',
    href: '/topics/statistics/friedman-test',
    icon: FunctionSquare,
    description:
      'The non-parametric alternative to a repeated-measures ANOVA.',
    category: 'non-parametric',
    parent: 'hypothesis-testing',
  },
  {
    id: 'kolmogorov-smirnov-k-s-test',
    title: 'Kolmogorov-Smirnov (K-S) Test',
    href: '/topics/statistics/kolmogorov-smirnov-k-s-test',
    icon: FunctionSquare,
    description: 'Tests if a sample is drawn from a specific distribution.',
    category: 'non-parametric',
    parent: 'hypothesis-testing',
  },
  {
    id: 'chi-squared-test',
    title: 'Chi-Squared Test',
    href: '/topics/statistics/chi-squared-test',
    icon: FunctionSquare,
    description: 'Tests for association between two categorical variables.',
    category: 'non-parametric',
    parent: 'hypothesis-testing',
  },

  // Stat Toolkit Parent Categories
  {
    id: 'stats-foundations',
    title: 'Tier 1: The Absolute Foundations',
    href: '#',
    icon: FolderKanban,
    description: '',
    category: 'parent',
  },
  {
    id: 'stats-intermediate',
    title: 'Tier 2: Intermediate & Specialized Tools',
    href: '#',
    icon: FolderKanban,
    description: '',
    category: 'parent',
  },
  {
    id: 'stats-advanced',
    title: 'Tier 3: Advanced & Quant-Specific Concepts',
    href: '#',
    icon: FolderKanban,
    description: '',
    category: 'parent',
  },
    
  // Stat Toolkit Tier 1
  {
    id: 'confidence-intervals',
    title: 'Confidence Intervals',
    href: '/topics/confidence-intervals',
    icon: FunctionSquare,
    description: 'Understanding the range where a true value likely lies.',
    category: 'sub-topic',
    parent: 'stats-foundations',
  },
   {
    id: 'z-table',
    title: 'Z-Table Calculator',
    href: '/topics/z-table',
    icon: FunctionSquare,
    description: 'Interactive Z-Table for Z-scores and probabilities.',
    category: 'sub-topic',
    parent: 'stats-foundations',
  },
  {
    id: 'descriptive-statistics-explorer',
    title: 'Descriptive Statistics Explorer',
    href: '/topics/statistics/descriptive-statistics-explorer',
    icon: FunctionSquare,
    description: 'Interactive guide to mean, median, mode, variance, skewness, and kurtosis.',
    category: 'sub-topic',
    parent: 'stats-foundations',
  },
  {
    id: 'normal-distribution',
    title: 'The Normal Distribution',
    href: '/topics/statistics/normal-distribution',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-foundations',
  },
  {
    id: 'central-limit-theorem',
    title: 'The Central Limit Theorem (CLT)',
    href: '/topics/central-limit-theorem',
    icon: FunctionSquare,
    description: 'Discover how order emerges from chaos.',
    category: 'sub-topic',
    parent: 'stats-foundations',
  },
  {
    id: 'type-i-and-type-ii-errors',
    title: 'Type I & Type II Errors',
    href: '/topics/type-i-and-type-ii-errors',
    icon: FunctionSquare,
    description: 'The trade-off between false alarms and missed signals.',
    category: 'sub-topic',
    parent: 'stats-foundations',
  },
  {
    id: 'correlation-vs-causation',
    title: 'Correlation vs. Causation',
    href: '/topics/correlation-vs-causation',
    icon: FunctionSquare,
    description: "Don't confuse association with influence.",
    category: 'sub-topic',
    parent: 'stats-foundations',
    content: `
      <div class="space-y-8">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="font-headline text-2xl font-semibold leading-none tracking-tight">The Quant's Golden Rule</h3>
          </div>
          <div class="p-6 pt-0 space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Correlation tells you that two variables tend to move in the same, opposite, or random directions. Causation means that a change in one variable <span class="font-bold text-primary">directly causes</span> a change in another. It's a simple distinction, but confusing them is one of the most common and dangerous mistakes in quantitative analysis and data science.
            </p>
            <p>
              A model built on a spurious (false) correlation may work for a while, but it will fail unpredictably because it hasn't captured a true underlying relationship.
            </p>
          </div>
        </div>
        
        <div role="alert" class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground border-destructive/50 text-destructive-foreground dark:border-destructive [&>svg]:text-destructive-foreground bg-destructive/5">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 18H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4h-2.5"/><path d="M15 14v2a2 2 0 0 0 2 2h4.5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-6.8a2 2 0 0 1-1.7-1L9.5 6H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2"/><path d="M12 18v-4.3c0-.8.5-1.5 1.2-1.8.8-.3 1.7 0 2.3.6l2 2.3c.6.7.6 1.7 0 2.3l-2 2.3c-.6.7-1.5 1-2.3.6-.7-.3-1.2-1-1.2-1.8Z"/></svg>
            <h5 class="mb-1 font-medium leading-none tracking-tight font-headline text-lg">A Classic (and Silly) Example</h5>
            <div class="text-sm [&_p]:leading-relaxed mt-2 text-base">
                <p class="mb-2">For years, a strong positive correlation was observed between ice cream sales and the number of shark attacks. As ice cream sales went up, so did shark attacks.</p>
                <p class="mb-4 font-semibold text-destructive-foreground/90">Does eating ice cream cause shark attacks?</p>
                <p>Of course not. The real cause is a third, hidden variable: <strong class="text-foreground">warm weather</strong>. When it's hot, more people go to the beach (increasing potential shark encounters) AND more people buy ice cream. The two are correlated, but one does not cause the other.</p>
                <div class="mt-4 rounded-md border border-destructive/20 bg-background/30 p-4 text-center">
                  <p class="font-medium">Warm Weather (Lurking Variable)</p>
                  <div class="flex items-center justify-center gap-4 text-2xl font-bold text-destructive-foreground/80">
                    <span>→</span>
                    <div class="flex-1 rounded-md bg-background/50 p-2">Ice Cream Sales ↑</div>
                    <span>and</span>
                     <div class="flex-1 rounded-md bg-background/50 p-2">Shark Attacks ↑</div>
                     <span>→</span>
                  </div>
                   <p class="mt-2 text-sm text-muted-foreground">Both ice cream sales and beach visits are driven by summer heat.</p>
                </div>
            </div>
        </div>

        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="flex flex-col space-y-1.5 p-6">
                <h3 class="font-headline text-2xl font-semibold leading-none tracking-tight">Why This Matters in Finance</h3>
                <p class="text-sm text-muted-foreground">Mistaking correlation for causation in finance can be an expensive lesson. Here are common traps.</p>
            </div>
            <div class="p-6 pt-0 space-y-8">
                <div>
                    <h4 class="font-semibold flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 text-primary"><path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-7-9.58"/><path d="M18.32 8.7a4 4 0 0 0-5.66 5.66"/><path d="m12 12-2 4 4-2 2-4-4 2z"/></svg> Machine Learning: The Data Leakage Trap</h4>
                    <p class="text-muted-foreground mt-1 text-sm">A data scientist is building a model to predict next-day returns. They find a feature called \`data_update_timestamp\` that has incredible predictive power. The model learns that if this timestamp is present, the next day's return will likely be negative. The correlation is extremely strong.</p>
                    <p class="mt-2 text-sm"><strong>The Hidden Cause:</strong> The \`data_update_timestamp\` was only added to the database system in 2008. The model has simply learned that "data from after 2008" correlates with returns. What really happened in 2008? The Global Financial Crisis. The model hasn't learned a predictive relationship; it has learned to identify a specific historical period of high volatility and negative returns. It will fail completely on data outside this context.</p>
                </div>

                 <div>
                    <h4 class="font-semibold flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 text-primary"><line x1="15" x2="15" y1="14" y2="20"/><line x1="9" x2="9" y1="10" y2="20"/><line x1="3" x2="3" y1="6" y2="20"/><path d="M21 4V10"/><path d="M21 16v4"/><path d="M15 4V8"/><path d="M9 4V6"/><path d="M3 4V2"/></svg> Finance: The Super Bowl Indicator</h4>
                    <p class="text-muted-foreground mt-1 text-sm">For decades, a surprisingly accurate "indicator" stated that if a team from the original National Football League (NFC) won the Super Bowl, the S&P 500 would have a positive return for the year. If a team from the American Football Conference (AFC) won, the market would be down.</p>
                    <p class="mt-2 text-sm">This is a textbook <strong class="text-foreground/90">spurious correlation</strong>. There is no plausible economic link between the winner of a football game and the complex global factors that drive stock market returns. It's a classic case of data mining—if you look at enough unrelated variables, you're bound to find some that correlate by pure chance. A strategy based on this would be no better than a coin flip over the long run.</p>
                </div>
                
                <div>
                    <h4 class="font-semibold flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-primary"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> The Hidden Variable (Lurking Variable)</h4>
                    <p class="text-muted-foreground mt-1 text-sm">Just like "warm weather" in our example, a hidden economic factor often drives two seemingly related assets. For example, the prices of luxury cars and high-end watches might be correlated. The lurking variable is <strong class="text-foreground/90">global wealth concentration</strong>. One doesn't cause the other; they are both driven by the same underlying factor.</p>
                </div>
                
                <div>
                    <h4 class="font-semibold flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 text-primary"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> Reverse Causality</h4>
                    <p class="text-muted-foreground mt-1 text-sm">Sometimes you have the relationship backward. For instance, you might observe that companies that spend more on advertising have higher sales. Does advertising cause higher sales, or do companies with high sales have more money to spend on advertising? The causal link might be the reverse of what you assume.</p>
                </div>
            </div>
        </div>
        
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm bg-primary/5 border-primary/20">
             <div class="flex flex-col space-y-1.5 p-6">
                <h3 class="font-headline flex items-center text-2xl font-semibold leading-none tracking-tight"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 text-primary"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>How to Move from Correlation to Causation</h3>
                <p class="text-sm text-muted-foreground">This is one of the hardest problems in statistics, but here are the key approaches.</p>
            </div>
            <div class="p-6 pt-0 space-y-4">
                 <div class="text-base">
                    <h4 class="font-semibold">1. Controlled Experiments (A/B Testing)</h4>
                    <p class="text-muted-foreground text-sm">The gold standard. By randomly assigning subjects to a control group and a treatment group, you can isolate the effect of a single variable. In finance, this is rare but possible (e.g., testing two different portfolio rebalancing strategies on two identical, isolated pools of capital).</p>
                </div>
                 <div class="text-base">
                    <h4 class="font-semibold">2. Economic Rationale &amp; Domain Knowledge</h4>
                    <p class="text-muted-foreground text-sm">Before you even run a regression, ask: "Is there a plausible economic reason why X would cause Y?" A correlation between oil prices and airline stock prices makes economic sense (fuel is a major cost). A correlation between butter production and the stock market does not. Your domain expertise is your first and best filter.</p>
                </div>
                 <div class="text-base">
                    <h4 class="font-semibold">3. Advanced Econometric Techniques</h4>
                    <p class="text-muted-foreground text-sm">Techniques like Granger Causality, Instrumental Variables, and Difference-in-Differences are designed specifically to probe for causal relationships in observational data where controlled experiments aren't possible. These are advanced tools for the professional quant's toolkit.</p>
                </div>
            </div>
        </div>
      </div>
    `,
  },
  {
    id: 'linear-regression',
    title: 'Linear Regression',
    href: '/topics/linear-regression',
    icon: FunctionSquare,
    description: 'Modeling the relationship between variables.',
    category: 'sub-topic',
    parent: 'stats-foundations',
  },
  {
    id: 'standard-deviation-variance',
    title: 'Standard Deviation & Variance',
    href: '/topics/statistics/standard-deviation-variance',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-foundations',
  },
  {
    id: 'r-squared-goodness-of-fit',
    title: 'R-squared & Goodness of Fit',
    href: '/topics/statistics/r-squared-goodness-of-fit',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-foundations',
  },

  // Stat Toolkit Tier 2
  {
    id: 'bayes-theorem',
    title: "Bayes' Theorem",
    href: '/probability/bayes-theorem',
    icon: FunctionSquare,
    description: 'A framework for updating beliefs with new evidence.',
    category: 'sub-topic',
    parent: 'stats-intermediate',
  },
  {
    id: 'law-of-large-numbers',
    title: 'The Law of Large Numbers',
    href: '/probability/law-of-large-numbers',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-intermediate',
  },
  {
    id: 'binomial-distribution',
    title: 'Binomial Distribution',
    href: '/probability/binomial-distribution',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-intermediate',
  },
  {
    id: 'poisson-distribution',
    title: 'Poisson Distribution',
    href: '/probability/poisson-distribution',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-intermediate',
  },
  {
    id: 'logistic-regression',
    title: 'Logistic Regression',
    href: '/topics/statistics/logistic-regression',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-intermediate',
  },
  {
    id: 'moment-generating-functions',
    title: 'Moment Generating Functions',
    href: '/probability/moment-generating-functions',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-intermediate',
  },
  {
    id: 'maximum-likelihood-estimation',
    title: 'Maximum Likelihood Estimation (MLE)',
    href: '/probability/maximum-likelihood-estimation',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-intermediate',
  },

  // Stat Toolkit Tier 3
  {
    id: 'monte-carlo-simulation',
    title: 'Monte Carlo Simulation',
    href: '/topics/monte-carlo-simulation',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
  },
  {
    id: 'time-series-decomposition',
    title: 'Time Series Decomposition',
    href: '/topics/statistics/time-series-decomposition',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
  },
  {
    id: 'autocorrelation-acf-pacf',
    title: 'Autocorrelation (ACF & PACF)',
    href: '/topics/statistics/autocorrelation-acf-pacf',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
  },
  {
    id: 'volatility-garch',
    title: 'Volatility &amp; Standard Deviation (GARCH)',
    href: '/topics/statistics/volatility-garch',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
  },
  {
    id: 'efficient-frontier-sharpe-ratio',
    title: 'Efficient Frontier &amp; Sharpe Ratio',
    href: '/topics/statistics/efficient-frontier-sharpe-ratio',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
  },
  {
    id: 'kalman-filters',
    title: 'Kalman Filters',
    href: '/topics/statistics/kalman-filters',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
  },
  {
    id: 'stochastic-calculus-itos-lemma',
    title: "Stochastic Calculus &amp; Ito's Lemma",
    href: '/topics/statistics/stochastic-calculus-itos-lemma',
    icon: FunctionSquare,
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
  },
];
