
import { PageHeader } from '@/components/app/page-header';

// Helper to convert slug back to a readable title
function slugToTitle(slug: string) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function TopicPage({ params }: { params: { slug: string } }) {
  // If the slug is not present during build, return null to prevent errors.
  if (!params.slug) {
    return null;
  }

  // A list of slugs that have their own dedicated page.
  // This prevents this dynamic route from rendering over a specific, static page.
  const dedicatedPages = [
    'confidence-intervals',
    'hypothesis-testing-p-values',
    'mental-math',
    'linear-algebra',
    't-test',
    'z-test',
    'anova',
    'f-test',
    'chi-squared-test',
    'pearson-correlation',
    'mann-whitney-u-test',
    'kruskal-wallis-test',
    'wilcoxon-signed-rank-test',
    'spearmans-rank-correlation',
    'friedman-test',
    'kolmogorov-smirnov-k-s-test',
    'stat-toolkit',
    'central-limit-theorem',
  ];

  // If the slug is for a dedicated page, we return null to prevent this component from rendering.
  if (dedicatedPages.includes(params.slug)) {
    return null;
  }

  const title = slugToTitle(params.slug);

  return (
    <div>
      <PageHeader
        title={title}
        description={`An overview of ${title}.`}
        variant="aligned-left"
      />
      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Topic content will go here.</p>
      </div>
    </div>
  );
}
