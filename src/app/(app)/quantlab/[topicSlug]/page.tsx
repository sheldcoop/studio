
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/data';
import { TopicPageClient } from '@/components/app/topic-page-client';
import { NormalDashboard } from '@/components/quantlab/dashboards/NormalDashboard';
import { BinomialDashboard } from '@/components/quantlab/dashboards/BinomialDashboard';
import { PoissonDashboard } from '@/components/quantlab/dashboards/PoissonDashboard';
import { BernoulliDashboard } from '@/components/quantlab/dashboards/BernoulliDashboard';
import { TDistributionDashboard } from '@/components/quantlab/dashboards/TDistributionDashboard';
import { ChiSquaredDashboard } from '@/components/quantlab/dashboards/ChiSquaredDashboard';
import { FDistributionDashboard } from '@/components/quantlab/dashboards/FDistributionDashboard';
import { ExponentialDashboard } from '@/components/quantlab/dashboards/ExponentialDashboard';
import { GeometricDashboard } from '@/components/quantlab/dashboards/GeometricDashboard';
import { HypergeometricDashboard } from '@/components/quantlab/dashboards/HypergeometricDashboard';
import { NegativeBinomialDashboard } from '@/components/quantlab/dashboards/NegativeBinomialDashboard';
import { DiscreteUniformDashboard } from '@/components/quantlab/dashboards/DiscreteUniformDashboard';
import { MultinomialDashboard } from '@/components/quantlab/dashboards/MultinomialDashboard';
import { GammaDashboard } from '@/components/quantlab/dashboards/GammaDashboard';
import { BetaDashboard } from '@/components/quantlab/dashboards/BetaDashboard';
import { CauchyDashboard } from '@/components/quantlab/dashboards/CauchyDashboard';
import { LaplaceDashboard } from '@/components/quantlab/dashboards/LaplaceDashboard';
import { WeibullDashboard } from '@/components/quantlab/dashboards/WeibullDashboard';
import { LogisticDashboard } from '@/components/quantlab/dashboards/LogisticDashboard';
import ZTestPage from '@/app/(app)/quantlab/z-test/component';
import TTestPage from '@/app/(app)/quantlab/t-test/component';
import AnovaPage from '@/app/(app)/quantlab/anova/component';
import FTestPage from '@/app/(app)/quantlab/f-test/component';
import ChiSquaredTestPage from '@/app/(app)/quantlab/chi-squared-test/component';
import MannWhitneyUPage from '@/app/(app)/quantlab/mann-whitney-u-test/component';
import KruskalWallisTestPage from '@/app/(app)/quantlab/kruskal-wallis-test/component';
import WilcoxonSignedRankTestPage from '@/app/(app)/quantlab/wilcoxon-signed-rank-test/component';
import SpearmansRankCorrelationPage from '@/app/(app)/quantlab/spearmans-rank-correlation/component';
import FriedmanTestPage from '@/app/(app)/quantlab/friedman-test/component';
import KolmogorovSmirnovTestPage from '@/app/(app)/quantlab/kolmogorov-smirnov-k-s-test/component';
import PearsonCorrelationPage from '@/app/(app)/quantlab/pearson-correlation/component';
import MonteCarloSimulationPage from '@/app/(app)/quantlab/monte-carlo-simulation/page';
import TimeSeriesDecompositionPage from '@/app/(app)/quantlab/time-series-decomposition/page';
import AcfPacfPage from '@/app/(app)/quantlab/autocorrelation-acf-pacf/component';
import GarchPage from '@/app/(app)/quantlab/volatility-garch/component';
import EfficientFrontierPage from '@/app/(app)/quantlab/efficient-frontier-sharpe-ratio/component';
import KalmanFilterComponent from '@/app/(app)/quantlab/kalman-filters/component';
import ItosLemmaComponent from '@/app/(app)/quantlab/stochastic-calculus-itos-lemma/page';
import HypothesisTestingGuidePage from '@/app/(app)/quantlab/hypothesis-testing-guide/component';
import IntroductionToHypothesisTestingPage from '@/app/(app)/quantlab/introduction-to-hypothesis-testing/component';
import CentralLimitTheoremPage from '@/app/(app)/quantlab/central-limit-theorem/component';
import DescriptiveStatisticsExplorerComponent from '@/app/(app)/quantlab/descriptive-statistics-explorer/component';
import ConfidenceIntervalsComponent from '@/app/(app)/quantlab/confidence-intervals/component';
import ZTableComponent from '@/app/(app)/quantlab/z-table/component';
import BayesTheoremComponent from '@/app/(app)/quantlab/bayes-theorem/component';

