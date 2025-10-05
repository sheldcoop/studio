
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
import CLTPage from '@/app/(app)/topics/central-limit-theorem/page';
import DescriptiveStatsPage from '@/components/app/probability-distribution-page-client';


type TopicPageProps = {
  params: Promise<{ pathSlug: string; topicSlug: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

// Statically generate all topic pages at build time
export async function generateStaticParams() {
  return allTopics
    .filter(topic => topic.href.startsWith('/paths/') || topic.href.startsWith('/quantlab/')) // Only generate for this route structure
    .map(topic => {
      const parts = topic.href.split('/');
      // Expected format: ['', 'paths', pathSlug, topicSlug] or ['', 'quantlab', topicSlug]
      if (parts.length === 4 && parts[1] === 'paths') {
          return {
            pathSlug: parts[2],
            topicSlug: parts[3],
          };
      }
      if (parts.length === 3 && parts[1] === 'quantlab') {
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
