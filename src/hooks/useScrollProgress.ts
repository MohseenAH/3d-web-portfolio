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
 * Tracks normalized scroll progress [0, 1] and active section smoothly on scroll.
 * Uses requestAnimationFrame batching to synchronize with display refresh cycles.
 * ============================================================================
 */
export function useScrollProgress(sectionIds: string[] = ['hero', 'about', 'creations', 'contact']): ScrollProgressState {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const scrollVelocityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const computeProgress = () => {
      const currentY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(Math.max(currentY / totalHeight, 0), 1) : 0;
      return progress;
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const velocity = currentY - lastScrollY;
      scrollVelocityRef.current = velocity;
      lastScrollY = currentY;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          setScrollProgress(computeProgress());
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial measurement
    setScrollProgress(computeProgress());

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
