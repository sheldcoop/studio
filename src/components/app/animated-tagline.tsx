
'use client';

import { useState, useEffect } from 'react';
import { taglines } from '@/lib/data';

export function AnimatedTagline() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [animatedText, setAnimatedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentAnimatedPart = taglines[taglineIndex][1];
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const delayAfterTyping = 1500;

    const handleTyping = () => {
      if (isDeleting) {
        if (animatedText.length > 0) {
          setAnimatedText((prev) => prev.substring(0, prev.length - 1));
        } else {
          setIsDeleting(false);
          setTaglineIndex((prev) => (prev + 1) % taglines.length);
        }
      } else {
        if (animatedText !== currentAnimatedPart) {
          setAnimatedText(currentAnimatedPart.substring(0, animatedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delayAfterTyping);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(typingTimeout);
  }, [animatedText, isDeleting, taglineIndex]);

  const staticPart = taglines[taglineIndex][0];

  return (
    <h1 className="font-headline text-5xl font-bold tracking-tight md:text-6xl">
      <span className="inline-block h-14">
        <span>{staticPart}</span>
        <span className="text-primary">{animatedText}</span>
        <span className="animate-blink border-r-2 border-foreground align-bottom" aria-hidden="true"></span>
      </span>
    </h1>
  );
}
