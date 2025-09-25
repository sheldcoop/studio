import { PageHeader } from '@/components/app/page-header';

// Helper to convert slug back to a readable title
function slugToTitle(slug: string) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const title = slugToTitle(params.slug);

  // A list of slugs that have their own dedicated page.
  const dedicatedPages = ['hypothesis-testing-p-values', 'mental-math'];

  if (dedicatedPages.includes(params.slug)) {
    // This condition should ideally not be met if linking is correct,
    // but it's a safeguard. Returning null will prevent this generic
    // page from rendering over a specific one if a conflict occurs.
    return null;
  }

  return (
    <div>
      <PageHeader
        title={title}
        description={`An overview of ${title}.`}
      />
      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Topic content will go here.</p>
      </div>
    </div>
  );
}
