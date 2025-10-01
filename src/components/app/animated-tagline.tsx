'use client';

import { useState, useEffect, useRef } from 'react';
import { taglines } from '@/lib/site';

export function AnimatedTagline() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [animatedText, setAnimatedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPaused(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if(ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if(ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPaused) {
      return;
    }

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
  }, [animatedText, isDeleting, taglineIndex, isPaused]);

  const staticPart = taglines[taglineIndex][0];

  return (
    <div ref={ref}>
      {/* This h2 is for SEO and screen readers, providing a stable, non-animated version */}
      <h2 className="sr-only">From Data to Insight, From Model to Alpha.</h2>
      <div
        aria-hidden="true"
        className="font-headline text-5xl font-bold tracking-tight md:text-6xl"
      >
        <span className="inline-block h-14">
          <span>{staticPart}</span>
          <span className="text-primary">{animatedText}</span>
          <span
            className="animate-blink border-r-2 border-foreground align-bottom"
            aria-hidden="true"
          ></span>
        </span>
      </div>
    </div>
  );
}
