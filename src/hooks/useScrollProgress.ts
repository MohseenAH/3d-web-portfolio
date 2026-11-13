import { useState, useEffect } from 'react';
import { soundEngine } from '../services/SpatialSoundEngine';

interface ScrollProgressState {
  scrollProgress: number;
  scrollVelocity: number;
  activeSection: string;
}

/**
 * ============================================================================
 * Hook: useScrollProgress
 * Tracks normalized scroll progress [0, 1], scroll velocity, and active section.
 * ============================================================================
 */
export function useScrollProgress(sectionIds: string[] = ['hero', 'about', 'creations', 'contact']): ScrollProgressState {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentY = window.scrollY;
      const progress = totalHeight > 0 ? Math.min(Math.max(currentY / totalHeight, 0), 1) : 0;
      const velocity = currentY - lastScrollY;

      setScrollProgress(progress);
      setScrollVelocity(velocity);
      lastScrollY = currentY;
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
      observer.disconnect();
    };
  }, [sectionIds]);

  return { scrollProgress, scrollVelocity, activeSection };
}
