
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import { TopicPageClient } from '@/components/app/topic-page-client';

// Dynamically import all the content components for our topics
import BayesTheoremPage from '@/app/quantlab/bayes-theorem/component';
import BernoulliDistributionPage from '@/app/quantlab/bernoulli-distribution/component';
import BetaDistributionPage from '@/app/quantlab/beta-distribution/component';
import BinomialDistributionPage from '@/app/quantlab/binomial-distribution/component';
import CauchyDistributionPage from '@/app/quantlab/cauchy-distribution/component';
import ChiSquaredDistributionPage from '@/app/quantlab/chi-squared-distribution/component';
import DiscreteUniformDistributionPage from '@/app/quantlab/discrete-uniform-distribution/component';
import ExponentialDistributionPage from '@/app/quantlab/exponential-distribution/component';
import FDistributionPage from '@/app/quantlab/f-distribution/component';
import GammaDistributionPage from '@/app/quantlab/gamma-distribution/component';
import GeometricDistributionPage from '@/app/quantlab/geometric-distribution/component';
import HypergeometricDistributionPage from '@/app/quantlab/hypergeometric-distribution/component';
import LaplaceDistributionPage from '@/app/quantlab/laplace-distribution/component';
import LogisticDistributionPage from '@/app/quantlab/logistic-distribution/component';
import MultinomialDistributionPage from '@/app/quantlab/multinomial-distribution/component';
import NegativeBinomialDistributionPage from '@/app/quantlab/negative-binomial-distribution/component';
import PoissonDistributionPage from '@/app/quantlab/poisson-distribution/component';
import TDistributionPage from '@/app/quantlab/students-t-distribution/component';
import WeibullDistributionPage from '@/app/quantlab/weibull-distribution/component';
import CLTPage from '@/app/quantlab/central-limit-theorem/component';
import DescriptiveStatsPage from '@/app/quantlab/descriptive-statistics-explorer/page';
import ZTablePage from '@/app/quantlab/z-table/component';
import ConfidenceIntervalsPage from '@/app/quantlab/confidence-intervals/component';
import MentalMathPage from '@/app/(app)/topics/mental-math/page';
import MonteCarloPage from '@/app/(app)/quantlab/monte-carlo-simulation/page';
import TimeSeriesDecompositionPage from '@/app/(app)/quantlab/time-series-decomposition/page';
import AcfPacfPage from '@/app/(app)/quantlab/autocorrelation-acf-pacf/page';
import GarchPage from '@/app/(app)/quantlab/volatility-garch/page';
import EfficientFrontierPage from '@/app/(app)/quantlab/efficient-frontier-sharpe-ratio/page';
import KalmanFilterPage from '@/app/(app)/quantlab/kalman-filters/page';
import ItosLemmaPage from '@/app/(app)/quantlab/stochastic-calculus-itos-lemma/page';


type TopicPageProps = {
  params: Promise<{ pathSlug: string; topicSlug: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

// Statically generate all topic pages at build time
export async function generateStaticParams() {
  return allTopics
    .filter(topic => topic.href.startsWith('/paths/') || topic.href.startsWith('/quantlab/') || topic.href.startsWith('/topics/')) // Only generate for this route structure
    .map(topic => {
      const parts = topic.href.split('/');
      // Expected format: ['', 'paths', pathSlug, topicSlug] or ['', 'quantlab', topicSlug] or ['', 'topics', topicSlug]
      if (parts.length === 4 && parts[1] === 'paths') {
          return {
            pathSlug: parts[2],
            topicSlug: parts[3],
          };
      }
      if (parts.length === 3 && (parts[1] === 'quantlab' || parts[1] === 'topics')) {
          return {
            pathSlug: 'quantlab', // Use a placeholder slug
            topicSlug: parts[2],
          };
      }
      return null;
    }).filter(Boolean) as { pathSlug: string; topicSlug: string }[];
}


// This function generates metadata for the page based on the slug.
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  const topicInfo = allTopics.find((t) => t.id === topicSlug);

  if (!topicInfo) {
    return {
      title: 'Topic Not Found',
    };
  }
  
  const pageUrl = new URL(topicInfo.href, SITE_URL).toString();

  return {
    title: topicInfo.seoTitle || topicInfo.title,
    description: topicInfo.metaDescription || topicInfo.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: topicInfo.ogTitle || topicInfo.title,
      description: topicInfo.ogDescription || topicInfo.description,
      url: pageUrl,
      type: 'article',
      images: [
        {
          url: topicInfo.ogImage || new URL('/og-image.png', SITE_URL).toString(),
          width: 1200,
          height: 630,
          alt: topicInfo.title,
        },
      ],
    },
  };
}

// A map to associate topic slugs with their corresponding page components.
const topicComponentMap: { [key: string]: React.ComponentType } = {
  'bayes-theorem': BayesTheoremPage,
  'bernoulli-distribution': BernoulliDistributionPage,
  'beta-distribution': BetaDistributionPage,
  'binomial-distribution': BinomialDistributionPage,
  'cauchy-distribution': CauchyDistributionPage,
  'chi-squared-distribution': ChiSquaredDistributionPage,
  'discrete-uniform-distribution': DiscreteUniformDistributionPage,
  'exponential-distribution': ExponentialDistributionPage,
  'f-distribution': FDistributionPage,
  'gamma-distribution': GammaDistributionPage,
  'geometric-distribution': GeometricDistributionPage,
  'hypergeometric-distribution': HypergeometricDistributionPage,
  'laplace-distribution': LaplaceDistributionPage,
  'logistic-distribution': LogisticDistributionPage,
  'multinomial-distribution': MultinomialDistributionPage,
  'negative-binomial-distribution': NegativeBinomialDistributionPage,
  'poisson-distribution': PoissonDistributionPage,
  'students-t-distribution': TDistributionPage,
  'weibull-distribution': WeibullDistributionPage,
  'central-limit-theorem': CLTPage,
  'descriptive-statistics-explorer': DescriptiveStatsPage,
  'z-table': ZTablePage,
  'confidence-intervals': ConfidenceIntervalsPage,
  'mental-math': MentalMathPage,
  'monte-carlo-simulation': MonteCarloPage,
  'time-series-decomposition': TimeSeriesDecompositionPage,
  'autocorrelation-acf-pacf': AcfPacfPage,
  'volatility-garch': GarchPage,
  'efficient-frontier-sharpe-ratio': EfficientFrontierPage,
  'kalman-filters': KalmanFilterPage,
  'stochastic-calculus-itos-lemma': ItosLemmaPage,
};


// This is the main server component for the page.
export default async function TopicPage({ params }: TopicPageProps) {
  const { pathSlug, topicSlug } = await params;
  
  // Find the topic by its unique ID, which is the slug.
  const topicInfo = allTopics.find((t) => t.id === topicSlug);
  
  if (!topicInfo) {
    notFound();
  }

  // Look up the component in our map.
  const TopicComponent = topicComponentMap[topicSlug];
  
  // If we find a specific component for this topic, render it.
  if (TopicComponent) {
    return <TopicComponent />;
  }

  // Otherwise, fall back to the generic TopicPageClient for structured content.
  return <TopicPageClient topicInfo={topicInfo} />;
}
