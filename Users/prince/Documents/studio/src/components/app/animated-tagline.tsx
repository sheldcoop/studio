
'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const taglines = [
  ['From ', 'Data', ' to ', 'Insight'],
  ['From ', 'Insight', ' to ', 'Strategy'],
  ['From ', 'Strategy', ' to ', 'Alpha'],
  ['From ', 'Alpha', ' to ', 'Quant'],
  ['', 'Journey', ' to ', 'Quant'],
] as const;

type AnimationPhase = 'typing-second' | 'typing-fourth' | 'waiting' | 'deleting-fourth' | 'deleting-second' | 'finished';

export function AnimatedTagline() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>('typing-second');
  
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (phase === 'finished') return;

    const isLastTagline = taglineIndex === taglines.length - 1;
    const typeSpeed = 80;
    const deleteSpeed = 30;
    const pauseDuration = 1000;

    const animate = () => {
      const secondWord = taglines[taglineIndex][1];
      const fourthWord = taglines[taglineIndex][3];

      let nextTimeout = typeSpeed;

      switch (phase) {
        case 'typing-second':
          if (charCount < secondWord.length) {
            setCharCount(c => c + 1);
          } else {
            setPhase('typing-fourth');
            setCharCount(0);
          }
          break;

        case 'typing-fourth':
          if (charCount < fourthWord.length) {
            setCharCount(c => c + 1);
          } else {
            if (isLastTagline) {
              setPhase('finished');
              return; // Stop animation
            } else {
              setPhase('waiting');
              nextTimeout = pauseDuration;
            }
          }
          break;

        case 'waiting':
          setPhase('deleting-fourth');
          nextTimeout = deleteSpeed;
          break;

        case 'deleting-fourth':
          if (charCount > 0) {
            setCharCount(c => c - 1);
            nextTimeout = deleteSpeed;
          } else {
            setPhase('deleting-second');
            setCharCount(secondWord.length);
            nextTimeout = deleteSpeed;
          }
          break;

        case 'deleting-second':
          if (charCount > 0) {
            setCharCount(c => c - 1);
            nextTimeout = deleteSpeed;
          } else {
            setTaglineIndex(i => i + 1);
            setPhase('typing-second');
          }
          break;
      }
      timeoutRef.current = setTimeout(animate, nextTimeout);
    };

    // Initial call
    timeoutRef.current = setTimeout(animate, typeSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [charCount, phase, taglineIndex]);

  const prefix = taglines[taglineIndex][0];
  const secondWord = taglines[taglineIndex][1];
  const connector = taglines[taglineIndex][2];
  const fourthWord = taglines[taglineIndex][3];

  const displaySecond = phase === 'deleting-second' 
    ? secondWord.substring(0, charCount)
    : secondWord;
    
  const displayFourth = (phase === 'typing-fourth' || phase === 'deleting-fourth' || phase === 'waiting' || phase === 'finished')
    ? fourthWord.substring(0, charCount)
    : '';

  return (
    <div>
      <h2 className="sr-only">
        From Data to Insight, From Insight to Strategy, From Strategy to Alpha, From Alpha to Quant, Journey to Quant
      </h2>
      <div
        aria-hidden="true"
        className="font-headline text-5xl font-bold tracking-tight md:text-6xl"
      >
        <span className="inline-block h-14">
          <span className="text-foreground">{prefix}</span>
          <span className="text-primary/90">
            {displaySecond}
          </span>
          <span className="text-foreground">{connector}</span>
          <span className="text-primary">
            {displayFourth}
          </span>
          {phase !== 'finished' && (
            <span
              className="animate-blink border-r-2 border-primary align-bottom"
            />
          )}
        </span>
      </div>
    </div>
  );
}
