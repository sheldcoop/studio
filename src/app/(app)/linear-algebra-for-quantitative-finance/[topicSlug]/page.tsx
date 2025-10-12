
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Topic } from '@/lib/curriculum';
import { type ComponentType } from 'react';

// Import all the components that can be rendered by this route
import ChangeOfBasisPage from '@/app/(app)/linear-algebra-for-quantitative-finance/change-of-basis/page';
import DiagonalizationPage from '@/app/(app)/linear-algebra-for-quantitative-finance/diagonalization/page';
import MatrixDecompositionPage from '@/app/(app)/linear-algebra-for-quantitative-finance/matrix-decomposition/page';
import MatrixOperationsPage from '@/app/(app)/linear-algebra-for-quantitative-finance/matrix-operations/page';
import SystemsOfLinearEquationsPage from '@/app/(app)/linear-algebra-for-quantitative-finance/systems-of-linear-equations/page';
import TheFourFundamentalSubspacesPage from '@/app/(app)/linear-algebra-for-quantitative-finance/the-four-fundamental-subspaces/page';
import VectorsAndVectorSpacesPage from '@/app/(app)/linear-algebra-for-quantitative-finance/vectors-vector-spaces/page';

// A map from topic slug to the actual React component
const topicComponentMap: Record<string, ComponentType> = {
    'change-of-basis': ChangeOfBasisPage,
    'diagonalization': DiagonalizationPage,
    'matrix-decomposition': MatrixDecompositionPage,
    'matrix-operations': MatrixOperationsPage,
    'systems-of-linear-equations': SystemsOfLinearEquationsPage,
    'the-four-fundamental-subspaces': TheFourFundamentalSubspacesPage,
    'vectors-vector-spaces': VectorsAndVectorSpacesPage,
};

type TopicPageProps = {
    params: {
        topicSlug: string;
    };
};

// This function tells Next.js which pages to build at build time
export async function generateStaticParams() {
  const linearAlgebraTopics = allTopics.filter(
    (topic) => topic.pathPrefix === 'linear-algebra-for-quantitative-finance'
  );
  return linearAlgebraTopics.map((topic) => ({
    topicSlug: topic.id,
  }));
}

// This is the main page component
export default function TopicPage({ params }: TopicPageProps) {
  const { topicSlug } = params;
  
  const Component = topicComponentMap[topicSlug];

  if (!Component) {
    notFound();
  }

  return <Component />;
}
