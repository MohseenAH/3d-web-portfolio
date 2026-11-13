import React from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';
import { ContactContent } from '../../types';
import { PALETTE } from '../../config/theme';
import { soundEngine } from '../../services/SpatialSoundEngine';

interface ContactProps {
  contact: ContactContent;
}

/**
 * ============================================================================
 * CONTACT SECTION COMPONENT (#contact)
 * Inquiries, collaboration avenues, direct email card & social channels.
 * ============================================================================
 */
export const Contact: React.FC<ContactProps> = ({ contact }) => {
  return (
    <section
      id="contact"
      className="relative z-20 w-full min-h-screen max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 py-28 sm:py-36 flex flex-col justify-center"
    >
      <div className="max-w-3xl space-y-10">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] font-semibold" style={{ color: PALETTE.blueGrey }}>
            {contact.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
            {contact.title}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed font-light" style={{ opacity: 0.82 }}>
            {contact.subtitle}
          </p>
        </div>

        {/* Direct Studio Email Box */}
        <div
          data-magnetic="true"
          onMouseEnter={() => soundEngine.playGlassChime(1500)}
          className="p-8 rounded-3xl border backdrop-blur-md space-y-4"
          style={{
            backgroundColor: 'rgba(234, 248, 255, 0.8)',
            borderColor: PALETTE.iceBlue,
            boxShadow: '0 20px 60px rgba(20, 43, 67, 0.08)',
          }}
        >
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: PALETTE.blueGrey }}>
            Direct Studio Channel
          </div>
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-3 text-2xl sm:text-3xl font-light hover:opacity-75 transition-opacity"
          >
            <Mail className="w-6 h-6" />
            <span>{contact.email}</span>
          </a>
        </div>

        {/* Social Presence Grid */}
        <div className="space-y-3 pt-2">
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: PALETTE.blueGrey }}>
            Social Presence
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contact.socials.map((soc) => (
              <a
                key={soc.platform}
                href={soc.url}
                data-magnetic="true"
                onMouseEnter={() => soundEngine.playGlassChime(1300)}
                onClick={(e) => {
                  if (soc.url.startsWith('#')) e.preventDefault();
                }}
                className="p-4 rounded-2xl border flex items-center justify-between text-sm group backdrop-blur-sm transition-all hover:-translate-y-1"
                style={{ backgroundColor: PALETTE.cloudWhite, borderColor: PALETTE.iceBlue }}
              >
                <span className="font-semibold">{soc.platform}</span>
                <span className="flex items-center gap-1 text-xs opacity-60">
                  {soc.handle}
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
