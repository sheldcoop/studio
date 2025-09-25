'use client';

import { useState, useEffect } from 'react';
import { taglines } from '@/lib/data';
import { cn } from '@/lib/utils';

export function AnimatedTagline() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTagline = taglines[taglineIndex][0] + taglines[taglineIndex][1];
    
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const delayAfterTyping = 1500;

    const handleTyping = () => {
      if (isDeleting) {
        if (text.length > 0) {
          setText((prev) => prev.substring(0, prev.length - 1));
        } else {
          setIsDeleting(false);
          setTaglineIndex((prev) => (prev + 1) % taglines.length);
        }
      } else {
        if (text !== currentTagline) {
          setText(currentTagline.substring(0, text.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delayAfterTyping);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(typingTimeout);
  }, [text, isDeleting, taglineIndex]);

  const firstPart = taglines[taglineIndex][0];
  
  const displayText = (
    <>
      <span>{text.substring(0, firstPart.length)}</span>
      <span className="text-primary">{text.substring(firstPart.length)}</span>
    </>
  );

  return (
    <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
      <span className="inline-block h-12">
        {displayText}
        <span className="animate-blink border-r-2 border-foreground align-bottom" aria-hidden="true"></span>
      </span>
    </h1>
  );
}
