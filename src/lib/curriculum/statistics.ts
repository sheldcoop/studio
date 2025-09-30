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
      <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Quant's Golden Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Correlation tells you that two variables tend to move in the same, opposite, or random directions. Causation means that a change in one variable <span className="font-bold text-primary">directly causes</span> a change in another. It's a simple distinction, but confusing them is one of the most common and dangerous mistakes in quantitative analysis and data science.
            </p>
            <p>
              A model built on a spurious (false) correlation may work for a while, but it will fail unpredictably because it hasn't captured a true underlying relationship.
            </p>
          </CardContent>
        </Card>
        
        <Alert variant="destructive" className="bg-destructive/5">
            <Siren className="h-4 w-4" />
            <AlertTitle className="font-headline text-lg">A Classic (and Silly) Example</AlertTitle>
            <AlertDescription className="mt-2 text-base">
                <p className="mb-2">For years, a strong positive correlation was observed between ice cream sales and the number of shark attacks. As ice cream sales went up, so did shark attacks.</p>
                <p className="mb-4 font-semibold text-destructive-foreground/90">Does eating ice cream cause shark attacks?</p>
                <p>Of course not. The real cause is a third, hidden variable: <strong className="text-foreground">warm weather</strong>. When it's hot, more people go to the beach (increasing potential shark encounters) AND more people buy ice cream. The two are correlated, but one does not cause the other.</p>
                <div className="mt-4 rounded-md border border-destructive/20 bg-background/30 p-4 text-center">
                  <p className="font-medium">Warm Weather (Lurking Variable)</p>
                  <div className="flex items-center justify-center gap-4 text-2xl font-bold text-destructive-foreground/80">
                    <span>→</span>
                    <div className="flex-1 rounded-md bg-background/50 p-2">Ice Cream Sales ↑</div>
                    <span>and</span>
                     <div className="flex-1 rounded-md bg-background/50 p-2">Shark Attacks ↑</div>
                     <span>→</span>
                  </div>
                   <p className="mt-2 text-sm text-muted-foreground">Both ice cream sales and beach visits are driven by summer heat.</p>
                </div>
            </AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Why This Matters in Finance</CardTitle>
                <CardDescription>Mistaking correlation for causation in finance can be an expensive lesson. Here are common traps.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h4 className="font-semibold flex items-center"><BrainCircuit className="w-5 h-5 mr-2 text-primary" /> Machine Learning: The Data Leakage Trap</h4>
                    <p className="text-muted-foreground mt-1 text-sm">A data scientist is building a model to predict next-day returns. They find a feature called \`data_update_timestamp\` that has incredible predictive power. The model learns that if this timestamp is present, the next day's return will likely be negative. The correlation is extremely strong.</p>
                    <p className="mt-2 text-sm"><strong>The Hidden Cause:</strong> The \`data_update_timestamp\` was only added to the database system in 2008. The model has simply learned that "data from after 2008" correlates with returns. What really happened in 2008? The Global Financial Crisis. The model hasn't learned a predictive relationship; it has learned to identify a specific historical period of high volatility and negative returns. It will fail completely on data outside this context.</p>
                </div>

                 <div>
                    <h4 className="font-semibold flex items-center"><CandlestickChart className="w-5 h-5 mr-2 text-primary" /> Finance: The Super Bowl Indicator</h4>
                    <p className="text-muted-foreground mt-1 text-sm">For decades, a surprisingly accurate "indicator" stated that if a team from the original National Football League (NFC) won the Super Bowl, the S&P 500 would have a positive return for the year. If a team from the American Football Conference (AFC) won, the market would be down.</p>
                    <p className="mt-2 text-sm">This is a textbook <strong className="text-foreground/90">spurious correlation</strong>. There is no plausible economic link between the winner of a football game and the complex global factors that drive stock market returns. It's a classic case of data mining—if you look at enough unrelated variables, you're bound to find some that correlate by pure chance. A strategy based on this would be no better than a coin flip over the long run.</p>
                </div>
                
                <div>
                    <h4 className="font-semibold flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-primary" /> The Hidden Variable (Lurking Variable)</h4>
                    <p className="text-muted-foreground mt-1 text-sm">Just like "warm weather" in our example, a hidden economic factor often drives two seemingly related assets. For example, the prices of luxury cars and high-end watches might be correlated. The lurking variable is <strong className="text-foreground/90">global wealth concentration</strong>. One doesn't cause the other; they are both driven by the same underlying factor.</p>
                </div>
                
                <div>
                    <h4 className="font-semibold flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-primary" /> Reverse Causality</h4>
                    <p className="text-muted-foreground mt-1 text-sm">Sometimes you have the relationship backward. For instance, you might observe that companies that spend more on advertising have higher sales. Does advertising cause higher sales, or do companies with high sales have more money to spend on advertising? The causal link might be the reverse of what you assume.</p>
                </div>
            </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
             <CardHeader>
                <CardTitle className="font-headline flex items-center"><Lightbulb className="w-5 h-5 mr-2 text-primary" />How to Move from Correlation to Causation</CardTitle>
                <CardDescription>This is one of the hardest problems in statistics, but here are the key approaches.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="text-base">
                    <h4 className="font-semibold">1. Controlled Experiments (A/B Testing)</h4>
                    <p className="text-muted-foreground text-sm">The gold standard. By randomly assigning subjects to a control group and a treatment group, you can isolate the effect of a single variable. In finance, this is rare but possible (e.g., testing two different portfolio rebalancing strategies on two identical, isolated pools of capital).</p>
                </div>
                 <div className="text-base">
                    <h4 className="font-semibold">2. Economic Rationale &amp; Domain Knowledge</h4>
                    <p className="text-muted-foreground text-sm">Before you even run a regression, ask: "Is there a plausible economic reason why X would cause Y?" A correlation between oil prices and airline stock prices makes economic sense (fuel is a major cost). A correlation between butter production and the stock market does not. Your domain expertise is your first and best filter.</p>
                </div>
                 <div className="text-base">
                    <h4 className="font-semibold">3. Advanced Econometric Techniques</h4>
                    <p className="text-muted-foreground text-sm">Techniques like Granger Causality, Instrumental Variables, and Difference-in-Differences are designed specifically to probe for causal relationships in observational data where controlled experiments aren't possible. These are advanced tools for the professional quant's toolkit.</p>
                </div>
            </CardContent>
        </Card>
    `
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
