// src/app/(app)/[topic]/[slug]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// This is the object shape that Next.js passes to your page and metadata function.
// We will define it directly in the function signatures below.
type PageProps = {
  params: {
    topic: string;
    slug: string;
  };
};

/**
 * This function generates metadata for the page based on the dynamic route parameters.
 * It is correctly typed using the PageProps type.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic, slug } = params;

  // In a real app, you would fetch data here to get the real title.
  // For this example, we'll just format the params.
  const pageTitle = `${topic.charAt(0).toUpperCase() + topic.slice(1)}: ${slug}`;

  return {
    title: pageTitle,
    description: `Information about ${pageTitle}`,
  };
}

/**
 * This is the main page component.
 * By typing the props directly in the function signature like this:
 * ({ params }: PageProps)
 * ...you ensure there is no type mismatch. This is the fix for your error.
 */
export default function TopicPage({ params }: PageProps) {
  const { topic, slug } = params;

  // --- Your Logic Here ---
  // In your original code, you looked for data in an `allTopics` array.
  // You can add that logic back here. If no data is found, call notFound().
  const dataExists = true; // Placeholder for your data fetching/finding logic.

  if (!dataExists) {
    // This will render the nearest not-found.tsx file
    notFound();
  }
  // --- End of Your Logic ---

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Topic: <span style={{ color: '#0070f3' }}>{topic}</span></h1>
      <p style={{ fontSize: '1.2rem' }}>
        Content for slug: <strong style={{ color: '#f5a623' }}>{slug}</strong>
      </p>
      <div>
        {/* Your client components and page content would go here */}
      </div>
    </main>
  );
}