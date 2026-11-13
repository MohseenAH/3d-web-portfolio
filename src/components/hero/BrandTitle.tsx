import React from 'react';

interface BrandTitleProps {
  title: string;
  entered: boolean;
  reducedMotion: boolean;
}

/**
 * ============================================================================
 * BRAND TITLE COMPONENT
 * Montserrat 700 BOLD single-line typography with staggered letter entrance.
 * ============================================================================
 */
export const BrandTitle: React.FC<BrandTitleProps> = ({
  title,
  entered,
  reducedMotion,
}) => {
  const letters = (title || 'ARCLUNOR').split('');

  return (
    <div className="w-full overflow-visible py-1 sm:py-1.5">
      <h1 className="arclunor-title-bold flex" aria-label={title}>
        {letters.map((char, index) => (
          <span
            key={index}
            className="inline-block transition-all duration-1000 ease-out"
            style={{
              transitionDelay: reducedMotion ? '0ms' : `${120 + index * 60}ms`,
              opacity: entered ? 1 : 0,
              transform: entered ? 'translate3d(0, 0, 0)' : 'translate3d(0, 40%, 0)',
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};
