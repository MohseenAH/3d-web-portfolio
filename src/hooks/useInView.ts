import { useState, useEffect, useRef } from 'react';

/**
 * ============================================================================
 * Hook: useInView
 * Detects when a section enters the viewport and activates its entrance choreography.
 * Once activated, it stays true so the section content remains gracefully visible.
 * ============================================================================
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  threshold: number = 0.15,
  rootMargin: string = '0px 0px -50px 0px'
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if element is already within viewport on initial mount
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return [ref, isInView];
}
