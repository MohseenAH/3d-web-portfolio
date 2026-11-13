import React from 'react';
import { CreationItem } from '../../types';
import { PALETTE } from '../../config/theme';
import { CreationCard } from '../creations/CreationCard';

interface CreationsProps {
  creations: CreationItem[];
  onSelectCreation: (creation: CreationItem) => void;
}

/**
 * ============================================================================
 * CREATIONS SECTION COMPONENT (#creations)
 * Exhibits showcase with interactive 3D physical tilt cards.
 * ============================================================================
 */
export const Creations: React.FC<CreationsProps> = ({ creations, onSelectCreation }) => {
  return (
    <section
      id="creations"
      className="relative z-20 w-full min-h-screen max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 py-28 sm:py-36 flex flex-col justify-center"
    >
      <div className="space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: PALETTE.blueGrey }}>
            PORTFOLIO EXHIBITS
          </p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
            Featured Universe Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creations.map((item) => (
            <CreationCard
              key={item.id}
              creation={item}
              onClick={() => onSelectCreation(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
