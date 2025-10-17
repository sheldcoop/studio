
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/data';
import { TopicPageClient } from '@/components/app/topic-page-client';
import NormalDistributionComponent from '@/app/(app)/quantlab/normal-distribution/page';
import BinomialDistributionComponent from '@/app/(app)/quantlab/binomial-distribution/page';
import PoissonDistributionComponent from '@/app/(app)/quantlab/poisson-distribution/page';
import BernoulliDistributionComponent from '@/app/(app)/quantlab/bernoulli-distribution/page';
import TDistributionComponent from '@/app/(app)/quantlab/students-t-distribution/page';
import ChiSquaredDistributionComponent from '@/app/(app)/quantlab/chi-squared-distribution/page';
import FDistributionComponent from '@/app/(app)/quantlab/f-distribution/page';
import ExponentialDistributionComponent from '@/app/(app)/quantlab/exponential-distribution/page';
import GeometricDistributionComponent from '@/app/(app)/quantlab/geometric-distribution/page';
import HypergeometricDistributionComponent from '@/app/(app)/quantlab/hypergeometric-distribution/page';
import NegativeBinomialDistributionComponent from '@/app/(app)/quantlab/negative-binomial-distribution/page';
import DiscreteUniformDistributionComponent from '@/app/(app)/quantlab/discrete-uniform-distribution/page';
import MultinomialDistributionComponent from '@/app/(app)/quantlab/multinomial-distribution/page';
import GammaDistributionComponent from '@/app/(app)/quantlab/gamma-distribution/page';
import BetaDistributionComponent from '@/app/(app)/quantlab/beta-distribution/page';
import CauchyDistributionComponent from '@/app/(app)/quantlab/cauchy-distribution/page';
import LaplaceDistributionComponent from '@/app/(app)/quantlab/laplace-distribution/page';
import WeibullDistributionComponent from '@/app/(app)/quantlab/weibull-distribution/page';
import LogisticDistributionComponent from '@/app/(app)/quantlab/logistic-distribution/page';
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
  'normal-distribution': NormalDistributionComponent,
  'binomial-distribution': BinomialDistributionComponent,
  'poisson-distribution': PoissonDistributionComponent,
  'bernoulli-distribution': BernoulliDistributionComponent,
  'students-t-distribution': TDistributionComponent,
  'chi-squared-distribution': ChiSquaredDistributionComponent,
  'f-distribution': FDistributionComponent,
  'exponential-distribution': ExponentialDistributionComponent,
  'geometric-distribution': GeometricDistributionComponent,
  'hypergeometric-distribution': HypergeometricDistributionComponent,
  'negative-binomial-distribution': NegativeBinomialDistributionComponent,
  'discrete-uniform-distribution': DiscreteUniformDistributionComponent,
  'multinomial-distribution': MultinomialDistributionComponent,
  'gamma-distribution': GammaDistributionComponent,
  'beta-distribution': BetaDistributionComponent,
  'cauchy-distribution': CauchyDistributionComponent,
  'laplace-distribution': LaplaceDistributionComponent,
  'weibull-distribution': WeibullDistributionComponent,
  'logistic-distribution': LogisticDistributionComponent,
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
