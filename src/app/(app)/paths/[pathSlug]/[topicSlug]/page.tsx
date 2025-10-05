
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import { TopicPageClient } from '@/components/app/topic-page-client';

// Dynamically import all the content components for our topics
import BayesTheoremPage from '@/app/(app)/quantlab/bayes-theorem/page';
import BernoulliDistributionPage from '@/app/(app)/quantlab/bernoulli-distribution/page';
import BetaDistributionPage from '@/app/(app)/quantlab/beta-distribution/page';
import BinomialDistributionPage from '@/app/(app)/quantlab/binomial-distribution/page';
import CauchyDistributionPage from '@/app/(app)/quantlab/cauchy-distribution/page';
import ChiSquaredDistributionPage from '@/app/(app)/quantlab/chi-squared-distribution/page';
import DiscreteUniformDistributionPage from '@/app/(app)/quantlab/discrete-uniform-distribution/page';
import ExponentialDistributionPage from '@/app/(app)/quantlab/exponential-distribution/page';
import FDistributionPage from '@/app/(app)/quantlab/f-distribution/page';
import GammaDistributionPage from '@/app/(app)/quantlab/gamma-distribution/page';
import GeometricDistributionPage from '@/app/(app)/quantlab/geometric-distribution/page';
import HypergeometricDistributionPage from '@/app/(app)/quantlab/hypergeometric-distribution/page';
import LaplaceDistributionPage from '@/app/(app)/quantlab/laplace-distribution/page';
import LogisticDistributionPage from '@/app/(app)/quantlab/logistic-distribution/page';
import MultinomialDistributionPage from '@/app/(app)/quantlab/multinomial-distribution/page';
import NegativeBinomialDistributionPage from '@/app/(app)/quantlab/negative-binomial-distribution/page';
import PoissonDistributionPage from '@/app/(app)/quantlab/poisson-distribution/page';
import TDistributionPage from '@/app/(app)/quantlab/students-t-distribution/page';
import WeibullDistributionPage from '@/app/(app)/quantlab/weibull-distribution/page';
import CLTPage from '@/app/(app)/quantlab/central-limit-theorem/page';
import DescriptiveStatsPage from '@/app/(app)/quantlab/descriptive-statistics-explorer/page';
import ZTablePage from '@/app/(app)/quantlab/z-table/page';
import ConfidenceIntervalsPage from '@/app/(app)/quantlab/confidence-intervals/page';
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
    .filter(topic => topic.category !== 'parent' && topic.href !== '#') // Only generate real pages
    .map(topic => {
      const parts = topic.href.split('/').filter(Boolean);
      // Expected format: ['paths', pathSlug, topicSlug] or ['quantlab', topicSlug] etc.
      if (parts[0] === 'paths' && parts.length === 3) {
          return {
            pathSlug: parts[1],
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
