
'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook to detect the scroll direction (up or down).
 * It listens to the window's scroll event and determines the direction
 * based on the change in scroll position.
 * @returns 'up' | 'down' | null - The current scroll direction.
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // We add a threshold (e.g., > 100px) to prevent the header from
      // disappearing on small scrolls at the top of the page.
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return scrollDirection;
}
