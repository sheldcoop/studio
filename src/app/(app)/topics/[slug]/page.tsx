import { PageHeader } from '@/components/app/page-header';

export default function TopicPage({ params }: { params: { slug: string } }) {
  // A simple function to convert slug to title
  const formatTitle = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const title = formatTitle(params.slug);

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title={title}
        description={`Learn all about ${title.toLowerCase()}`}
      />
       <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Topic content will go here.</p>
      </div>
    </div>
  );
}

    