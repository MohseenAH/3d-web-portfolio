import { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../services/SpatialSoundEngine';

interface ScrollProgressState {
  scrollProgress: number;
  scrollVelocity: number;
  activeSection: string;
}

/**
 * ============================================================================
 * Hook: useScrollProgress
 * Tracks normalized scroll progress and active section with RAF throttling
 * to prevent unnecessary React virtual DOM re-renders during high-frequency scrolling.
 * ============================================================================
 */
export function useScrollProgress(sectionIds: string[] = ['hero', 'about', 'creations', 'contact']): ScrollProgressState {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const scrollVelocityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const velocity = currentY - lastScrollY;
      scrollVelocityRef.current = velocity;
      lastScrollY = currentY;

      // Throttle React state updates to avoid thrashing on every pixel
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? Math.min(Math.max(window.scrollY / totalHeight, 0), 1) : 0;

          // Only trigger React re-render if progress delta is meaningful (>= 0.005) or at bounds
          if (
            Math.abs(progress - lastProgressRef.current) >= 0.005 ||
            progress === 0 ||
            progress === 1
          ) {
            lastProgressRef.current = progress;
            setScrollProgress(progress);
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Intersection observer for section tracking
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveSection(id);
          const idx = sectionIds.indexOf(id);
          if (idx !== -1) {
            soundEngine.playGlassChime(880 + idx * 220);
          }
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      observer.disconnect();
    };
  }, [sectionIds]);

  return { scrollProgress, scrollVelocity: scrollVelocityRef.current, activeSection };
}
