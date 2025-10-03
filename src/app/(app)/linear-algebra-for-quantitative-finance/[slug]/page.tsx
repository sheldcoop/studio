
import { redirect } from 'next/navigation';

// This page has been consolidated into /topics/[slug]
// This file is kept to avoid breaking links, and now redirects to the correct page.
export default async function DeprecatedLinearAlgebraTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/topics/${slug}`);
}
