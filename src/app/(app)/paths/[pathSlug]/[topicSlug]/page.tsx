
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import { TopicPageClient } from '@/components/app/topic-page-client';

// Dynamically import all the content components for our topics
import BayesTheoremPage from '@/app/(app)/probability/bayes-theorem/page';
import BernoulliDistributionPage from '@/app/(app)/probability/bernoulli-distribution/page';
import BetaDistributionPage from '@/app/(app)/probability/beta-distribution/page';
import BinomialDistributionPage from '@/app/(app)/probability/binomial-distribution/page';
import CauchyDistributionPage from '@/app/(app)/probability/cauchy-distribution/page';
import ChiSquaredDistributionPage from '@/app/(app)/probability/chi-squared-distribution/page';
import DiscreteUniformDistributionPage from '@/app/(app)/probability/discrete-uniform-distribution/page';
import ExponentialDistributionPage from '@/app/(app)/probability/exponential-distribution/page';
import FDistributionPage from '@/app/(app)/probability/f-distribution/page';
import GammaDistributionPage from '@/app/(app)/probability/gamma-distribution/page';
import GeometricDistributionPage from '@/app/(app)/probability/geometric-distribution/page';
import HypergeometricDistributionPage from '@/app/(app)/probability/hypergeometric-distribution/page';
import LaplaceDistributionPage from '@/app/(app)/probability/laplace-distribution/page';
import LogisticDistributionPage from '@/app/(app)/probability/logistic-distribution/page';
import MultinomialDistributionPage from '@/app/(app)/probability/multinomial-distribution/page';
import NegativeBinomialDistributionPage from '@/app/(app)/probability/negative-binomial-distribution/page';
import PoissonDistributionPage from '@/app/(app)/probability/poisson-distribution/page';
import TDistributionPage from '@/app/(app)/probability/students-t-distribution/page';
import WeibullDistributionPage from '@/app/(app)/probability/weibull-distribution/page';
import TTestPage from '@/app/(app)/topics/t-test/page';
import ZTestPage from '@/app/(app)/topics/z-test/page';
import AnovaPage from '@/app/(app)/topics/anova/page';
import FTestPage from '@/app/(app)/topics/f-test/page';
import PearsonCorrelationPage from '@/app/(app)/topics/pearson-correlation/page';
import ChiSquaredTestPage from '@/app/(app)/topics/chi-squared-test/page';
import MannWhitneyUPage from '@/app/(app)/topics/mann-whitney-u-test/page';
import KruskalWallisTestPage from '@/app/(app)/topics/kruskal-wallis-test/page';
import WilcoxonSignedRankTestPage from '@/app/(app)/topics/wilcoxon-signed-rank-test/page';
import SpearmansRankCorrelationPage from '@/app/(app)/topics/spearmans-rank-correlation/page';
import FriedmanTestPage from '@/app/(app)/topics/friedman-test/page';
import KolmogorovSmirnovTestPage from '@/app/(app)/topics/kolmogorov-smirnov-k-s-test/page';

type TopicPageProps = {
  params: Promise<{ pathSlug: string; topicSlug: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

// Statically generate all topic pages at build time
export async function generateStaticParams() {
  return allTopics
    .filter(topic => topic.href.startsWith('/paths/')) // Only generate for this route structure
    .map(topic => {
      const parts = topic.href.split('/');
      // Expected format: ['', 'paths', pathSlug, topicSlug]
      if (parts.length === 4) {
          return {
            pathSlug: parts[2],
            topicSlug: parts[3],
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
  't-test': TTestPage,
  'z-test': ZTestPage,
  'anova': AnovaPage,
  'f-test': FTestPage,
  'pearson-correlation': PearsonCorrelationPage,
  'chi-squared-test': ChiSquaredTestPage,
  'mann-whitney-u-test': MannWhitneyUPage,
  'kruskal-wallis-test': KruskalWallisTestPage,
  'wilcoxon-signed-rank-test': WilcoxonSignedRankTestPage,
  'spearmans-rank-correlation': SpearmansRankCorrelationPage,
  'friedman-test': FriedmanTestPage,
  'kolmogorov-smirnov-k-s-test': KolmogorovSmirnovTestPage,
};


// This is the main server component for the page.
export default async function TopicPage({ params }: TopicPageProps) {
  const { topicSlug } = await params;
  
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
