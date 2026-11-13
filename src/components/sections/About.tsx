import React from 'react';
import { Cpu, Sparkles, Eye } from 'lucide-react';
import { AboutContent } from '../../types';
import { PALETTE } from '../../config/theme';
import { soundEngine } from '../../services/SpatialSoundEngine';

interface AboutProps {
  about: AboutContent;
}

/**
 * ============================================================================
 * ABOUT SECTION COMPONENT (#about)
 * Algorithmic synthesis, poetic restraint, and core creative pillars.
 * ============================================================================
 */
export const About: React.FC<AboutProps> = ({ about }) => {
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

  return (
    <section
      id="about"
      className="relative z-20 w-full min-h-screen max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 py-28 sm:py-36 flex flex-col justify-center"
    >
      <div className="max-w-3xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: PALETTE.blueGrey }}>
            {about.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-5xl font-light leading-tight tracking-tight">
            {about.title}
          </h2>
        </div>

        <p className="text-base sm:text-lg leading-relaxed font-light" style={{ opacity: 0.88 }}>
          {about.lead}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {about.pillars.map((pillar, i) => (
            <div
              key={i}
              data-magnetic="true"
              onMouseEnter={() => soundEngine.playGlassChime(1100 + i * 200)}
              className="p-6 rounded-3xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{
                backgroundColor: 'rgba(234, 248, 255, 0.65)',
                borderColor: PALETTE.iceBlue,
                boxShadow: '0 12px 35px rgba(20, 43, 67, 0.05)',
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
