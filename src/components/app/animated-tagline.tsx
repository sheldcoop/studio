
'use client';

import { taglines } from '@/lib/site';

export function AnimatedTagline() {
  const animatedPart = taglines.map(t => t[1]);

  return (
    <div>
      {/* This h2 is for SEO and screen readers, providing a stable, non-animated version */}
      <h2 className="sr-only">From Data to Insight, From Model to Alpha.</h2>
      <div
        aria-hidden="true"
        className="font-headline text-5xl font-bold tracking-tight md:text-6xl"
      >
        <span className="inline-block h-14">
          <span className="text-primary">From Insight to </span>
          <span className="relative">
            <span className="invisible">{animatedPart[0]}</span>
            <span
              className="absolute left-0 text-primary overflow-hidden whitespace-nowrap animate-[typing_2s_steps(8,end)_1s_1_normal_both,blink_1s_step-end_infinite] border-r-2"
            >
              {animatedPart[0]}
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
