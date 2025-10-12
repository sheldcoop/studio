
'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

// This page is deprecated. All learning path overviews are now handled by /learning-paths/[pathSlug].
// This component acts as a safety net to redirect any stray traffic.
export default function DeprecatedPathPage() {
  useEffect(() => {
    redirect('/learning-paths');
  }, []);

  return null;
}
