// This file is now redundant because all topics are handled by /app/(app)/topics/[slug]/page.tsx
// It can be safely removed.
import { redirect } from 'next/navigation';

export default function DeprecatedStatisticsTopicPage() {
    // This is a failsafe. In reality, this page should not be hit if the sitemap and links are correct.
    redirect('/topics');
}
