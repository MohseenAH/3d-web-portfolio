import React from 'react';
import { CreationItem } from '../../types';
import { PALETTE } from '../../config/theme';
import { CreationCard } from '../creations/CreationCard';
import { useInView } from '../../hooks/useInView';
import { animationConfig } from '../../config/animationConfig';

interface CreationsProps {
  creations: CreationItem[];
  onSelectCreation: (creation: CreationItem) => void;
  reducedMotion?: boolean;
}

/**
 * ============================================================================
 * CREATIONS SECTION COMPONENT (#creations)
 * Exhibits showcase with interactive 3D physical tilt cards.
 * Distinct choreography: Staggered scale-and-fade reveal for the 3D tilt cards.
 * ============================================================================
 */
export const Creations: React.FC<CreationsProps> = ({
  creations,
  onSelectCreation,
  reducedMotion = false,
}) => {
  const [sectionRef, isInView] = useInView<HTMLElement>(0.15);
  const cfg = animationConfig.sectionTransitions.creations;

  const isVisible = reducedMotion || isInView;

  return (
    <section
      ref={sectionRef}
      id="creations"
      className="relative z-20 w-full min-h-screen max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 py-28 sm:py-36 flex flex-col justify-center"
    >
      <div className="space-y-12">
        {/* Section Header */}
        <div
          className="max-w-2xl space-y-3 transition-creations-card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? 'translate3d(0, 0, 0)'
              : reducedMotion
              ? 'none'
              : 'translate3d(0, 20px, 0)',
            transitionDuration: `${cfg.durationMs}ms`,
          }}
        >
          <p className="text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: PALETTE.blueGrey }}>
            PORTFOLIO EXHIBITS
          </p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
            Featured Universe Works
          </h2>
        </div>

        {/* Staggered scale-and-fade reveal for 3D tilt cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creations.map((item, i) => (
            <div
              key={item.id}
              className="transition-creations-card"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? 'scale(1) translate3d(0, 0, 0)'
                  : reducedMotion
                  ? 'none'
                  : `scale(${cfg.initialScale}) translate3d(0, 28px, 0)`,
                transitionDuration: `${cfg.durationMs}ms`,
                transitionDelay: reducedMotion ? '0ms' : `${i * cfg.cardStaggerMs}ms`,
              }}
            >
              <CreationCard
                creation={item}
                onClick={() => onSelectCreation(item)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
