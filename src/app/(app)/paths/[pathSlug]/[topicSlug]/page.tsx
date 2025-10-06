
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/data';
import { getPathById } from '@/lib/learning-paths';
import { TopicPageClient } from '@/components/app/topic-page-client';

// Dynamically import all the content components for our topics
import BayesTheoremPage from '@/app/(app)/quantlab/bayes-theorem/component';
import BernoulliDistributionPage from '@/app/(app)/quantlab/bernoulli-distribution/component';
import BetaDistributionPage from '@/app/(app)/quantlab/beta-distribution/component';
import BinomialDistributionPage from '@/app/(app)/quantlab/binomial-distribution/component';
import CauchyDistributionPage from '@/app/(app)/quantlab/cauchy-distribution/component';
import ChiSquaredDistributionPage from '@/app/(app)/quantlab/chi-squared-distribution/component';
import DiscreteUniformDistributionPage from '@/app/(app)/quantlab/discrete-uniform-distribution/component';
import ExponentialDistributionPage from '@/app/(app)/quantlab/exponential-distribution/component';
import FDistributionPage from '@/app/(app)/quantlab/f-distribution/component';
import GammaDistributionPage from '@/app/(app)/quantlab/gamma-distribution/component';
import GeometricDistributionPage from '@/app/(app)/quantlab/geometric-distribution/component';
import HypergeometricDistributionPage from '@/app/(app)/quantlab/hypergeometric-distribution/component';
import LaplaceDistributionPage from '@/app/(app)/quantlab/laplace-distribution/component';
import LogisticDistributionPage from '@/app/(app)/quantlab/logistic-distribution/component';
import MultinomialDistributionPage from '@/app/(app)/quantlab/multinomial-distribution/component';
import NegativeBinomialDistributionPage from '@/app/(app)/quantlab/negative-binomial-distribution/component';
import PoissonDistributionPage from '@/app/(app)/quantlab/poisson-distribution/component';
import TDistributionPage from '@/app/(app)/quantlab/students-t-distribution/component';
import WeibullDistributionPage from '@/app/(app)/quantlab/weibull-distribution/component';
import CLTPage from '@/app/(app)/quantlab/central-limit-theorem/component';
import DescriptiveStatsPage from '@/app/(app)/quantlab/descriptive-statistics-explorer/component';
import ZTablePage from '@/app/(app)/quantlab/z-table/component';
import ConfidenceIntervalsPage from '@/app/(app)/quantlab/confidence-intervals/component';
import MonteCarloPage from '@/app/(app)/quantlab/monte-carlo-simulation/component';
import TimeSeriesDecompositionPage from '@/app/(app)/quantlab/time-series-decomposition/component';
import AcfPacfPage from '@/app/(app)/quantlab/autocorrelation-acf-pacf/component';
import GarchPage from '@/app/(app)/quantlab/volatility-garch/component';
import EfficientFrontierPage from '@/app/(app)/quantlab/efficient-frontier-sharpe-ratio/component';
import KalmanFilterPage from '@/app/(app)/quantlab/kalman-filters/component';
import ItosLemmaComponent from '@/app/(app)/quantlab/stochastic-calculus-itos-lemma/page';
import HypothesisTestingGuidePage from '@/app/(app)/quantlab/hypothesis-testing-guide/component';
import AnovaPage from '@/app/(app)/quantlab/anova/component';
import ChiSquaredTestPage from '@/app/(app)/quantlab/chi-squared-test/component';
import FTestPage from '@/app/(app)/quantlab/f-test/component';
import FriedmanTestPage from '@/app/(app)/quantlab/friedman-test/component';
import KSTestPage from '@/app/(app)/quantlab/kolmogorov-smirnov-k-s-test/component';
import KruskalWallisTestPage from '@/app/(app)/quantlab/kruskal-wallis-test/component';
import MannWhitneyUTestPage from '@/app/(app)/quantlab/mann-whitney-u-test/component';
import PearsonCorrelationPage from '@/app/(app)/quantlab/pearson-correlation/component';
import SpearmansRankCorrelationPage from '@/app/(app)/quantlab/spearmans-rank-correlation/component';
import TTestPage from '@/app/(app)/quantlab/t-test/component';
import WilcoxonSignedRankTestPage from '@/app/(app)/quantlab/wilcoxon-signed-rank-test/component';
import ZTestPage from '@/app/(app)/quantlab/z-test/component';
import IntroductionToHypothesisTestingPage from '@/app/(app)/quantlab/introduction-to-hypothesis-testing/component';
import VectorProjectionPage from '@/app/(app)/quantlab/vector-projection/component';
import GaussianEliminationPage from '@/app/(app)/paths/linear-algebra-for-quantitative-finance/gaussian-elimination/component';


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
      if (parts[0] === 'quantlab' && parts.length === 2) {
        return {
          pathSlug: 'quantlab',
          topicSlug: parts[1],
        }
      }
      return null;
    }).filter((p: any) => p) as { pathSlug: string; topicSlug: string }[];
}


