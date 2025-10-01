
'use client';

import { useState, useEffect } from 'react';
import { taglines } from '@/lib/site';

export function AnimatedTagline() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTagline, setCurrentTagline] = useState(taglines[0]);

  useEffect(() => {
    if (subIndex === currentTagline[1].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && subIndex === 0) {
      const nextIndex = (index + 1) % taglines.length;
      setIndex(nextIndex);
      setCurrentTagline(taglines[nextIndex]);
      setIsDeleting(false);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, currentTagline]);

  return (
    <div>
      {/* This h2 is for SEO and screen readers, providing a stable, non-animated version */}
      <h2 className="sr-only">From Data to Insight, From Model to Alpha.</h2>
      <div
        aria-hidden="true"
        className="font-headline text-5xl font-bold tracking-tight md:text-6xl"
      >
        <span className="inline-block h-14">
          <span className="text-primary">{currentTagline[0]}</span>
          <span className="relative">
            <span className="invisible">{currentTagline[1]}</span>
            <span
              className="absolute left-0 text-primary"
            >
              {currentTagline[1].substring(0, subIndex)}
            </span>
            <span className="animate-blink border-r-2 border-primary"></span>
          </span>
        </span>
      </div>
    </div>
  );
}
