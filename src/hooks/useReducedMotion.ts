import { useState, useEffect } from 'react';

/**
 * ============================================================================
 * Hook: useReducedMotion
 * Detects system preference for reduced motion while allowing manual simulation override.
 * ============================================================================
 */
export function useReducedMotion(override?: boolean): [boolean, (value: boolean | ((prev: boolean) => boolean)) => void] {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const activeValue = override !== undefined ? override : reducedMotion;

  return [activeValue, setReducedMotion];
}