// This function generates metadata for the page based on the slug.
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { pathSlug, topicSlug } = await params;
  const topicInfo = allTopics.find((t) => t.id === topicSlug);
  const pathInfo = getPathById(pathSlug);

  if (!topicInfo) {
    return {
      title: 'Topic Not Found',
    };
  }
  
  const pageUrl = new URL(topicInfo.href, SITE_URL).toString();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': pageUrl,
    },
    headline: topicInfo.seoTitle || topicInfo.title,
    description: topicInfo.metaDescription || topicInfo.description,
    author: {
        '@type': 'Organization',
        name: 'QuantPrep',
        url: SITE_URL
    },
    publisher: {
        '@type': 'Organization',
        name: 'QuantPrep',
        logo: {
            '@type': 'ImageObject',
            url: new URL('/logo.png', SITE_URL).toString(),
        },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  };

  const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        pathInfo ? {
          '@type': 'ListItem',
          position: 2,
          name: pathInfo.title,
          item: new URL(pathInfo.href, SITE_URL).toString(),
        } : null,
        {
          '@type': 'ListItem',
          position: pathInfo ? 3 : 2,
          name: topicInfo.title,
          item: pageUrl,
        },
      ].filter(Boolean),
  };

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
    other: {
      'article-schema': JSON.stringify(articleSchema),
      'breadcrumb-schema': JSON.stringify(breadcrumbSchema),
    },
  };
}

// A map to associate topic slugs with their corresponding page components.
const topicComponentMap: { [key: string]: React.ComponentType } = {
  'bayes-theorem-interactive-guide': BayesTheoremPage,
  'bernoulli-distribution-interactive-guide': BernoulliDistributionPage,
  'beta-distribution-interactive-guide': BetaDistributionPage,
  'binomial-distribution-interactive-guide': BinomialDistributionPage,
  'cauchy-distribution-interactive-guide': CauchyDistributionPage,
  'chi-squared-distribution-interactive-guide': ChiSquaredDistributionPage,
  'discrete-uniform-distribution-interactive-guide': DiscreteUniformDistributionPage,
  'exponential-distribution-interactive-guide': ExponentialDistributionPage,
  'f-distribution-interactive-guide': FDistributionPage,
  'gamma-distribution-interactive-guide': GammaDistributionPage,
  'geometric-distribution-interactive-guide': GeometricDistributionPage,
  'hypergeometric-distribution-interactive-guide': HypergeometricDistributionPage,
  'laplace-distribution-interactive-guide': LaplaceDistributionPage,
  'logistic-distribution-interactive-guide': LogisticDistributionPage,
  'multinomial-distribution-interactive-guide': MultinomialDistributionPage,
  'negative-binomial-distribution-interactive-guide': NegativeBinomialDistributionPage,
  'poisson-distribution-interactive-guide': PoissonDistributionPage,
  'students-t-distribution-interactive-guide': TDistributionPage,
  'weibull-distribution-interactive-guide': WeibullDistributionPage,
  'central-limit-theorem-interactive-guide': CLTPage,
  'descriptive-statistics-explorer-interactive-guide': DescriptiveStatsPage,
  'z-table-interactive-guide': ZTablePage,
  'confidence-intervals-interactive-guide': ConfidenceIntervalsPage,
  'monte-carlo-simulation-interactive-guide': MonteCarloPage,
  'time-series-decomposition-interactive-guide': TimeSeriesDecompositionPage,
  'autocorrelation-acf-pacf-interactive-guide': AcfPacfPage,
  'volatility-garch-interactive-guide': GarchPage,
  'efficient-frontier-sharpe-ratio-interactive-guide': EfficientFrontierPage,
  'kalman-filters-interactive-guide': KalmanFilterPage,
  'stochastic-calculus-itos-lemma-interactive-guide': ItosLemmaComponent,
  'hypothesis-testing-guide': HypothesisTestingGuidePage,
  'anova': AnovaPage,
  'chi-squared-test': ChiSquaredTestPage,
  'f-test': FTestPage,
  'friedman-test': FriedmanTestPage,
  'kolmogorov-smirnov-k-s-test': KSTestPage,
  'kruskal-wallis-test': KruskalWallisTestPage,
  'mann-whitney-u-test': MannWhitneyUTestPage,
  'pearson-correlation': PearsonCorrelationPage,
  'spearmans-rank-correlation': SpearmansRankCorrelationPage,
  't-test': TTestPage,
  'wilcoxon-signed-rank-test': WilcoxonSignedRankTestPage,
  'z-test': ZTestPage,
  'introduction-to-hypothesis-testing': IntroductionToHypothesisTestingPage,
  'vector-projection': VectorProjectionPage,
  'gaussian-elimination': GaussianEliminationPage,
};


// This is the main server component for the page.
export default async function TopicPage({ params }: TopicPageProps) {
  const { pathSlug, topicSlug } = await params;
  
  // Find the topic by its unique ID, which is the slug.
  const topicInfo = allTopics.find((t) => t.id === topicSlug);
  
  if (!topicInfo) {
    notFound();
  }
  
  const metadata = await generateMetadata({ params });
  const articleSchema = metadata.other?.['article-schema'] as string | undefined;
  const breadcrumbSchema = metadata.other?.['breadcrumb-schema'] as string | undefined;

  // Look up the component in our map.
  const TopicComponent = topicComponentMap[topicSlug];
  
  // If we find a specific component for this topic, render it.
  if (TopicComponent) {
    return (
      <>
        {articleSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: articleSchema }}
          />
        )}
        {breadcrumbSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
          />
        )}
        <TopicComponent />
      </>
    );
  }

  // Otherwise, fall back to the generic TopicPageClient for structured content.
  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: articleSchema }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
        />
      )}
      <TopicPageClient topicInfo={topicInfo} />
    </>
  );
}
