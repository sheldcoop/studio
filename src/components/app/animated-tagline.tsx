'use client';

import { useState, useEffect } from 'react';
import { taglines } from '@/lib/data';
import { cn } from '@/lib/utils';

export function AnimatedTagline() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        setFade(true);
      }, 500); // fade out duration
    }, 3000); // display duration for each tagline

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
      <span
        className={cn(
          'transition-opacity duration-500',
          fade ? 'opacity-100' : 'opacity-0'
        )}
      >
        <span>{taglines[taglineIndex][0]}</span>
        <span className="text-primary">{taglines[taglineIndex][1]}</span>
      </span>
    </h1>
  );
}
