import React, { useState, useRef } from 'react';
import { ArrowUpRight, Compass } from 'lucide-react';
import { CreationItem } from '../../types';
import { PALETTE } from '../../config/theme';
import { soundEngine } from '../../services/SpatialSoundEngine';

interface CreationCardProps {
  creation: CreationItem;
  onClick: () => void;
}

/**
 * ============================================================================
 * 3D TILT CREATION CARD
 * Interactive physical tilt physics with dynamic radial specular glare overlay.
 * ============================================================================
 */
export const CreationCard: React.FC<CreationCardProps> = ({ creation, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 2; // -1 to 1
    const yPct = (y / rect.height - 0.5) * 2;

    const rotateX = -yPct * 12; // 12 deg maximum tilt
    const rotateY = xPct * 12;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlareStyle({
      opacity: 0.35,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onClick={() => {
        soundEngine.playGlassChime(1540);
        onClick();
      }}
      onMouseEnter={() => soundEngine.playGlassChime(1200)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-magnetic="true"
      className="group relative rounded-3xl border p-8 flex flex-col justify-between cursor-pointer backdrop-blur-md transition-transform duration-200 ease-out overflow-hidden"
      style={{
        transform: transformStyle,
        backgroundColor: 'rgba(234, 248, 255, 0.72)',
        borderColor: PALETTE.iceBlue,
        boxShadow: '0 20px 50px rgba(20, 43, 67, 0.08)',
      }}
    >
      {/* Dynamic Radial Specular Glare Overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: glareStyle.opacity,
          background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 65%)`,
        }}
      />

      <div>
        <div className="flex items-center justify-between text-xs mb-4">
          <span className="uppercase tracking-[0.2em] font-semibold" style={{ color: PALETTE.blueGrey }}>
            {creation.category}
          </span>
          <span className="font-mono" style={{ color: PALETTE.blueGrey }}>{creation.id}</span>
        </div>

        {/* Visual Card Shader Placeholder Container */}
        <div
          className="w-full h-44 rounded-2xl mb-6 overflow-hidden flex items-center justify-center border transition-all duration-500 group-hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, rgba(234, 248, 255, 0.9) 0%, ${creation.accentColor}40 100%)`,
            borderColor: PALETTE.iceBlue,
          }}
        >
          <Compass className="w-10 h-10 opacity-30 transition-transform duration-700 group-hover:rotate-45" />
        </div>

        <h3 className="text-2xl font-light mb-3">{creation.title}</h3>
        <p className="text-xs sm:text-sm leading-relaxed font-light mb-6" style={{ opacity: 0.8 }}>
          {creation.summary}
        </p>
      </div>

      <div
        className="pt-4 border-t flex items-center justify-between text-xs font-semibold uppercase tracking-wider"
        style={{ borderColor: PALETTE.iceBlue }}
      >
        <span>Explore Work</span>
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </div>
  );
};
