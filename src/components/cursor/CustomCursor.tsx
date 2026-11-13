import React, { useState, useEffect, useRef } from 'react';

/**
 * ============================================================================
 * CUSTOM DUAL-RING MAGNETIC CURSOR
 * Precision center dot + smooth-lerp outer magnetic expansion ring.
 * ============================================================================
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId: number;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest('button, a, [data-magnetic="true"]');
      setIsHovered(!!isInteractive);
    };

    const render = () => {
      // Smooth lerp ring behind cursor
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        const scale = isHovered ? 2.2 : 1.0;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    render();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Central Sharp White Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white shadow-sm transition-opacity duration-300"
        style={{ willChange: 'transform' }}
      />
      {/* Outer Spring-Lerp Magnetic Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border transition-colors duration-300 ${
          isHovered
            ? 'border-white/80 bg-white/10 backdrop-blur-[1px]'
            : 'border-white/40 bg-transparent'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};
