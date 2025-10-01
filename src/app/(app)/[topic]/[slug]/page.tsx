// src/app/(app)/[topic]/[slug]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Define the shape of the props object that Next.js will pass to this page.
type PageProps = {
  params: {
    topic: string;
    slug: string;
  };
};

/**
 * Generates dynamic metadata for the page based on the route parameters.
 * Using the `PageProps` type ensures `params` is correctly typed as an object.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic, slug } = params;

  // Example: You would typically fetch data here to generate a real title.
  const pageTitle = `${topic.charAt(0).toUpperCase() + topic.slice(1)}: ${slug}`;

  return {
    title: pageTitle,
    description: `Details about ${pageTitle}`,
  };
}

/**
 * This is the main page component for the dynamic route.
 * It uses the same `PageProps` type to correctly define its props.
 * This resolves the "Promise<any>" type error.
 */
export default function TopicPage({ params }: PageProps) {
  const { topic, slug } = params;

  // --- Placeholder for your data fetching logic ---
  // In a real application, you might fetch data based on the params.
  // If the data doesn't exist, you can call notFound().
  const dataExists = true; // Replace with your actual data validation.

  if (!dataExists) {
    notFound(); // Renders the closest not-found.tsx file.
  }
  // --- End of logic ---

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>
        Topic: <span style={{ color: '#0070f3' }}>{topic}</span>
      </h1>
      <p style={{ fontSize: '1.2rem' }}>
        Content for slug: <strong style={{ color: '#f5a623' }}>{slug}</strong>
      </p>
      <div>{/* Your page content goes here */}</div>
    </main>
  );
}
