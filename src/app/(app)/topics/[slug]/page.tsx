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
