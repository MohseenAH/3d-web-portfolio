import React from 'react';
import { Cpu, Sparkles, Eye } from 'lucide-react';
import { AboutContent } from '../../types';
import { PALETTE } from '../../config/theme';
import { soundEngine } from '../../services/SpatialSoundEngine';
import { useInView } from '../../hooks/useInView';
import { animationConfig } from '../../config/animationConfig';

interface AboutProps {
  about: AboutContent;
  reducedMotion?: boolean;
}

/**
 * ============================================================================
 * ABOUT SECTION COMPONENT (#about)
 * Algorithmic synthesis, poetic restraint, and core creative pillars.
 * Distinct choreography: Subtle horizontal slide-in with staggered pillar cards.
 * ============================================================================
 */
export const About: React.FC<AboutProps> = ({ about, reducedMotion = false }) => {
  const [sectionRef, isInView] = useInView<HTMLElement>(0.15);
  const cfg = animationConfig.sectionTransitions.about;

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Eye':
        return <Eye className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const isVisible = reducedMotion || isInView;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-20 w-full min-h-screen max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 py-28 sm:py-36 flex flex-col justify-center"
    >
      <div className="max-w-3xl space-y-8">
        {/* Section Header: Subtle horizontal slide-in from left */}
        <div
          className="space-y-3 transition-about-slide"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? 'translate3d(0, 0, 0)'
              : reducedMotion
              ? 'none'
              : `translate3d(-${cfg.headerSlideDistancePx}px, 0, 0)`,
            transitionDuration: `${cfg.durationMs}ms`,
          }}
        >
          <p className="text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: PALETTE.blueGrey }}>
            {about.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-5xl font-light leading-tight tracking-tight">
            {about.title}
          </h2>
        </div>

        {/* Lead Statement */}
        <p
          className="text-base sm:text-lg leading-relaxed font-light transition-about-slide"
          style={{
            opacity: isVisible ? 0.88 : 0,
            transform: isVisible
              ? 'translate3d(0, 0, 0)'
              : reducedMotion
              ? 'none'
              : `translate3d(-${cfg.headerSlideDistancePx * 0.75}px, 0, 0)`,
            transitionDuration: `${cfg.durationMs}ms`,
            transitionDelay: reducedMotion ? '0ms' : '120ms',
          }}
        >
          {about.lead}
        </p>

        {/* Staggered Pillar Cards (Horizontal staggered reveal) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {about.pillars.map((pillar, i) => (
            <div
              key={i}
              data-magnetic="true"
              onMouseEnter={() => soundEngine.playGlassChime(1100 + i * 200)}
              className="p-6 rounded-3xl border backdrop-blur-md transition-about-slide hover:-translate-y-1 cursor-default"
              style={{
                backgroundColor: 'rgba(234, 248, 255, 0.65)',
                borderColor: PALETTE.iceBlue,
                boxShadow: '0 12px 35px rgba(20, 43, 67, 0.05)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? 'translate3d(0, 0, 0)'
                  : reducedMotion
                  ? 'none'
                  : 'translate3d(-24px, 0, 0)',
                transitionDuration: `${cfg.durationMs}ms`,
                transitionDelay: reducedMotion ? '0ms' : `${200 + i * cfg.pillarStaggerMs}ms`,
              }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 border"
                style={{ backgroundColor: PALETTE.iceBlue, borderColor: PALETTE.blueGrey }}
              >
                {getPillarIcon(pillar.icon)}
              </div>
              <h3 className="text-lg font-semibold mb-2">{pillar.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed font-light" style={{ opacity: 0.78 }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