const componentMap: { [key: string]: React.ComponentType } = {
  'normal-distribution': NormalDashboard,
  'binomial-distribution': BinomialDashboard,
  'poisson-distribution': PoissonDashboard,
  'bernoulli-distribution': BernoulliDashboard,
  'students-t-distribution': TDistributionDashboard,
  'chi-squared-distribution': ChiSquaredDashboard,
  'f-distribution': FDistributionDashboard,
  'exponential-distribution': ExponentialDashboard,
  'geometric-distribution': GeometricDashboard,
  'hypergeometric-distribution': HypergeometricDashboard,
  'negative-binomial-distribution': NegativeBinomialDashboard,
  'discrete-uniform-distribution': DiscreteUniformDashboard,
  'multinomial-distribution': MultinomialDashboard,
  'gamma-distribution': GammaDashboard,
  'beta-distribution': BetaDashboard,
  'cauchy-distribution': CauchyDashboard,
  'laplace-distribution': LaplaceDashboard,
  'weibull-distribution': WeibullDashboard,
  'logistic-distribution': LogisticDashboard,
  'z-test': ZTestPage,
  't-test': TTestPage,
  'anova': AnovaPage,
  'f-test': FTestPage,
  'chi-squared-test': ChiSquaredTestPage,
  'mann-whitney-u-test': MannWhitneyUPage,
  'kruskal-wallis-test': KruskalWallisTestPage,
  'wilcoxon-signed-rank-test': WilcoxonSignedRankTestPage,
  'spearmans-rank-correlation': SpearmansRankCorrelationPage,
  'friedman-test': FriedmanTestPage,
  'kolmogorov-smirnov-k-s-test': KolmogorovSmirnovTestPage,
  'pearson-correlation': PearsonCorrelationPage,
  'monte-carlo-simulation': MonteCarloSimulationPage,
  'time-series-decomposition': TimeSeriesDecompositionPage,
  'autocorrelation-acf-pacf': AcfPacfPage,
  'volatility-garch': GarchPage,
  'efficient-frontier-sharpe-ratio': EfficientFrontierPage,
  'kalman-filters': KalmanFilterComponent,
  'stochastic-calculus-itos-lemma': ItosLemmaComponent,
  'hypothesis-testing-guide': HypothesisTestingGuidePage,
  'introduction-to-hypothesis-testing': IntroductionToHypothesisTestingPage,
  'central-limit-theorem': CentralLimitTheoremPage,
  'descriptive-statistics-explorer': DescriptiveStatisticsExplorerComponent,
  'confidence-intervals': ConfidenceIntervalsComponent,
  'z-table': ZTableComponent,
  'bayes-theorem': BayesTheoremComponent,
};


type TopicPageProps = {
  params: Promise<{ topicSlug: string }>;
};

// This function tells Next.js which slugs to pre-render at build time.
export async function generateStaticParams() {
  // Filter for all topics that are part of the 'quantlab' path
  return allTopics
    .filter(topic => topic.parent && (
        topic.parent === 'prob-core-tools' ||
        topic.parent === 'prob-dist-discrete' ||
        topic.parent === 'prob-dist-continuous' ||
        topic.parent === 'stats-advanced-tools'
    ))
    .map(topic => ({
      topicSlug: topic.id,
    }));
}


// This function generates metadata for the page based on the slug.
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  const topicInfo = allTopics.find((t) => t.id === topicSlug);
  
  if (!topicInfo) {
    return { title: 'Topic Not Found' };
  }

  return {
    title: topicInfo.title,
    description: topicInfo.description,
  };
}

// This is the main server component for the page.
export default async function TopicPage({ params }: TopicPageProps) {
  const { topicSlug } = await params;
  const topicInfo = allTopics.find((t) => t.id === topicSlug);
  
  if (!topicInfo) {
    notFound();
  }
  
  const ComponentToRender = componentMap[topicSlug];

  if (ComponentToRender) {
    return <ComponentToRender />;
  }

  return <TopicPageClient topicInfo={topicInfo} />;
}
