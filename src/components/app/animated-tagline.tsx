'use client';

import { useState, useEffect, useRef } from 'react';

const taglines = [
  ['From Data to ', 'Insight'],
  ['From Model to ', 'Alpha'],
  ['From Code to ', 'Impact'],
  ['Journey to ', 'Quant'],
] as const;

type AnimationPhase = 'typing' | 'waiting' | 'deleting' | 'finished';

export function AnimatedTagline() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>('typing');
  
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Main animation logic
  useEffect(() => {
    if (phase === 'finished') return;

    const currentText = taglines[taglineIndex][1];
    const isLastTagline = taglineIndex === taglines.length - 1;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseDuration = 1500;

    const animate = () => {
      switch (phase) {
        case 'typing':
          if (charCount < currentText.length) {
            setCharCount(c => c + 1);
          } else {
            // If it's the last tagline, finish the animation
            if (isLastTagline) {
              setPhase('finished');
            } else {
              setPhase('waiting');
            }
          }
          break;

        case 'waiting':
          setPhase('deleting');
          break;

        case 'deleting':
          if (charCount > 0) {
            setCharCount(c => c - 1);
          } else {
            setPhase('typing');
            setTaglineIndex(i => i + 1);
          }
          break;
        case 'finished':
          // Do nothing
          return;
      }
    };

    let timeoutDuration: number;
    switch(phase) {
        case 'typing':
            timeoutDuration = typeSpeed;
            break;
        case 'waiting':
            timeoutDuration = pauseDuration;
            break;
        case 'deleting':
            timeoutDuration = deleteSpeed;
            break;
        default:
            timeoutDuration = 0;
            break;
    }

    if (timeoutDuration > 0) {
        timeoutRef.current = setTimeout(animate, timeoutDuration);
    } else {
        animate();
    }
    

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [charCount, phase, taglineIndex]);

  const staticPart = taglines[taglineIndex][0];
  const animatedPart = taglines[taglineIndex][1];
  const displayText = animatedPart.substring(0, charCount);

  return (
    <div>
      <h2 className="sr-only">
        From Data to Insight, From Model to Alpha, From Code to Impact, Journey to Quant.
      </h2>
      <div
        aria-hidden="true"
        className="font-headline text-5xl font-bold tracking-tight md:text-6xl"
      >
        <span className="inline-block h-14">
          <span>{staticPart}</span>
          <span className="text-primary">{displayText}</span>
          {phase !== 'finished' && (
            <span
              className="animate-blink border-r-2 border-foreground align-bottom"
              aria-hidden="true"
            />
          )}
        </span>
      </div>
    </div>
  );
}
