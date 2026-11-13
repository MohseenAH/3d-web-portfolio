import React from 'react';
import { ChevronRight } from 'lucide-react';
import { HeroContent } from '../../types';
import { PALETTE } from '../../config/theme';
import { soundEngine } from '../../services/SpatialSoundEngine';
import { BrandTitle } from './BrandTitle';

interface HeroProps {
  hero: HeroContent;
  entered: boolean;
  reducedMotion: boolean;
  ctaHovered: boolean;
  setCtaHovered: (hovered: boolean) => void;
  onExploreClick: () => void;
}

/**
 * ============================================================================
 * HERO SECTION COMPONENT (#hero)
 * Atmospheric entrance with categories, single-line brand title, headline & CTA.
 * ============================================================================
 */
export const Hero: React.FC<HeroProps> = ({
  hero,
  entered,
  reducedMotion,
  ctaHovered,
  setCtaHovered,
  onExploreClick,
}) => {
  return (
    <section
      id="hero"
      className="relative z-20 w-full min-h-screen max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-end lg:justify-center pt-24 sm:pt-28 md:pt-32 pb-12 lg:py-0"
    >
      <div className="max-w-4xl space-y-3 sm:space-y-4">
        {/* Category Line */}
        <p
          className={`text-[11px] sm:text-xs uppercase tracking-[0.14em] font-bold transition-all duration-1000 delay-150 ${
            entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            color: '#FFFFFF',
            textShadow: '0 2px 10px rgba(20, 43, 67, 0.4)',
          }}
        >
          {hero.categories}
        </p>

        {/* ARCLUNOR Main Brand Title: Montserrat 700 BOLD */}
        <BrandTitle
          title={hero.title}
          entered={entered}
          reducedMotion={reducedMotion}
        />

        {/* Main Headline & Supporting Subtitle */}
        <div
          className={`space-y-1.5 sm:space-y-2 transition-all duration-1000 delay-500 ${
            entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.12]"
            style={{
              color: '#FFFFFF',
              textShadow: '0 2px 14px rgba(20, 43, 67, 0.35)',
            }}
          >
            {hero.headline}
          </h2>

          <p
            className="text-base sm:text-lg md:text-xl font-light tracking-wide"
            style={{
              color: '#EAF8FF',
              textShadow: '0 1px 8px rgba(20, 43, 67, 0.3)',
            }}
          >
            {hero.subtitle}
          </p>
        </div>

        {/* Primary CTA */}
        <div
          className={`pt-2 sm:pt-3 transition-all duration-1000 delay-700 ${
            entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <button
            onClick={onExploreClick}
            onMouseEnter={() => {
              setCtaHovered(true);
              soundEngine.playGlassChime(1440);
            }}
            onMouseLeave={() => setCtaHovered(false)}
            data-magnetic="true"
            className="group inline-flex items-center gap-3.5 px-8 sm:px-9 py-4 rounded-full text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase transition-all duration-300"
            style={{
              backgroundColor: PALETTE.deepNavy,
              color: PALETTE.cloudWhite,
              boxShadow: ctaHovered
                ? '0 20px 45px rgba(20, 43, 67, 0.28)'
                : '0 12px 30px rgba(20, 43, 67, 0.16)',
              transform: ctaHovered ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            <span>{hero.primaryCta}</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
