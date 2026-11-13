import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { NavigationItem } from '../../types';
import { PALETTE } from '../../config/theme';

interface MobileMenuProps {
  isOpen: boolean;
  navigation: NavigationItem[];
  subtitle: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigate: (sectionId: string) => void;
}

/**
 * ============================================================================
 * MOBILE FULL-SCREEN NAVIGATION OVERLAY
 * ============================================================================
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navigation,
  subtitle,
  soundEnabled,
  onToggleSound,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-30 pt-24 px-8 pb-12 flex flex-col justify-between backdrop-blur-2xl md:hidden font-sans animate-fade-in"
      style={{
        backgroundColor: 'rgba(234, 248, 255, 0.96)',
        color: PALETTE.deepNavy,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: PALETTE.blueGrey }}>
          Navigation Menu
        </p>
        <div className="space-y-4">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="block text-2xl font-bold text-left tracking-wide w-full hover:opacity-75 transition-opacity"
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={onToggleSound}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border"
          style={{
            backgroundColor: soundEnabled ? PALETTE.deepNavy : 'transparent',
            color: soundEnabled ? PALETTE.cloudWhite : PALETTE.deepNavy,
            borderColor: PALETTE.blueGrey,
          }}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Spatial Audio Active' : 'Enable Audio Soundscape'}</span>
        </button>
      </div>

      <div className="pt-6 border-t" style={{ borderColor: PALETTE.iceBlue }}>
        <p className="text-xs opacity-60 uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
};
